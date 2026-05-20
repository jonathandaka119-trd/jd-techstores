-- ============================================================
-- JD TechStores — 100 Product Seed Script
-- HOW TO RUN:
--   1. Go to https://supabase.com/dashboard → your project
--   2. Click "SQL Editor" in the sidebar
--   3. Click "New query"
--   4. Paste this entire file and click "Run"
-- Safe to run multiple times (ON CONFLICT (slug) DO NOTHING)
-- ============================================================

INSERT INTO products (
  name, slug, description, category_id,
  price, original_price, stock_quantity, sku,
  main_image_url, is_active, rating, review_count
) VALUES

-- ══════════════════════════════════════════════════════════
-- GAMING PERIPHERALS (20 products)
-- ══════════════════════════════════════════════════════════

(
  'Logitech G Pro X Superlight 2',
  'logitech-g-pro-x-superlight-2',
  'Ultra-lightweight wireless gaming mouse at just 60g. HERO 2 sensor with up to 32,000 DPI, 95-hour battery life, LIGHTFORCE hybrid switches, and dual-connectivity via LIGHTSPEED or Bluetooth.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  12990, 15990, 45, 'LOG-GPX2-WHT',
  'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
  true, 4.9, 2341
),
(
  'Razer DeathAdder V3 HyperSpeed',
  'razer-deathadder-v3-hyperspeed',
  'Ergonomic wireless gaming mouse with Razer HyperSpeed technology for 2× faster than typical wireless. Features Focus Pro 30K optical sensor, 90-hour battery life, and asymmetric design.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  8990, 10990, 38, 'RZR-DAV3-BLK',
  'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',
  true, 4.7, 1876
),
(
  'SteelSeries Rival 650 Wireless',
  'steelseries-rival-650-wireless',
  'Dual-sensor wireless gaming mouse with TrueMove3+ for true 1-to-1 tracking accuracy. Features 24,000 DPI, quantum wireless 1ms, and customizable weight system.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  7490, 9490, 28, 'SS-RIV650-BLK',
  'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&q=80',
  true, 4.5, 982
),
(
  'HyperX Pulsefire Haste 2 Wireless',
  'hyperx-pulsefire-haste-2-wireless',
  'Ultra-light wireless gaming mouse at 61g with HyperX 26K Sensor, 100-hour battery, and honeycomb shell design for maximum grip and airflow.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  6990, 8490, 52, 'HX-PF-HASTE2-BLK',
  'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
  true, 4.6, 1103
),
(
  'Corsair M75 Air Wireless',
  'corsair-m75-air-wireless',
  'Sub-60g wireless gaming mouse with CORSAIR MARKSMAN-M optical sensor, 26,000 DPI, USB-C fast charging, and up to 210-hour battery life.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  9490, 11490, 33, 'COR-M75-BLK',
  'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',
  true, 4.7, 743
),
(
  'SteelSeries Apex Pro TKL Wireless',
  'steelseries-apex-pro-tkl-wireless',
  'The world''s fastest keyboard with adjustable OmniPoint 2.0 magnetic switches (0.1–4.0mm actuation), 2.4GHz wireless at 1ms, OLED Smart Display, and per-key RGB.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  19990, 24990, 22, 'SS-APXTKLW-BLK',
  'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80',
  true, 4.8, 2104
),
(
  'Razer BlackWidow V4 Pro',
  'razer-blackwidow-v4-pro',
  'Full-featured wireless mechanical gaming keyboard with Razer Yellow mechanical switches, per-key RGB Chroma, detachable wrist rest, and multi-function roller wheel.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  17990, 21490, 18, 'RZR-BWV4PRO-BLK',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
  true, 4.6, 1432
),
(
  'Corsair K100 RGB Wireless',
  'corsair-k100-rgb-wireless',
  'Flagship wireless gaming keyboard with CORSAIR OPX optical-mechanical switches, per-key RGB backlighting, iCUE Commander CORE controller, and ELGATO Stream Deck integration.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  22990, 27490, 14, 'COR-K100-BLK',
  'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80',
  true, 4.7, 987
),
(
  'HyperX Alloy Origins 65 Mechanical',
  'hyperx-alloy-origins-65',
  'Compact 65% mechanical gaming keyboard with HyperX Red linear switches, aircraft-grade aluminum body, per-key RGB, and detachable USB-C cable.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  8490, 10490, 41, 'HX-AO65-BLK',
  'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80',
  true, 4.5, 876
),
(
  'Ducky One 3 TKL RGB',
  'ducky-one-3-tkl-rgb',
  'Premium tenkeyless mechanical keyboard with hot-swappable PCB, dual-layer PCB with foam, PBT double-shot keycaps, and Cherry MX switches. Available in multiple colorways.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  10990, 12990, 27, 'DKY-ONE3-TKL',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
  true, 4.8, 1567
),
(
  'SteelSeries Arctis Nova Pro Wireless',
  'steelseries-arctis-nova-pro-wireless',
  'Premium wireless gaming headset with dual wireless system (2.4GHz + Bluetooth), active noise cancellation, hi-res audio, and hot-swap battery system for infinite playtime.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  23990, 28990, 19, 'SS-ANP-WHT',
  'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',
  true, 4.8, 2876
),
(
  'HyperX Cloud Alpha Wireless',
  'hyperx-cloud-alpha-wireless',
  'Wireless gaming headset with industry-leading 300-hour battery life, dual chamber drivers for reduced distortion, and HyperX DTS Headphone:X Spatial Audio.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  12490, 15490, 34, 'HX-CACW-BLK',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  true, 4.7, 3241
),
(
  'Razer BlackShark V2 Pro (2023)',
  'razer-blackshark-v2-pro-2023',
  'Wireless esports headset with Razer HyperSpeed wireless, THX Spatial Audio, TriForce Titanium 50mm drivers, and HyperClear Super Wideband mic for crystal-clear voice.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  14990, 17990, 25, 'RZR-BSV2P-BLK',
  'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80',
  true, 4.7, 1893
),
(
  'Corsair Virtuoso RGB Wireless XT',
  'corsair-virtuoso-rgb-wireless-xt',
  'High-fidelity wireless gaming headset with custom-tuned 50mm neodymium audio drivers, Bluetooth multipoint, 24-bit 96kHz broadcast-quality microphone.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  15990, 18990, 21, 'COR-VRT-WHT',
  'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',
  true, 4.6, 1204
),
(
  'Logitech G733 LIGHTSPEED Wireless',
  'logitech-g733-lightspeed-wireless',
  'Lightweight wireless gaming headset at 278g with LIGHTSPEED wireless, DTS Headphone:X 2.0, PRO-G 40mm audio drivers, and Blue Voice microphone technology.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  9990, 12490, 38, 'LOG-G733-BLU',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  true, 4.5, 2108
),
(
  'Xbox Elite Series 2 Controller',
  'xbox-elite-series-2',
  'Professional wireless controller with rubberized grip, hair trigger locks, wrap-around rubberized grip, and 40+ hours rechargeable battery. Includes 9 interchangeable components.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  13990, 15990, 30, 'MSF-XB-ELITE2',
  'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=800&q=80',
  true, 4.6, 4532
),
(
  'Sony DualSense Edge Wireless Controller',
  'sony-dualsense-edge',
  'Ultra-customizable wireless controller for PS5 with swappable back buttons, adjustable trigger travel, replaceable stick caps, and built-in profiles for personalized control.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  14990, NULL, 27, 'SNY-DSE-WHT',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
  true, 4.7, 2103
),
(
  'Razer Wolverine V2 Pro Wireless',
  'razer-wolverine-v2-pro',
  'Pro wireless gaming controller for PS5 and PC with Razer Mecha-Tactile action buttons, hair trigger mode, 6 remappable buttons, and Chroma RGB lighting.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  16990, 19990, 15, 'RZR-WLV2P-BLK',
  'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=800&q=80',
  true, 4.5, 876
),
(
  'SteelSeries QcK Prism Cloth XL',
  'steelseries-qck-prism-cloth-xl',
  'XL gaming mouse pad with dual-zone RGB lighting, micro-woven cloth for precise tracking, non-slip rubber base, and USB pass-through port. 900×300×4mm.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  3990, 5490, 67, 'SS-QCK-PRISM-XL',
  'https://images.unsplash.com/photo-1623820919239-0d0ff10797a1?w=800&q=80',
  true, 4.6, 1876
),
(
  'ASUS ROG Ally Gaming Handheld',
  'asus-rog-ally-handheld',
  'Portable gaming PC handheld with AMD Ryzen Z1 Extreme processor, 7" FHD 120Hz touchscreen, 512GB PCIe 4.0 SSD, Windows 11, and 40Whr battery.',
  (SELECT id FROM categories WHERE name ILIKE '%gaming%' LIMIT 1),
  49990, 54990, 12, 'ASUS-ROG-ALLY-Z1',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
  true, 4.4, 1243
),

