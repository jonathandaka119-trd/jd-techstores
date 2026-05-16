-- ============================================================
--  JD TechStores – Supabase Database Schema
-- ============================================================
--
--  STEP 1: Run this entire file in Supabase → SQL Editor → Run
--
--  STEP 2: Make yourself admin (replace with your actual email):
--    UPDATE public.profiles SET role = 'admin'
--    WHERE email = 'your-email@example.com';
--
--  STEP 3: Disable email confirmation (for testing):
--    Supabase Dashboard → Authentication → Providers → Email
--    → turn off "Confirm email" → Save
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────
create type user_role as enum ('user', 'storekeeper', 'admin');

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  full_name     text,
  phone         text,
  avatar_url    text,
  role          user_role not null default 'user',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Categories ──────────────────────────────────────────────
create table public.categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Products ────────────────────────────────────────────────
create table public.products (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  slug            text not null unique,
  description     text,
  category_id     uuid references public.categories(id) on delete set null,
  price           numeric(12,2) not null check (price >= 0),
  original_price  numeric(12,2) check (original_price >= 0),
  stock_quantity  integer not null default 0 check (stock_quantity >= 0),
  sku             text not null unique,
  main_image_url  text,
  images          text[] not null default '{}',
  specifications  jsonb not null default '{}',
  tags            text[] not null default '{}',
  rating          numeric(3,2) not null default 0 check (rating between 0 and 5),
  review_count    integer not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Denormalised view with category fields joined
create or replace view public.products_with_category as
  select
    p.*,
    c.name  as category_name,
    c.slug  as category_slug
  from public.products p
  left join public.categories c on c.id = p.category_id
  where p.is_active = true;

-- ─── Orders ──────────────────────────────────────────────────
create type order_status as enum ('pending','processing','shipped','delivered','cancelled');

create table public.orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  order_number     text not null unique,
  status           order_status not null default 'pending',
  total_amount     numeric(12,2) not null,
  tax_amount       numeric(12,2) not null default 0,
  shipping_cost    numeric(12,2) not null default 0,
  discount_amount  numeric(12,2) not null default 0,
  shipping_address jsonb not null default '{}',
  payment_method   text not null default 'card',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Auto-generate order number
create or replace function public.generate_order_number()
returns trigger language plpgsql as $$
begin
  new.order_number := 'JD-' || to_char(now(), 'YYYYMMDD') || '-' ||
                      lpad(floor(random() * 90000 + 10000)::text, 5, '0');
  return new;
end;
$$;

create trigger set_order_number
  before insert on public.orders
  for each row execute procedure public.generate_order_number();

-- ─── Order Items ─────────────────────────────────────────────
create table public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete restrict,
  quantity    integer not null check (quantity > 0),
  unit_price  numeric(12,2) not null,
  created_at  timestamptz not null default now()
);

