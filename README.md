# JD TechStores

Premium electronics e-commerce platform built with React 18, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| State | Zustand (persist) |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| Notifications | react-hot-toast |
| Icons | Lucide React |

## Features

- 🛍️ Full e-commerce flow: browse → cart → checkout → order tracking
- 👤 Auth: email/password + Google OAuth via Supabase Auth
- 🔐 Role-based access: User / Storekeeper / Admin
- 📦 Admin dashboard: products, orders, users, coupons, analytics, audit logs
- 🏪 Storekeeper panel: inventory, suppliers, order fulfilment
- 💳 Coupon/discount codes (SAVE10, SAVE20)
- ❤️ Wishlist (persisted locally)
- ⭐ Product reviews & ratings
- 🔍 Search, filter, sort
- 📱 Fully responsive (mobile-first)
- 🌙 Dark theme throughout

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd jd-techstores
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire contents of `supabase/schema.sql`
3. Enable **Google OAuth** in Authentication → Providers (optional)
4. Copy your project URL and anon key

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env and fill in your Supabase credentials
```

### 4. Run development server

```bash
npm run dev
```

### 5. Create your first admin user

After registering via the UI, run this in the Supabase SQL editor:

```sql
update public.profiles
set role = 'admin'
where email = 'your@email.com';
```

## Build for Production

```bash
npm run build
# Output in dist/ — deploy to Vercel, Netlify, Cloudflare Pages, etc.
```

## Deployment (Vercel example)

```bash
npm i -g vercel
vercel --prod
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel dashboard
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx        # Sticky nav with mega-menu
│   ├── Footer.tsx        # Full footer with newsletter
│   ├── CartDrawer.tsx    # Slide-in cart panel
│   └── ui.tsx            # Shared UI primitives
├── pages/
│   ├── HomePage.tsx      # Hero, categories, featured products
│   ├── ProductsPage.tsx  # Filterable product grid
│   ├── ProductDetailPage.tsx  # PDP with reviews
│   ├── CategoryPage.tsx  # Category-filtered listing
│   ├── SearchPage.tsx    # Search results
│   ├── AuthPages.tsx     # Login / Register / Forgot password
│   ├── CartCheckoutPages.tsx  # Cart, Checkout, Confirmation
│   ├── DashboardPage.tsx # User account area
│   ├── WishlistPage.tsx  # Saved items
│   ├── AdminDashboard.tsx     # Full admin panel
│   ├── StorekeeperPages.tsx   # Inventory & supplier management
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   ├── FAQPage.tsx
│   └── PolicyPages.tsx   # Shipping / Returns / Privacy / Terms
├── store/
│   └── index.ts          # Zustand stores (auth, cart, wishlist, UI)
├── hooks/
│   ├── useAuth.tsx        # Auth context + Supabase auth
│   └── useCart.ts         # Cart sync helpers
└── lib/
    └── supabase.ts        # Supabase client + all TypeScript types
```

## Database Schema

See `supabase/schema.sql` for the full PostgreSQL schema including:
- Tables: profiles, categories, products, orders, order_items, cart_items, wishlist, reviews, coupons, addresses, payments, audit_logs, suppliers
- Row-Level Security policies for all tables
- Triggers: auto-create profile on signup, auto-generate order numbers, auto-update product ratings
- Seed data: categories and coupon codes

## Coupon Codes (Development)

| Code | Discount | Min Order |
|------|----------|-----------|
| SAVE10 | 10% | ₽1,000 |
| SAVE20 | 20% | ₽5,000 |
| WELCOME | 15% | ₽0 |

## License

MIT