-- ══════════════════════════════════════════════════════════
-- PROCESSORS & RAM (15 products)
-- ══════════════════════════════════════════════════════════

(
  'AMD Ryzen 9 7950X',
  'amd-ryzen-9-7950x',
  '16-core, 32-thread desktop processor with 4.5GHz base / 5.7GHz boost clock, 80MB total cache, PCIe 5.0, DDR5 support, and 170W TDP. Designed for extreme multithreading workloads.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  64990, 74990, 18, 'AMD-R9-7950X',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
  true, 4.9, 1876
),
(
  'Intel Core i9-13900KS',
  'intel-core-i9-13900ks',
  '24-core (8P+16E), 32-thread CPU with a world-record 6.0GHz boost, 68MB total cache, PCIe 5.0+4.0, DDR5/DDR4 support, and Intel UHD 770 integrated graphics.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  69990, 79990, 11, 'INT-I9-13900KS',
  'https://images.unsplash.com/photo-1555617766-c94804975fb4?w=800&q=80',
  true, 4.8, 1234
),
(
  'AMD Ryzen 9 7900X',
  'amd-ryzen-9-7900x',
  '12-core, 24-thread processor with 4.7GHz base / 5.6GHz boost, 76MB total cache, PCIe 5.0, and 170W TDP. Excellent multi-threaded performance for content creation.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  44990, 52990, 23, 'AMD-R9-7900X',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
  true, 4.7, 987
),
(
  'Intel Core i7-13700K',
  'intel-core-i7-13700k',
  '16-core (8P+8E), 24-thread processor with 3.4GHz base / 5.4GHz boost, 54MB total cache, PCIe 5.0+4.0, and DDR5/DDR4 dual-channel memory support. Unlocked for overclocking.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  35990, 42990, 34, 'INT-I7-13700K',
  'https://images.unsplash.com/photo-1555617766-c94804975fb4?w=800&q=80',
  true, 4.8, 2134
),
(
  'AMD Ryzen 7 7700X',
  'amd-ryzen-7-7700x',
  '8-core, 16-thread processor with 4.5GHz base / 5.4GHz boost, 40MB total cache, PCIe 5.0, and 105W TDP. Best-in-class 1080p gaming performance with Zen 4 architecture.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  28990, 34990, 41, 'AMD-R7-7700X',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
  true, 4.7, 1432
),
(
  'Intel Core i5-13600K',
  'intel-core-i5-13600k',
  '14-core (6P+8E), 20-thread processor with 3.5GHz base / 5.1GHz boost, 44MB total cache. The best value gaming CPU with PCIe 5.0 and unlocked multiplier.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  22990, 27990, 56, 'INT-I5-13600K',
  'https://images.unsplash.com/photo-1555617766-c94804975fb4?w=800&q=80',
  true, 4.9, 3241
),
(
  'AMD Ryzen 5 7600X',
  'amd-ryzen-5-7600x',
  '6-core, 12-thread processor with 4.7GHz base / 5.3GHz boost, 38MB total cache, and 105W TDP. Outstanding gaming performance per dollar with Zen 4 architecture.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  17990, 21990, 63, 'AMD-R5-7600X',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
  true, 4.8, 2876
),
(
  'Corsair Vengeance DDR5-6000 32GB Kit',
  'corsair-vengeance-ddr5-6000-32gb',
  '2×16GB DDR5-6000 kit with Intel XMP 3.0 and AMD EXPO profiles, optimized timings of CL36-36-36-76, low-profile heat spreader, and plug-and-play automatic overclocking.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  13990, 16990, 48, 'COR-DDR5-6000-32',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
  true, 4.7, 1654
),
(
  'G.Skill Trident Z5 RGB DDR5-6400 32GB',
  'gskill-trident-z5-rgb-ddr5-6400-32gb',
  '2×16GB DDR5-6400 with Intel XMP 3.0, CL32-39-39-102 timings, ultra-fast 6400MT/s speed, addressable RGB lighting bar, and aluminum heat spreader.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  17990, 21990, 31, 'GSK-TRZ5-6400-32',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
  true, 4.8, 1102
),
(
  'Kingston Fury Beast DDR5-5200 32GB',
  'kingston-fury-beast-ddr5-5200-32gb',
  '2×16GB DDR5-5200 with Intel XMP 3.0 and AMD EXPO, plug N play overclocking, low-profile heat spreader, and on-die ECC for improved reliability.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  10990, 13490, 57, 'KNG-FRZB-5200-32',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
  true, 4.6, 987
),
(
  'Corsair Dominator Platinum RGB DDR5-6200 64GB',
  'corsair-dominator-ddr5-6200-64gb',
  '4×16GB flagship DDR5-6200 kit with DHX cooling, individually tested ICs, CL36-40-40-80 timings, and Capellix RGB LEDs for stunning visuals.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  34990, 41990, 14, 'COR-DOM-6200-64',
  'https://images.unsplash.com/photo-1583195764036-b34a64a14c60?w=800&q=80',
  true, 4.9, 432
),
(
  'G.Skill Ripjaws S5 DDR5-6000 64GB',
  'gskill-ripjaws-s5-ddr5-6000-64gb',
  '2×32GB DDR5-6000 kit, ultra-low CL30-40-40-96 timings, Intel XMP 3.0 certified, streamlined heat spreader design, ideal for memory-intensive workloads.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  28990, 33990, 19, 'GSK-RJS5-6000-64',
  'https://images.unsplash.com/photo-1583195764036-b34a64a14c60?w=800&q=80',
  true, 4.7, 543
),
(
  'TeamGroup T-Force Delta RGB DDR5-6000 32GB',
  'teamgroup-t-force-delta-ddr5-6000-32gb',
  '2×16GB DDR5-6000 with 360° mirror RGB panel, Intel XMP 3.0 and AMD EXPO support, CL38-38-38-78, and patented circuit board design.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  12490, 14990, 35, 'TMG-TFD-6000-32',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
  true, 4.6, 678
),
(
  'Kingston Fury Renegade RGB DDR5-7200 32GB',
  'kingston-fury-renegade-rgb-ddr5-7200-32gb',
  '2×16GB ultra-high-frequency DDR5-7200 kit with Intel XMP 3.0, aggressive CL38-44-44-96 timings, Infrared Sync Technology for perfect LED synchronization.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  21990, 25990, 22, 'KNG-FRR-7200-32',
  'https://images.unsplash.com/photo-1583195764036-b34a64a14c60?w=800&q=80',
  true, 4.7, 456
),
(
  'Crucial Pro DDR5-5600 32GB Overclocking Kit',
  'crucial-pro-ddr5-5600-32gb',
  '2×16GB DDR5-5600 with Intel XMP 5.0 and AMD EXPO, built-in power management IC, on-die ECC, and low-voltage 1.1V operation for efficiency and stability.',
  (SELECT id FROM categories WHERE name ILIKE '%processor%' OR name ILIKE '%ram%' LIMIT 1),
  9990, 11990, 44, 'CRC-PRO-5600-32',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
  true, 4.5, 712
),

