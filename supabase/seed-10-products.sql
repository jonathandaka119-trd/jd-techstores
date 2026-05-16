-- JD TechStores - 10 products
-- Run in Supabase SQL Editor

DELETE FROM public.products;

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active)
VALUES (
  'Premium Gaming Headset Pro X',
  'gaming-headset-pro-x',
  'Immersive 7.1 surround sound with noise-cancelling microphone. 50mm neodymium drivers, memory-foam ear cups, and braided cable.',
  (SELECT id FROM categories WHERE slug = 'gaming-peripherals'),
  4999, 6999, 45, 'GH-PRO-001',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  '{"Driver":"50mm","Frequency":"20Hz-20kHz","Impedance":"32 Ohm","Connection":"USB + 3.5mm","Weight":"320g","Microphone":"Retractable NC"}',
  ARRAY['gaming','headset','audio'], 4.8, 214, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active)
VALUES (
  'Mechanical RGB Keyboard TKL',
  'mechanical-rgb-keyboard-tkl',
  'Tenkeyless aluminium keyboard with Cherry MX Red switches, per-key RGB, PBT doubleshot keycaps, and detachable USB-C cable.',
  (SELECT id FROM categories WHERE slug = 'gaming-peripherals'),
  7999, 9999, 38, 'KB-TKL-001',
  'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&q=80',
  '{"Switch":"Cherry MX Red","Layout":"TKL 87-key","Lighting":"Per-key RGB","Polling Rate":"1000Hz","Keycaps":"PBT Doubleshot","Cable":"Detachable USB-C"}',
  ARRAY['gaming','keyboard','mechanical'], 4.9, 378, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active)
VALUES (
  'Wireless Pro Gaming Mouse 25K',
  'wireless-pro-gaming-mouse-25k',
  '25600 DPI Hero optical sensor, 70-hour battery life, 95g ultralight frame. Zero compromises between wired and wireless performance.',
  (SELECT id FROM categories WHERE slug = 'gaming-peripherals'),
  3499, 4999, 62, 'GM-PRO-001',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
  '{"DPI":"100-25600","Battery Life":"70 hours","Weight":"95g","Buttons":"6 programmable","Connection":"USB-C / 2.4GHz","Polling Rate":"1000Hz"}',
  ARRAY['gaming','mouse','wireless'], 4.7, 156, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active)
VALUES (
  'AMD Ryzen 9 7900X Processor',
  'ryzen-9-7900x',
  '12 cores, 24 threads, 5.6GHz max boost. Exceptional multi-threaded performance for content creation, 3D rendering, and high-FPS gaming.',
  (SELECT id FROM categories WHERE slug = 'processors-ram'),
  44999, 54999, 18, 'CPU-R9-001',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
  '{"Cores/Threads":"12/24","Base Clock":"4.7GHz","Boost Clock":"5.6GHz","L3 Cache":"64MB","Socket":"AM5","TDP":"170W"}',
  ARRAY['cpu','amd','ryzen','am5'], 4.9, 143, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active)
VALUES (
  'DDR5 32GB Kit 6000MHz',
  'ddr5-32gb-kit-6000',
  'Dual-channel 2x16GB DDR5-6000 CL30 with XMP 3.0 and EXPO support. Plug-and-play performance for Intel 13th Gen and AMD Ryzen 7000.',
  (SELECT id FROM categories WHERE slug = 'processors-ram'),
  12999, 15999, 40, 'RAM-D5-001',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
  '{"Capacity":"32GB (2x16GB)","Standard":"DDR5-6000","Latency":"CL30","Voltage":"1.35V","Profile":"XMP 3.0 / EXPO","Height":"34mm"}',
  ARRAY['ram','ddr5','memory'], 4.8, 89, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active)
VALUES (
  'NVIDIA GeForce RTX 4070 Ti 12GB',
  'rtx-4070-ti-12gb',
  '7680 CUDA cores, 12GB GDDR6X, DLSS 3 Frame Generation and full ray-tracing. Dominate 4K gaming at high refresh rates.',
  (SELECT id FROM categories WHERE slug = 'graphics-cards'),
  89999, 104999, 9, 'GPU-4070TI-001',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
  '{"CUDA Cores":"7680","VRAM":"12GB GDDR6X","Memory Bandwidth":"504 GB/s","TDP":"285W","Outputs":"3x DP 1.4a + HDMI 2.1","DLSS":"3 Frame Generation"}',
  ARRAY['gpu','nvidia','rtx','4k'], 4.9, 67, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active)
VALUES (
  'Wi-Fi 6E Tri-Band Gaming Router',
  'wifi-6e-tri-band-gaming-router',
  'AXE11000 tri-band Wi-Fi 6E with dedicated 6GHz band, 10Gbps LAN port, and hardware-accelerated QoS for gaming. Covers up to 280 sq.m.',
  (SELECT id FROM categories WHERE slug = 'networking'),
  18999, 24999, 14, 'RT-6E-001',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  '{"Standard":"Wi-Fi 6E (802.11ax)","Bands":"Tri-band 2.4+5+6GHz","Speed":"AXE11000","2.5G WAN":"Yes","10G LAN":"1 port","Coverage":"280 sq.m"}',
  ARRAY['networking','router','wifi6e','gaming'], 4.6, 52, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active)
VALUES (
  '27-inch 4K 144Hz IPS Gaming Monitor',
  '27-4k-144hz-ips-monitor',
  'IPS panel, 3840x2160, 144Hz, 1ms GTG, HDR600, G-Sync Compatible, and USB-C with 65W power delivery. The complete professional gaming display.',
  (SELECT id FROM categories WHERE slug = 'office-equipment'),
  44999, 56999, 11, 'MON-4K-001',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
  '{"Size":"27 inch","Resolution":"3840x2160 4K","Refresh Rate":"144Hz","Panel":"IPS","Response Time":"1ms GTG","HDR":"HDR600","USB-C PD":"65W"}',
  ARRAY['monitor','4k','gaming','ips'], 4.8, 198, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active)
VALUES (
  'PCIe 4.0 NVMe SSD 2TB',
  'nvme-ssd-2tb-pcie4',
  'Sequential reads of 7200 MB/s and writes of 6800 MB/s over PCIe 4.0. DRAM cache, TLC NAND, M.2 2280. 5-year warranty.',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  10999, 13999, 27, 'SSD-2T-001',
  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
  '{"Capacity":"2TB","Interface":"PCIe 4.0 x4 NVMe","Read":"7200 MB/s","Write":"6800 MB/s","Form Factor":"M.2 2280","Cache":"DRAM","Warranty":"5 years"}',
  ARRAY['ssd','nvme','storage','pcie4'], 4.9, 312, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active)
VALUES (
  'USB-C 13-in-1 Laptop Docking Station',
  'usb-c-13in1-docking-station',
  'One USB-C cable turns your laptop into a full workstation. Dual 4K HDMI, 4x USB-A, 2x USB-C, 100W PD, SD card, Gigabit Ethernet and audio.',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  7999, 9999, 35, 'DOCK-13-001',
  'https://cdn.shopify.com/s/files/1/0493/9834/9974/products/666_3840x.png?v=1756800781',
  '{"Ports":"13-in-1","HDMI":"2x 4K 60Hz","USB-A":"4x 3.2 Gen 1","USB-C":"2x","Power Delivery":"100W","Ethernet":"Gigabit","SD/microSD":"Yes"}',
  ARRAY['usb-c','hub','dock','accessories'], 4.7, 187, true
);
