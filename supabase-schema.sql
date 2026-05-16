-- ============================================================
-- JD TechStores - Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('user', 'storekeeper', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  stock_quantity INT NOT NULL DEFAULT 0,
  sku TEXT UNIQUE,
  main_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  spec_name TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Russia',
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CART
-- ============================================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================================
-- WISHLIST
-- ============================================================
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================================
-- COUPONS
-- ============================================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_percentage DECIMAL(5,2) NOT NULL,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  usage_limit INT,
  used_count INT DEFAULT 0,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE DEFAULT 'ORD-' || UPPER(SUBSTRING(uuid_generate_v4()::TEXT, 1, 8)),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  shipping_address JSONB,
  delivery_method TEXT DEFAULT 'standard',
  payment_method TEXT DEFAULT 'card',
  notes TEXT,
  estimated_delivery TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status payment_status DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUPPLIERS
-- ============================================================
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  terms TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  changes JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Gaming Peripherals', 'gaming-peripherals', 'Headsets, mice, keyboards and more for gamers', 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400'),
  ('Processors & RAM', 'processors-ram', 'CPUs and memory modules for peak performance', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400'),
  ('Graphics Cards', 'graphics-cards', 'GPUs for gaming and professional workloads', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400'),
  ('Networking', 'networking', 'Routers, switches and network equipment', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400'),
  ('Office Equipment', 'office-equipment', 'Printers, scanners and office essentials', 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400'),
  ('Accessories', 'accessories', 'Cables, adapters, stands and peripherals', 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400');

-- Products
INSERT INTO products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, rating, review_count) VALUES
  ('Premium Gaming Headset Pro', 'premium-gaming-headset-pro',
   'Immersive 7.1 surround sound with noise-cancelling microphone. Perfect for competitive gaming and streaming. 50mm drivers deliver crystal-clear audio.',
   (SELECT id FROM categories WHERE slug='gaming-peripherals'), 4999, 6999, 45, 'HDST-001',
   'https://images.unsplash.com/photo-1599669454699-248893623440?w=600', 4.7, 128),

  ('Ultra-Fast NVMe SSD 1TB', 'ultra-fast-nvme-ssd-1tb',
   'PCIe 4.0 NVMe SSD with read speeds up to 7000MB/s. Perfect for gaming, content creation, and professional workloads. 5-year warranty included.',
   (SELECT id FROM categories WHERE slug='processors-ram'), 5999, 7999, 32, 'SSD-001',
   'https://images.unsplash.com/photo-1597149374779-b5b93c838c47?w=600', 4.8, 94),

  ('Wireless Ergonomic Mouse Pro', 'wireless-ergonomic-mouse-pro',
   'Precision 16000 DPI optical sensor with 70-hour battery life. Ergonomic design reduces fatigue during long sessions. RGB lighting with 16.7M colors.',
   (SELECT id FROM categories WHERE slug='gaming-peripherals'), 2499, 3499, 78, 'MSE-001',
   'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', 4.5, 67),

  ('Mechanical RGB Keyboard TKL', 'mechanical-rgb-keyboard-tkl',
   'Tenkeyless mechanical keyboard with Cherry MX switches. Per-key RGB backlighting, PBT doubleshot keycaps, and detachable USB-C cable.',
   (SELECT id FROM categories WHERE slug='gaming-peripherals'), 7999, 9999, 28, 'KBD-001',
   'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', 4.9, 203),

  ('RTX 4070 Ti Super 16GB', 'rtx-4070-ti-super-16gb',
   'NVIDIA Ada Lovelace architecture with DLSS 3.5. 16GB GDDR6X memory for 4K gaming and AI-accelerated workflows. Triple fan cooling system.',
   (SELECT id FROM categories WHERE slug='graphics-cards'), 67999, 79999, 12, 'GPU-001',
   'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600', 4.8, 56),

  ('Intel Core i9-14900K', 'intel-core-i9-14900k',
   '24 cores (8P+16E), 32 threads, boost up to 6.0GHz. Unlocked for overclocking. Ideal for gaming, streaming, and content creation simultaneously.',
   (SELECT id FROM categories WHERE slug='processors-ram'), 44999, 52999, 18, 'CPU-001',
   'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600', 4.9, 142),

  ('WiFi 6E Mesh Router System', 'wifi-6e-mesh-router-system',
   'Tri-band WiFi 6E with 7.8 Gbps combined speed. Covers up to 600 sq.m. with mesh technology. Easy setup via mobile app. MU-MIMO and OFDMA support.',
   (SELECT id FROM categories WHERE slug='networking'), 18999, 22999, 23, 'RTR-001',
   'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600', 4.6, 38),

  ('4K Laser Printer Business', '4k-laser-printer-business',
   'Professional color laser printer. 40 ppm, auto-duplex, 1200 DPI. Network and WiFi ready. Monthly duty cycle 80,000 pages. Low cost per page.',
   (SELECT id FROM categories WHERE slug='office-equipment'), 34999, 42999, 9, 'PRN-001',
   'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600', 4.4, 29),

  ('32GB DDR5-6400 RAM Kit', '32gb-ddr5-6400-ram-kit',
   'Dual-channel 32GB (2x16GB) DDR5 at 6400MT/s. Low-profile heatspreader design. XMP 3.0 and EXPO support. Perfect for gaming and workstation builds.',
   (SELECT id FROM categories WHERE slug='processors-ram'), 12999, 15999, 41, 'RAM-001',
   'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600', 4.7, 88),

  ('27" 4K 144Hz Gaming Monitor', '27-4k-144hz-gaming-monitor',
   'IPS panel with 4K resolution and 144Hz refresh rate. 1ms response time, HDR600, 99% DCI-P3 coverage. Ideal for both gaming and professional work.',
   (SELECT id FROM categories WHERE slug='accessories'), 54999, 64999, 15, 'MON-001',
   'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600', 4.8, 171),

  ('USB-C Hub 12-in-1 Pro', 'usb-c-hub-12-in-1-pro',
   '12-port USB-C hub with 100W PD charging, dual 4K HDMI, 10Gbps USB 3.2, SD card reader, Ethernet, and audio jack. Plug and play.',
   (SELECT id FROM categories WHERE slug='accessories'), 4499, 5999, 67, 'HUB-001',
   'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600', 4.5, 93),

  ('Mechanical Gaming Mouse Pad XL', 'mechanical-gaming-mouse-pad-xl',
   'Extra-large 900x400mm desk pad with micro-textured surface. Anti-slip rubber base, stitched edges, and water-resistant coating. RGB border lighting.',
   (SELECT id FROM categories WHERE slug='gaming-peripherals'), 1999, 2799, 89, 'PAD-001',
   'https://images.unsplash.com/photo-1617957718614-8c23f060c2d0?w=600', 4.6, 215);

-- Product specifications
INSERT INTO product_specifications (product_id, spec_name, spec_value)
SELECT p.id, spec.name, spec.value FROM products p
CROSS JOIN (VALUES
  ('Connectivity', 'USB + Wireless 2.4GHz'),
  ('Frequency Response', '20Hz - 20kHz'),
  ('Microphone', 'Noise-cancelling, retractable'),
  ('Weight', '318g')
) AS spec(name, value)
WHERE p.sku = 'HDST-001';

INSERT INTO product_specifications (product_id, spec_name, spec_value)
SELECT p.id, spec.name, spec.value FROM products p
CROSS JOIN (VALUES
  ('Interface', 'PCIe 4.0 x4 NVMe'),
  ('Read Speed', '7000 MB/s'),
  ('Write Speed', '6500 MB/s'),
  ('Form Factor', 'M.2 2280'),
  ('NAND Type', 'TLC 3D NAND'),
  ('Warranty', '5 years')
) AS spec(name, value)
WHERE p.sku = 'SSD-001';

-- Default coupons
INSERT INTO coupons (code, discount_percentage, valid_to, usage_limit, min_order_value) VALUES
  ('SAVE10', 10, NOW() + INTERVAL '1 year', 1000, 0),
  ('SAVE20', 20, NOW() + INTERVAL '1 year', 500, 5000),
  ('NEWUSER', 15, NOW() + INTERVAL '1 year', 1, 0);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users see own, admins see all
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products and categories: public read
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'storekeeper'))
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read specs" ON product_specifications FOR SELECT USING (TRUE);
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read images" ON product_images FOR SELECT USING (TRUE);
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Cart: users manage own
CREATE POLICY "Users manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Wishlist: users manage own
CREATE POLICY "Users manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- Orders: users see own, admins see all
CREATE POLICY "Users see own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'storekeeper'))
);
CREATE POLICY "Users see own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users create order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);

-- Addresses: users manage own
CREATE POLICY "Users manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);

-- Reviews: public read, users manage own
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Coupons: public read
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (is_active = TRUE);
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Suppliers
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage suppliers" ON suppliers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'storekeeper'))
);