-- ─── Cart Items ──────────────────────────────────────────────
create table public.cart_items (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  quantity    integer not null default 1 check (quantity > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ─── Wishlist ─────────────────────────────────────────────────
create table public.wishlist (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ─── Reviews ─────────────────────────────────────────────────
create table public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references public.products(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  title       text,
  comment     text,
  is_approved boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (product_id, user_id)
);

-- Recalculate product rating after review changes
create or replace function public.update_product_rating()
returns trigger language plpgsql as $$
begin
  update public.products
  set
    rating       = coalesce((select avg(rating) from public.reviews where product_id = coalesce(new.product_id, old.product_id) and is_approved = true), 0),
    review_count = (select count(*) from public.reviews where product_id = coalesce(new.product_id, old.product_id) and is_approved = true)
  where id = coalesce(new.product_id, old.product_id);
  return coalesce(new, old);
end;
$$;

create trigger trg_update_product_rating
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_product_rating();

-- ─── Coupons ─────────────────────────────────────────────────
create table public.coupons (
  id                  uuid primary key default uuid_generate_v4(),
  code                text not null unique,
  discount_percentage numeric(5,2) not null check (discount_percentage between 0 and 100),
  valid_from          timestamptz not null,
  valid_to            timestamptz not null,
  usage_limit         integer,
  used_count          integer not null default 0,
  min_order_value     numeric(12,2) not null default 0,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

-- ─── Addresses ───────────────────────────────────────────────
create table public.addresses (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  street      text not null,
  city        text not null,
  postal_code text not null,
  country     text not null default 'Russia',
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─── Payments ────────────────────────────────────────────────
create type payment_status as enum ('pending','completed','failed','refunded');

create table public.payments (
  id             uuid primary key default uuid_generate_v4(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  amount         numeric(12,2) not null,
  status         payment_status not null default 'pending',
  payment_method text not null,
  transaction_id text,
  created_at     timestamptz not null default now()
);

-- ─── Audit Logs ──────────────────────────────────────────────
create table public.audit_logs (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles(id) on delete set null,
  action        text not null,
  resource_type text not null,
  resource_id   text,
  changes       jsonb,
  created_at    timestamptz not null default now()
);

-- ─── Suppliers ───────────────────────────────────────────────
create table public.suppliers (
  id              uuid primary key default uuid_generate_v4(),
  company_name    text not null,
  contact_person  text,
  email           text,
  phone           text,
  address         text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
--  Row-Level Security
-- ============================================================

alter table public.profiles      enable row level security;
alter table public.categories    enable row level security;
alter table public.products      enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.cart_items    enable row level security;
alter table public.wishlist      enable row level security;
alter table public.reviews       enable row level security;
alter table public.coupons       enable row level security;
alter table public.addresses     enable row level security;
alter table public.payments      enable row level security;
alter table public.audit_logs    enable row level security;
alter table public.suppliers     enable row level security;

-- Helper: check if caller is admin
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: check if caller is storekeeper or admin
create or replace function public.is_staff()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'storekeeper')
  );
$$;

-- Profiles
create policy "Public can view profiles"       on public.profiles for select using (true);
-- Users may update only their own safe fields (full_name, phone, avatar_url, updated_at).
-- role and is_active are locked by the trigger below; admins use the all-profiles policy.
create policy "Users update own profile"       on public.profiles for update using (auth.uid() = id);
create policy "Admin manage all profiles"      on public.profiles for all using (public.is_admin());

-- Categories (public read, admin write)
create policy "Public read categories"         on public.categories for select using (true);
create policy "Admin write categories"         on public.categories for all using (public.is_admin());

-- Products (public read, staff write)
create policy "Public read products"           on public.products for select using (is_active = true or public.is_staff());
create policy "Staff write products"           on public.products for all using (public.is_staff());

-- Orders
create policy "Users read own orders"          on public.orders for select using (auth.uid() = user_id or public.is_staff());
create policy "Users create orders"            on public.orders for insert with check (auth.uid() = user_id);
create policy "Staff update orders"            on public.orders for update using (public.is_staff());

-- Order items
create policy "Users read own order items"     on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_staff()))
);
create policy "Users insert order items"       on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);

-- Cart
create policy "Users manage own cart"          on public.cart_items for all using (auth.uid() = user_id);

-- Wishlist
create policy "Users manage own wishlist"      on public.wishlist for all using (auth.uid() = user_id);

-- Reviews
create policy "Public read approved reviews"   on public.reviews for select using (is_approved = true or auth.uid() = user_id or public.is_staff());
create policy "Users write own reviews"        on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users update own reviews"       on public.reviews for update using (auth.uid() = user_id or public.is_staff());
create policy "Admin delete reviews"           on public.reviews for delete using (public.is_admin());

-- Coupons (public read active, admin write)
create policy "Public read active coupons"     on public.coupons for select using (is_active = true or public.is_admin());
create policy "Admin write coupons"            on public.coupons for all using (public.is_admin());

-- Addresses
create policy "Users manage own addresses"     on public.addresses for all using (auth.uid() = user_id);

-- Payments
create policy "Users read own payments"        on public.payments for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_staff()))
);
create policy "Staff write payments"           on public.payments for all using (public.is_staff());

-- Audit logs (admin read-only)
create policy "Admin read logs"                on public.audit_logs for select using (public.is_admin());
create policy "System insert logs"             on public.audit_logs for insert with check (true);

-- Suppliers
create policy "Staff read suppliers"           on public.suppliers for select using (public.is_staff());
create policy "Staff write suppliers"          on public.suppliers for all using (public.is_staff());

-- ============================================================
--  Security Triggers
-- ============================================================

-- SECURITY: Prevent any non-admin user from changing their own role or is_active.
-- This stops privilege escalation even if the RLS UPDATE policy is satisfied.
create or replace function public.guard_profile_sensitive_fields()
returns trigger language plpgsql security definer as $$
begin
  -- If the caller is not an admin, reset sensitive fields to their current values.
  if not public.is_admin() then
    new.role      := old.role;
    new.is_active := old.is_active;
  end if;
  return new;
end;
$$;

create trigger trg_guard_profile_sensitive_fields
  before update on public.profiles
  for each row execute procedure public.guard_profile_sensitive_fields();

-- ============================================================
--  Seed Data
-- ============================================================

insert into public.categories (name, slug, description, image_url) values
  ('Gaming Peripherals', 'gaming-peripherals',   'Headsets, mice, keyboards and controllers', 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&q=80'),
  ('Processors & RAM',   'processors-ram',        'CPUs and memory modules',                  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80'),
  ('Graphics Cards',     'graphics-cards',        'GPUs for gaming and professional work',    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80'),
  ('Networking',         'networking',             'Routers, switches, cables',                'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80'),
  ('Office Equipment',   'office-equipment',      'Printers, monitors, and office tools',     'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80'),
  ('Accessories',        'accessories',            'Cables, adapters, and peripherals',        'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80');

-- Sample coupons
insert into public.coupons (code, discount_percentage, valid_from, valid_to, usage_limit, min_order_value, is_active) values
  ('SAVE10', 10, now(), now() + interval '1 year', 1000, 1000,  true),
  ('SAVE20', 20, now(), now() + interval '1 year', 500,  5000,  true),
  ('WELCOME', 15, now(), now() + interval '6 months', 1, 0, true);