-- ══════════════════════════════════════════════════════════
-- GRAPHICS CARDS (15 products)
-- ══════════════════════════════════════════════════════════

(
  'NVIDIA GeForce RTX 4090 Founders Edition',
  'nvidia-rtx-4090-founders-edition',
  'The ultimate flagship GPU with 16,384 CUDA cores, 24GB GDDR6X, 450W TDP, Ada Lovelace architecture, DLSS 3, and 4K/8K gaming capability. The world''s fastest consumer graphics card.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  159990, 179990, 8, 'NV-RTX4090-FE',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
  true, 4.9, 3421
),
(
  'ASUS ROG Strix RTX 4090 OC 24GB',
  'asus-rog-strix-rtx-4090-oc',
  'Top-of-the-line RTX 4090 with 2640MHz boost clock, 3.5-slot STRIX cooler, 16+4 power stages, six 8K display outputs, and Aura Sync RGB lighting.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  174990, 199990, 5, 'ASUS-ROG-4090-OC',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
  true, 4.9, 1234
),
(
  'MSI SUPRIM LIQUID X RTX 4090',
  'msi-suprim-liquid-x-rtx-4090',
  'Liquid-cooled RTX 4090 with integrated 360mm AIO cooler, 2640MHz boost, ultra-quiet operation, and a compact dual-slot card body for maximum airflow in your build.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  189990, 214990, 4, 'MSI-SUP-LIQ-4090',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
  true, 4.8, 543
),
(
  'NVIDIA GeForce RTX 4080 Super',
  'nvidia-rtx-4080-super',
  '10,240 CUDA cores, 16GB GDDR6X, 320W TDP, DLSS 3.5 Frame Generation, and Ada Lovelace architecture. Supercharged for demanding 4K gaming and creative workloads.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  99990, 114990, 14, 'NV-RTX4080S-FE',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
  true, 4.8, 2109
),
(
  'ASUS TUF Gaming RTX 4080 Super OC',
  'asus-tuf-gaming-rtx-4080-super-oc',
  'Military-grade certified RTX 4080 Super with 2625MHz boost clock, 3× Axial-tech fans, 16-phase power delivery, and reinforced PCIe slot for lasting durability.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  107990, 124990, 9, 'ASUS-TUF-4080S-OC',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
  true, 4.7, 876
),
(
  'Sapphire Nitro+ AMD Radeon RX 7900 XTX',
  'sapphire-nitro-rx-7900-xtx',
  '24GB GDDR6 flagship AMD GPU with 2615MHz boost, Sapphire''s NITRO triple-fan cooler, Infinity Cache, AV1 hardware encode/decode, and DisplayPort 2.1 outputs.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  97990, 109990, 11, 'SAP-NIT-7900XTX',
  'https://images.unsplash.com/photo-1561736778-92e52a7100ea?w=800&q=80',
  true, 4.8, 1432
),
(
  'PowerColor Red Devil RX 7900 XTX',
  'powercolor-red-devil-rx-7900-xtx',
  '24GB GDDR6 RX 7900 XTX with 2615MHz boost, triple BIOS, triple fan Red Devil cooler, 6× display outputs including DP 2.1, and ARGB lighting.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  94990, 107990, 7, 'PWC-RD-7900XTX',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
  true, 4.7, 987
),
(
  'NVIDIA GeForce RTX 4070 Ti Super',
  'nvidia-rtx-4070-ti-super',
  '8448 CUDA cores, 16GB GDDR6X, 285W TDP, DLSS 3.5, Ada Lovelace. Outstanding 4K performance delivering up to 2× the performance of RTX 3070 Ti.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  79990, 91990, 20, 'NV-RTX4070TIS-FE',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
  true, 4.8, 1678
),
(
  'MSI Gaming X Slim RTX 4070 Ti Super',
  'msi-gaming-x-slim-rtx-4070-ti-super',
  'Slim dual-fan RTX 4070 Ti Super with 2670MHz boost, 16GB GDDR6X, reduced 2-slot design, and 4× DP 1.4a + HDMI 2.1 outputs.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  84990, 97990, 15, 'MSI-GXS-4070TIS',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
  true, 4.7, 743
),
(
  'AMD Radeon RX 7800 XT Reference',
  'amd-radeon-rx-7800-xt',
  '16GB GDDR6 with 60CUs, 2430MHz boost clock, 263W TDP, AV1 hardware encode, DisplayPort 2.1. Excellent 1440p gaming performance at an aggressive price point.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  49990, 57990, 28, 'AMD-RX7800XT-REF',
  'https://images.unsplash.com/photo-1561736778-92e52a7100ea?w=800&q=80',
  true, 4.6, 1234
),
(
  'ASUS Dual RX 7800 XT OC 16GB',
  'asus-dual-rx-7800-xt-oc',
  'Dual-fan RX 7800 XT with 2475MHz boost clock, 16GB GDDR6, axial-tech fans with dual ball bearings, and auto-extreme manufacturing for long-term reliability.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  52990, 61990, 22, 'ASUS-DUAL-7800XT',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
  true, 4.6, 876
),
(
  'NVIDIA GeForce RTX 4070 Super',
  'nvidia-rtx-4070-super',
  '7168 CUDA cores, 12GB GDDR6X, 220W TDP, DLSS 3.5. Up to 2× the performance of RTX 3070 in rasterization. Best 1440p GPU for mainstream gamers.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  59990, 68990, 31, 'NV-RTX4070S-FE',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
  true, 4.8, 2341
),
(
  'Gigabyte Eagle RTX 4070 Super OC 12GB',
  'gigabyte-eagle-rtx-4070-super-oc',
  'Triple-fan RTX 4070 Super with 2535MHz boost, WINDFORCE 3× cooling system, LED lighting, and reinforced PCIe connectors. Great value 1440p card.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  63990, 73990, 24, 'GBT-EGL-4070S-OC',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
  true, 4.7, 1102
),
(
  'NVIDIA GeForce RTX 4060 Ti 16GB',
  'nvidia-rtx-4060-ti-16gb',
  '4352 CUDA cores, 16GB GDDR6, 165W TDP, DLSS 3.5, AV1 encode/decode. Excellent 1080p/1440p performance with large VRAM for modern titles.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  42990, 49990, 38, 'NV-RTX4060TI-16',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
  true, 4.5, 1876
),
(
  'MSI Ventus 2X OC RTX 4060 8GB',
  'msi-ventus-2x-oc-rtx-4060',
  'Dual-fan RTX 4060 with 2550MHz boost clock, 8GB GDDR6, low 115W TDP, compact PCB, DLSS 3 Frame Generation, and excellent 1080p gaming performance.',
  (SELECT id FROM categories WHERE name ILIKE '%graphic%' LIMIT 1),
  32990, 37990, 46, 'MSI-VNT-4060-OC',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
  true, 4.5, 2109
),