-- Audit logs
CREATE POLICY "Admins view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System creates audit logs" ON audit_logs FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- VIEWS & FUNCTIONS
-- ============================================================

-- Product with category name
CREATE OR REPLACE VIEW products_with_category AS
SELECT p.*, c.name AS category_name, c.slug AS category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE;

-- Update product rating when review added
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Validate coupon function
CREATE OR REPLACE FUNCTION validate_coupon(coupon_code TEXT, order_value DECIMAL)
RETURNS JSONB AS $$
DECLARE
  coupon_record coupons%ROWTYPE;
BEGIN
  SELECT * INTO coupon_record FROM coupons
  WHERE code = UPPER(coupon_code) AND is_active = TRUE
    AND (valid_to IS NULL OR valid_to > NOW())
    AND (usage_limit IS NULL OR used_count < usage_limit)
    AND min_order_value <= order_value;

  IF NOT FOUND THEN
    RETURN '{"valid": false, "message": "Invalid or expired coupon"}'::JSONB;
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'discount_percentage', coupon_record.discount_percentage,
    'coupon_id', coupon_record.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sales report function (admin only)
CREATE OR REPLACE FUNCTION get_sales_report(start_date TIMESTAMPTZ, end_date TIMESTAMPTZ)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_revenue', COALESCE(SUM(total_amount), 0),
    'total_orders', COUNT(*),
    'avg_order_value', COALESCE(AVG(total_amount), 0),
    'by_status', (
      SELECT jsonb_object_agg(status, cnt)
      FROM (SELECT status, COUNT(*) as cnt FROM orders
            WHERE created_at BETWEEN start_date AND end_date GROUP BY status) s
    )
  ) INTO result
  FROM orders
  WHERE created_at BETWEEN start_date AND end_date;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- STORAGE BUCKETS (run via Supabase dashboard or API)
-- ============================================================
-- Create bucket: product-images (public)
-- Create bucket: avatars (public)
-- Both with 5MB file size limit, image/* MIME types

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON products_with_category TO anon, authenticated;
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON product_images TO anon, authenticated;
GRANT SELECT ON product_specifications TO anon, authenticated;
GRANT SELECT ON coupons TO anon, authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON cart_items TO authenticated;
GRANT ALL ON wishlist TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;
GRANT ALL ON addresses TO authenticated;
GRANT ALL ON reviews TO authenticated;
GRANT EXECUTE ON FUNCTION validate_coupon TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_sales_report TO authenticated;