-- ══════════════════════════════════════════════════════════
-- NETWORKING (15 products)
-- ══════════════════════════════════════════════════════════

(
  'ASUS ROG Rapture GT-BE98 Wi-Fi 7',
  'asus-rog-rapture-gt-be98-wifi7',
  'Quad-band Wi-Fi 7 gaming router with 19,000Mbps total speed, 10G WAN + 2.5G WAN, 4× 2.5G LAN, ROG Game Acceleration, Instant Guard VPN, and AiMesh support.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  42990, 49990, 9, 'ASUS-ROG-GTBE98',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  true, 4.7, 543
),
(
  'TP-Link Archer BE800 Wi-Fi 7',
  'tp-link-archer-be800-wifi7',
  'Tri-band Wi-Fi 7 router with BE19000 speed (5760+5760+574 Mbps), 10G fiber WAN, 4× Gigabit LAN, 2.5G LAN, OFDMA, MLO, and EasyMesh compatibility.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  34990, 39990, 13, 'TPL-ARCH-BE800',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  true, 4.6, 678
),
(
  'Netgear Nighthawk RS700 Wi-Fi 7',
  'netgear-nighthawk-rs700-wifi7',
  'Tri-band Wi-Fi 7 router delivering up to 19Gbps, 2.5G Multi-Gig WAN, 4× 2.5G LAN, NETGEAR Armor cybersecurity, and OFDMA + MLO for ultra-low latency.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  39990, 46990, 10, 'NGR-NHK-RS700',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  true, 4.5, 432
),
(
  'ASUS ZenWiFi Pro ET12 Mesh System (2-Pack)',
  'asus-zenwifi-pro-et12-2pack',
  'Tri-band Wi-Fi 6E AXE11000 mesh system with 2.5G WAN/LAN, 10G WAN/LAN backhaul port, AiMesh, AiProtection Pro, and covers up to 560m². Professional grade.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  49990, 57990, 7, 'ASUS-ZWF-ET12-2P',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  true, 4.8, 321
),
(
  'TP-Link Deco XE75 Pro Wi-Fi 6E (3-Pack)',
  'tp-link-deco-xe75-pro-3pack',
  'Tri-band Wi-Fi 6E mesh system covering up to 650m², 2.4GHz+5GHz+6GHz bands, 10Gbps backhaul, OFDMA, seamless roaming, parental controls, and EasyMesh standard.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  37990, 43990, 11, 'TPL-DECO-XE75-3P',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  true, 4.6, 456
),
(
  'Netgear Orbi 960 Wi-Fi 6E (RBK963S)',
  'netgear-orbi-rbk963s',
  'Quad-band Wi-Fi 6E mesh system (1 router + 2 satellites) with AXE12000 speed, 10G WAN port, covers 850m², dedicated 6GHz backhaul, and NETGEAR Armor security.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  79990, 91990, 5, 'NGR-ORB-RBK963S',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  true, 4.7, 287
),
(
  'ASUS ROG Rapture GT-AX6000',
  'asus-rog-rapture-gt-ax6000',
  'Dual-band Wi-Fi 6 gaming router with AX6000 speed, 2.5G WAN + 2.5G LAN, Game Acceleration powered by DumaOS 3.0, VPN Fusion, and AiMesh 2.0.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  24990, 29990, 18, 'ASUS-ROG-GT-AX6K',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  true, 4.6, 876
),
(
  'TP-Link Archer AX90 Wi-Fi 6',
  'tp-link-archer-ax90',
  'Tri-band AX6600 router with 2.5G Ethernet, dedicated 4804Mbps 5GHz band for backhaul, OFDMA, MU-MIMO, and OneMesh compatibility for seamless whole-home coverage.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  14990, 17990, 29, 'TPL-ARCH-AX90',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  true, 4.5, 1234
),
(
  'D-Link DIR-X5460 Wi-Fi 6 AX5400',
  'dlink-dir-x5460-ax5400',
  'Dual-band Wi-Fi 6 router with AX5400 speeds, 8 high-gain antennas, BSS Coloring, Target Wake Time, OFDMA, and the D-Link Wi-Fi app for easy management.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  10990, 13490, 34, 'DLK-DIR-X5460',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  true, 4.3, 567
),
(
  'ASUS RT-AX88U Pro Wi-Fi 6',
  'asus-rt-ax88u-pro',
  'Dual-band AX6000 router with 8× Gigabit LAN, 2.5G WAN, ASUS AiMesh, AiProtection Pro powered by Trend Micro, Adaptive QoS, and VPN Fusion.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  18990, 22490, 22, 'ASUS-RT-AX88U-P',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  true, 4.7, 1432
),
(
  'TP-Link RE705X Wi-Fi 6 Range Extender',
  'tp-link-re705x-extender',
  'AX3000 Wi-Fi 6 range extender with dedicated 5GHz backhaul, Gigabit Ethernet port, OneMesh compatibility, and seamless roaming. Doubles your existing network coverage.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  4990, 6490, 52, 'TPL-RE705X',
  'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?w=800&q=80',
  true, 4.4, 876
),
(
  'Netgear EAX80 Wi-Fi 6 Mesh Extender',
  'netgear-eax80-mesh-extender',
  'AX6000 Wi-Fi 6 mesh extender with four-stream 4×4 technology, 4× Gigabit Ethernet ports, works with any router, and intelligent mesh for seamless handoff.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  7990, 9490, 38, 'NGR-EAX80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  true, 4.4, 654
),
(
  'TP-Link TL-SG1016D 16-Port Gigabit Switch',
  'tp-link-tl-sg1016d',
  'Unmanaged 16-port Gigabit Ethernet switch with plug-and-play setup, 32Gbps switching capacity, green Ethernet energy saving, and sturdy metal housing.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  3490, 4490, 74, 'TPL-SG1016D',
  'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?w=800&q=80',
  true, 4.6, 1876
),
(
  'Netgear GS316 16-Port Gigabit Unmanaged',
  'netgear-gs316-switch',
  '16-port Gigabit unmanaged switch with metal desktop/wallmount housing, fanless silent operation, plug-and-play, and ProSAFE lifetime warranty.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  4990, 6490, 58, 'NGR-GS316',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  true, 4.5, 1234
),
(
  'ASUS XG-C100C 10G PCIe Network Adapter',
  'asus-xg-c100c-10g-adapter',
  'PCIe x4 10GBase-T network adapter with backward compatibility (5G/2.5G/1G), heat sink for stable performance, and supports Windows, Linux, and macOS.',
  (SELECT id FROM categories WHERE name ILIKE '%network%' LIMIT 1),
  4490, 5990, 43, 'ASUS-XGC100C',
  'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?w=800&q=80',
  true, 4.6, 876
),

-- ══════════════════════════════════════════════════════════
-- OFFICE EQUIPMENT (20 products)
-- ══════════════════════════════════════════════════════════

(
  'LG 27GP950-B 4K 144Hz UltraGear Monitor',
  'lg-27gp950-b-4k-144hz',
  '27" 4K UHD (3840×2160) Nano IPS display with 144Hz refresh rate, 1ms GtG, HDR 600, HDMI 2.1 for console gaming, DisplayPort 1.4, and VESA Adaptive Sync.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  54990, 64990, 14, 'LG-27GP950-B',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
  true, 4.8, 2341
),
(
  'Samsung Odyssey Neo G8 32" 4K 240Hz',
  'samsung-odyssey-neo-g8-32',
  '32" 4K VA panel with Mini LED Quantum HDR 2000, 240Hz, 1ms GtG, HDR2000, HDMI 2.1, DisplayPort 1.4, Freesync Premium Pro, and G-Sync Compatible.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  79990, 94990, 9, 'SMG-ODY-NEO-G8-32',
  'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=800&q=80',
  true, 4.7, 1432
),
(
  'Dell UltraSharp U2723QE 4K USB-C Hub',
  'dell-ultrasharp-u2723qe',
  '27" 4K IPS Black panel with USB-C 90W charging, built-in 14-port hub, DeltaE<2 factory calibrated, HDR400, 100% sRGB/Rec.709, and 3-year Advanced Exchange warranty.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  62990, 73990, 17, 'DEL-U2723QE',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
  true, 4.8, 1876
),
(
  'LG 34WN80C-B 34" UltraWide QHD',
  'lg-34wn80c-b-ultrawide',
  '34" 21:9 WQHD (3440×1440) IPS curved display with USB-C 60W charging, sRGB 99%, HDR10, AMD FreeSync, 75Hz, and ergonomic height/pivot/tilt/swivel stand.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  44990, 52990, 21, 'LG-34WN80C-B',
  'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=800&q=80',
  true, 4.7, 1543
),
(
  'ASUS ProArt PA329CV 32" 4K Professional',
  'asus-proart-pa329cv-32',
  '32" 4K UHD IPS with 98% DCI-P3, 99.5% Adobe RGB, DeltaE<2, Calman Verified, USB-C 96W, Thunderbolt 3, and built-in colorimeter for self-calibration.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  84990, 97990, 8, 'ASUS-PA329CV',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
  true, 4.9, 876
),
(
  'BenQ PD3220U 32" 4K Designer Monitor',
  'benq-pd3220u-32',
  '32" 4K IPS with 95% P3, DeltaE<2, Thunderbolt 3 60W, USB-C, built-in KVM switch, 14-bit LUT hardware calibration support, and AQCOLOR Technology.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  74990, 87990, 11, 'BNQ-PD3220U',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
  true, 4.8, 1102
),
(
  'ViewSonic VP3268a-4K 32" ColorPro',
  'viewsonic-vp3268a-4k',
  '32" 4K IPS with 100% sRGB, 98% DCI-P3, DeltaE<2 factory calibration, USB-C 60W, hardware calibration support, and ColorPro Wheel for Pantone Validated accuracy.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  59990, 69990, 13, 'VSN-VP3268A',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
  true, 4.7, 678
),
(
  'HP LaserJet Pro M404dn',
  'hp-laserjet-pro-m404dn',
  'Monochrome laser printer with 40ppm, duplex printing, 1200 dpi, 256MB RAM, Gigabit Ethernet, USB 2.0, and JetIntelligence cartridges for up to 9,000 pages.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  22990, 27490, 28, 'HP-LJP-M404DN',
  'https://images.unsplash.com/photo-1612198527891-57ced9f20e9d?w=800&q=80',
  true, 4.6, 2341
),
(
  'Canon PIXMA TR8620a All-in-One',
  'canon-pixma-tr8620a',
  'Wireless inkjet all-in-one printer/copier/scanner/fax with 15ipm color, auto duplex, 2.4" touchscreen, 200-sheet tray, AirPrint, and 5-color individual ink tanks.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  17990, 21490, 35, 'CNO-PIXT-TR8620A',
  'https://images.unsplash.com/photo-1612198527891-57ced9f20e9d?w=800&q=80',
  true, 4.5, 1876
),
(
  'Epson EcoTank ET-4850 Supertank',
  'epson-ecotank-et-4850',
  'All-in-one printer with refillable ink tanks (up to 2 years of ink included), 4800×1200 dpi, auto duplex, ADF, Wi-Fi Direct, touchscreen, and low per-page cost.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  24990, 29490, 22, 'EPS-ECT-ET4850',
  'https://images.unsplash.com/photo-1612198527891-57ced9f20e9d?w=800&q=80',
  true, 4.6, 2876
),
(
  'Brother MFC-J4335DW INKvestment Tank',
  'brother-mfc-j4335dw',
  'All-in-one inkjet printer with INKvestment Tank system for up to 1 year of ink, auto duplex print/copy, wireless, 2-line LCD, and up to 1,500 page cartridges.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  15990, 19490, 31, 'BRO-MFCJ-4335DW',
  'https://images.unsplash.com/photo-1612198527891-57ced9f20e9d?w=800&q=80',
  true, 4.4, 1234
),
(
  'Logitech MX Keys S Advanced Wireless',
  'logitech-mx-keys-s',
  'Premium wireless keyboard with perfect-stroke spherically dished keys, backlit with smart illumination, multi-device Bluetooth, USB-C rechargeable, and smart action keys.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  9990, 12490, 47, 'LOG-MXKEYS-S',
  'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=800&q=80',
  true, 4.8, 3241
),
(
  'Apple Magic Keyboard with Touch ID',
  'apple-magic-keyboard-touch-id',
  'Wireless keyboard for Mac with Touch ID for secure authentication, scissor mechanism keys with 1mm travel, USB-C rechargeable, and seamless pairing with Apple devices.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  11990, NULL, 38, 'APL-MGKBD-TID',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
  true, 4.7, 4532
),
(
  'Logitech MX Master 3S Performance Mouse',
  'logitech-mx-master-3s',
  'Advanced wireless mouse with ultra-fast MagSpeed scroll, 8K DPI sensor, USB-C charging, quiet clicks, ergonomic thumb rest, and multi-device flow for up to 3 computers.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  8990, 10990, 54, 'LOG-MXMST3S-BLK',
  'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&q=80',
  true, 4.9, 5432
),
(
  'Microsoft Arc Mouse Bluetooth',
  'microsoft-arc-mouse',
  'Ultra-thin snap-flat wireless mouse with innovative arc design, BlueTrack Technology for any surface, Bluetooth, 6-month battery life, and precision scrolling.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  5990, 7490, 63, 'MSF-ARC-BLK',
  'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&q=80',
  true, 4.4, 2876
),
(
  'BenQ ScreenBar Plus Monitor Light',
  'benq-screenbar-plus',
  'LED monitor light bar with asymmetric optical design (no screen glare), wireless controller, color temperature adjustment (2700K–6500K), and USB-powered from your monitor.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  7490, 8990, 48, 'BNQ-SCRBP',
  'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&q=80',
  true, 4.7, 1876
),
(
  'Elgato Wave:3 USB Condenser Microphone',
  'elgato-wave3-usb-microphone',
  'Professional cardioid condenser microphone with 24-bit/96kHz audio, Clipguard dual-capsule technology, built-in pop filter, physical mute button, and Wave Link mixing software.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  9990, 12490, 29, 'ELG-WAVE3',
  'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=800&q=80',
  true, 4.7, 2341
),
(
  'Blue Yeti X Professional USB Microphone',
  'blue-yeti-x-usb-microphone',
  'Professional condenser microphone with 4 pickup patterns (cardioid, bidirectional, omnidirectional, stereo), 11-LED smart audio meter, and Blue VO!CE software for HD vocals.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  12990, 15490, 24, 'BLUE-YETIX',
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
  true, 4.6, 3109
),
(
  'Elgato Stream Deck MK.2 16-Key',
  'elgato-stream-deck-mk2',
  '16 customizable LCD keys, one-touch scene switching for OBS/Streamlabs, launch media and apps, control Spotify, manage tweets, and create automated workflows with plugins.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  14990, 17490, 31, 'ELG-STRDCK-MK2',
  'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&q=80',
  true, 4.8, 4231
),
(
  'Dell S2722DC 27" QHD USB-C Monitor',
  'dell-s2722dc-27-qhd',
  '27" QHD (2560×1440) IPS display with USB-C 65W charging, AMD FreeSync Premium, 75Hz, 4ms GtG, HDMI 2.0, and built-in 2× 5W stereo speakers.',
  (SELECT id FROM categories WHERE name ILIKE '%office%' LIMIT 1),
  34990, 41990, 26, 'DEL-S2722DC',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
  true, 4.6, 1543
),

-- ══════════════════════════════════════════════════════════
-- ACCESSORIES (15 products)
-- ══════════════════════════════════════════════════════════

(
  'Samsung 990 Pro NVMe SSD 2TB',
  'samsung-990-pro-nvme-2tb',
  'PCIe 4.0 NVMe M.2 SSD with 7,450/6,900 MB/s read/write speeds, 1,600K/1,550K IOPS random, nickel-coated controller, and Dynamic Thermal Guard. Ideal for PS5 and PC.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  17990, 21990, 34, 'SMG-990PRO-2TB',
  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
  true, 4.9, 3241
),
(
  'WD Black SN850X NVMe SSD 2TB',
  'wd-black-sn850x-nvme-2tb',
  'PCIe 4.0 NVMe SSD with 7,300/6,600 MB/s, game mode 2.0 for predictive loading, 6nm controller, PS5 compatible, and full-drive nCache 4.0 technology.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  16490, 19990, 41, 'WD-SN850X-2TB',
  'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80',
  true, 4.8, 2876
),
(
  'Corsair MP600 Pro XT 2TB PCIe 4.0',
  'corsair-mp600-pro-xt-2tb',
  'PCIe 4.0 NVMe M.2 SSD with 7,100/6,800 MB/s speeds, Phison E18 controller, high-density 3D TLC NAND, full-length aluminum heat spreader, and 1,400K IOPS.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  14990, 18490, 28, 'COR-MP600XT-2TB',
  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
  true, 4.7, 1432
),
(
  'Sabrent Rocket 4 Plus-G PCIe 4.0 4TB',
  'sabrent-rocket-4-plus-g-4tb',
  '4TB PCIe 4.0 NVMe SSD with 7,200/6,900 MB/s, Phison E18 platform, DRAM cache buffer, full-drive nCache technology, and DEVSLP power management.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  29990, 35990, 15, 'SAB-RK4PG-4TB',
  'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80',
  true, 4.7, 876
),
(
  'Seagate IronWolf Pro 8TB NAS HDD',
  'seagate-ironwolf-pro-8tb',
  '8TB CMR NAS hard drive with 7200RPM, 256MB cache, 300TB/year workload rate, multi-user performance enhancements, IronWolf Health Management, and 5-year warranty.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  18990, 22490, 27, 'SEG-IWP-8TB',
  'https://images.unsplash.com/photo-1563212035-43b3c3fc2b29?w=800&q=80',
  true, 4.7, 1876
),
(
  'WD Gold 6TB Enterprise HDD',
  'wd-gold-6tb-enterprise',
  '6TB enterprise-class CMR HDD with 7200RPM, 256MB cache, 550TB/year workload rate, RAFF vibration compensation, HelioSeal technology, and 5-year limited warranty.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  14990, 17990, 19, 'WD-GOLD-6TB',
  'https://images.unsplash.com/photo-1563212035-43b3c3fc2b29?w=800&q=80',
  true, 4.6, 1102
),
(
  'CalDigit TS4 Thunderbolt 4 Dock',
  'caldigit-ts4-thunderbolt4-dock',
  '18-port Thunderbolt 4 dock with 98W host charging, 2× TB4 downstream, 3× USB-A 10Gbps, 5× USB-A 3.2, SD/microSD 4.0, 2.5GbE, and support for 3× 4K monitors.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  39990, 45990, 12, 'CDG-TS4-TB4',
  'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80',
  true, 4.8, 2109
),
(
  'Anker PowerExpand Elite 13-in-1 USB-C Dock',
  'anker-powerexpand-elite-13in1-dock',
  '13-in-1 Thunderbolt 3 dock with 85W host charging, dual 4K HDMI + DisplayPort, 10Gbps USB-A/C, 2.5GbE, SD/TF card slots, and 3.5mm audio combo jack.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  16990, 19990, 28, 'ANK-PEXP-ELITE',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
  true, 4.6, 1876
),
(
  'NZXT Kraken 360 RGB AIO CPU Cooler',
  'nzxt-kraken-360-rgb-aio',
  '360mm AIO liquid CPU cooler with 2nd-gen Asetek pump, 3× 120mm Aer RGB fans, neon-lit infinity mirror design, and NZXT CAM software for full monitoring and control.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  19990, 23990, 21, 'NZXT-KRK360-RGB',
  'https://images.unsplash.com/photo-1624963020867-12d05f40af80?w=800&q=80',
  true, 4.7, 1543
),
(
  'Corsair iCUE H170i Elite LCD XT 420mm',
  'corsair-h170i-elite-lcd-xt-420mm',
  '420mm AIO with 3.5" IPS LCD display, 4× AF140 ELITE fans, tri-layer anti-leak barrier, and CORSAIR iCUE software integration. Maximum cooling for high-TDP CPUs.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  27990, 32990, 9, 'COR-H170I-LCDXT',
  'https://images.unsplash.com/photo-1624963020867-12d05f40af80?w=800&q=80',
  true, 4.8, 876
),
(
  'Noctua NH-D15 chromax.black CPU Cooler',
  'noctua-nh-d15-chromax-black',
  'Dual-tower premium air cooler with 2× NF-A15 sPWM fans, SecuFirm2 mounting, NT-H1 thermal compound, full black chromax design, and support for 250W TDP.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  10990, 12990, 37, 'NCT-NHD15-BLK',
  'https://images.unsplash.com/photo-1624963020867-12d05f40af80?w=800&q=80',
  true, 4.9, 3241
),
(
  'be quiet! Dark Rock Pro 4',
  'be-quiet-dark-rock-pro-4',
  'Dual-tower air CPU cooler with 250W TDP, 2× Silent Wings 135/120mm fans, 7 heat pipes, full copper heat spreader, and ultra-silent 21.4 dB(A) noise level.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  9490, 11490, 43, 'BEQ-DRP4',
  'https://images.unsplash.com/photo-1624963020867-12d05f40af80?w=800&q=80',
  true, 4.8, 2876
),
(
  'Anker 737 Power Bank 24,000mAh',
  'anker-737-power-bank-24000',
  '24,000mAh power bank with 140W output, PowerIQ 4.0 smart charging, digital display, simultaneous 3-device charging, and USB-C + USB-A ports. Charges MacBook Pro in 2h.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  9990, 12490, 51, 'ANK-737-24K',
  'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',
  true, 4.7, 4321
),
(
  'Belkin BoostCharge Pro 3-in-1 Wireless Pad',
  'belkin-boostcharge-pro-3in1',
  'Wireless charging pad for iPhone (15W MagSafe), Apple Watch (fast charge), and AirPods simultaneously. Includes 30W USB-C power adapter and 2m cable.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  7490, 8990, 44, 'BLK-BCP-3IN1',
  'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',
  true, 4.5, 2109
),
(
  'Corsair RM1000x Shift Modular PSU 1000W',
  'corsair-rm1000x-shift-1000w',
  '1000W 80 PLUS Gold fully modular power supply with side-mounted connectors (ATX 3.0), zero RPM fan mode, 105°C capacitors, 10-year warranty, and ATX 3.0 PCIe 5.0 connector.',
  (SELECT id FROM categories WHERE name ILIKE '%accessor%' LIMIT 1),
  14990, 17990, 23, 'COR-RM1000X-SHF',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
  true, 4.8, 1543
)

ON CONFLICT (slug) DO NOTHING;
