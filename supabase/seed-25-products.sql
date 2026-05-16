DELETE FROM public.order_items;
DELETE FROM public.cart_items;
DELETE FROM public.wishlist;
DELETE FROM public.reviews;
DELETE FROM public.products;

-- ─── Gaming Peripherals (6) ───────────────────────────────────────────────────

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'HyperX Cloud III Wireless Gaming Headset',
  'hyperx-cloud-iii-wireless',
  'Professional wireless gaming headset with 53mm angled drivers, 120-hour battery, and DTS Headphone:X Spatial Audio. Memory foam ear cushions and detachable noise-cancelling mic.',
  (SELECT id FROM public.categories WHERE slug = 'gaming-peripherals'),
  8499, 10999, 42, 'GH-HXCIII-001',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  '{"Drivers":"53mm angled","Frequency":"10Hz-21kHz","Battery":"120 hours","Connection":"2.4GHz + USB-C","Weight":"309g","Microphone":"Detachable NC"}',
  ARRAY['gaming','headset','wireless','audio'], 4.8, 312, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'Logitech G Pro X TKL Mechanical Keyboard',
  'logitech-gpro-x-tkl-keyboard',
  'Esports-grade tenkeyless keyboard with swappable Pro-grade GX switches, per-key LIGHTSYNC RGB, and aircraft-grade aluminium top case. Favoured by professional players worldwide.',
  (SELECT id FROM public.categories WHERE slug = 'gaming-peripherals'),
  9999, 12499, 28, 'KB-LGPX-001',
  'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&q=80',
  '{"Switch":"GX Blue/Red/Brown (swappable)","Layout":"TKL 87-key","Lighting":"Per-key LIGHTSYNC RGB","Polling Rate":"1000Hz","Keycaps":"PBT","Cable":"Detachable USB-C"}',
  ARRAY['gaming','keyboard','mechanical','tkl'], 4.9, 487, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'Razer DeathAdder V3 HyperSpeed',
  'razer-deathadder-v3-hyperspeed',
  'Iconic ergonomic shape meets HyperSpeed wireless. 90-hour battery, Focus Pro 30K optical sensor, and optical mouse switches rated for 90M clicks. Under 64g.',
  (SELECT id FROM public.categories WHERE slug = 'gaming-peripherals'),
  6499, 8499, 55, 'GM-RDV3-001',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
  '{"DPI":"100-30000","Battery":"90 hours","Weight":"64g","Buttons":"6 programmable","Connection":"HyperSpeed 2.4GHz","Polling Rate":"1000Hz"}',
  ARRAY['gaming','mouse','wireless','razer'], 4.7, 234, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'SteelSeries Arctis Nova Pro Wireless',
  'steelseries-arctis-nova-pro-wireless',
  'Multi-system wireless gaming headset with hot-swap dual-battery system (never run out of power), active noise cancellation, and a retractable ClearCast Gen 2 AI mic.',
  (SELECT id FROM public.categories WHERE slug = 'gaming-peripherals'),
  24999, 29999, 14, 'GH-SSANP-001',
  'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=800&q=80',
  '{"ANC":"Active Noise Cancellation","Battery":"Hot-swap dual battery","Wireless":"2.4GHz + Bluetooth","Drivers":"40mm","Microphone":"Retractable ClearCast Gen 2","Platforms":"PC, PS5, Switch, Mobile"}',
  ARRAY['gaming','headset','wireless','anc','premium'], 4.9, 189, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'Corsair MM700 RGB Extended Gaming Mousepad',
  'corsair-mm700-rgb-extended',
  'Cloth surface gaming mousepad with 360° edge-to-edge RGB lighting, 15W wireless charging zone, and USB 3.0 pass-through port. Never tangle your cables again.',
  (SELECT id FROM public.categories WHERE slug = 'gaming-peripherals'),
  4999, 6499, 67, 'MP-CMM7-001',
  'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',
  '{"Size":"930 x 400 x 4mm","Surface":"Micro-weave cloth","RGB":"360° edge lighting","Charging":"15W Qi wireless","USB":"USB 3.0 pass-through","Base":"Non-slip rubber"}',
  ARRAY['gaming','mousepad','rgb','wireless-charging'], 4.6, 143, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'BenQ ZOWIE EC3-CW Wireless Mouse',
  'benq-zowie-ec3-cw-wireless',
  'Competition-grade asymmetric wireless mouse. 3200 DPI with four adjustable levels, 90-hour battery, and plug-and-play with no driver installation required.',
  (SELECT id FROM public.categories WHERE slug = 'gaming-peripherals'),
  7999, 9499, 31, 'GM-BZEC3-001',
  'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80',
  '{"DPI":"400/800/1600/3200","Battery":"90 hours","Weight":"95g","Connection":"2.4GHz RF","Polling Rate":"1000Hz","Driver":"Plug-and-play"}',
  ARRAY['gaming','mouse','wireless','esports'], 4.7, 96, true
);

-- ─── Processors & RAM (5) ─────────────────────────────────────────────────────

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'AMD Ryzen 9 7950X Processor',
  'amd-ryzen-9-7950x',
  '16 cores, 32 threads, 5.7GHz max boost. The flagship AM5 desktop CPU for 3D rendering, video production, and extreme multi-threaded workloads without compromise.',
  (SELECT id FROM public.categories WHERE slug = 'processors-ram'),
  64999, 79999, 8, 'CPU-R9-7950X',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
  '{"Cores/Threads":"16/32","Base Clock":"4.5GHz","Boost Clock":"5.7GHz","L3 Cache":"64MB","Socket":"AM5","TDP":"170W","Process":"TSMC 5nm"}',
  ARRAY['cpu','amd','ryzen','am5','flagship'], 4.9, 78, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'Intel Core i9-13900K Processor',
  'intel-core-i9-13900k',
  '24 cores (8P+16E), 32 threads, 5.8GHz max turbo. Raptor Lake flagship for gaming and content creation. Compatible with Z690/Z790 motherboards.',
  (SELECT id FROM public.categories WHERE slug = 'processors-ram'),
  44999, 54999, 12, 'CPU-I9-13900K',
  'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80',
  '{"Cores/Threads":"24 (8P+16E)/32","Base P-Core Clock":"3.0GHz","Boost Clock":"5.8GHz","L3 Cache":"36MB","Socket":"LGA1700","TDP":"125W (PL1)","Process":"Intel 7"}',
  ARRAY['cpu','intel','raptor-lake','lga1700'], 4.8, 152, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'AMD Ryzen 5 7600X Processor',
  'amd-ryzen-5-7600x',
  '6 cores, 12 threads, 5.3GHz max boost. The best-value AM5 CPU for gaming. Runs cool with stock cooler and dominates 1080p/1440p framerates.',
  (SELECT id FROM public.categories WHERE slug = 'processors-ram'),
  19999, 24999, 35, 'CPU-R5-7600X',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
  '{"Cores/Threads":"6/12","Base Clock":"4.7GHz","Boost Clock":"5.3GHz","L3 Cache":"32MB","Socket":"AM5","TDP":"105W","Process":"TSMC 5nm"}',
  ARRAY['cpu','amd','ryzen','am5','value'], 4.8, 267, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'G.Skill Trident Z5 DDR5 64GB Kit 6400MHz',
  'gskill-trident-z5-ddr5-64gb-6400',
  'Dual-channel 2×32GB DDR5-6400 CL32 with XMP 3.0 and EXPO. Low-profile design for large cooler clearance. Ideal for workstations and content-creation rigs.',
  (SELECT id FROM public.categories WHERE slug = 'processors-ram'),
  24999, 29999, 22, 'RAM-GS-D5-64',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
  '{"Capacity":"64GB (2x32GB)","Standard":"DDR5-6400","Latency":"CL32","Voltage":"1.4V","Profile":"XMP 3.0 / EXPO","Height":"31mm (low profile)"}',
  ARRAY['ram','ddr5','64gb','workstation'], 4.7, 54, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'Corsair Vengeance DDR4 32GB Kit 3600MHz',
  'corsair-vengeance-ddr4-32gb-3600',
  'Reliable 2×16GB DDR4-3600 CL18 kit with XMP 2.0 support. Wide compatibility with Intel and AMD platforms. A solid choice for gaming and everyday productivity.',
  (SELECT id FROM public.categories WHERE slug = 'processors-ram'),
  7499, 9499, 58, 'RAM-CV-D4-32',
  'https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?w=800&q=80',
  '{"Capacity":"32GB (2x16GB)","Standard":"DDR4-3600","Latency":"CL18","Voltage":"1.35V","Profile":"XMP 2.0","Height":"34mm"}',
  ARRAY['ram','ddr4','32gb','gaming'], 4.8, 412, true
);

-- ─── Graphics Cards (4) ───────────────────────────────────────────────────────

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'NVIDIA GeForce RTX 4080 Super 16GB',
  'rtx-4080-super-16gb',
  '10240 CUDA cores, 16GB GDDR6X, DLSS 3.5 with Ray Reconstruction. Dominates 4K at 60+ FPS in demanding titles. Ideal for high-end gaming and professional creative work.',
  (SELECT id FROM public.categories WHERE slug = 'graphics-cards'),
  99999, 119999, 7, 'GPU-4080S-001',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
  '{"CUDA Cores":"10240","VRAM":"16GB GDDR6X","Memory Bandwidth":"736 GB/s","TDP":"320W","Outputs":"3x DP 1.4a + HDMI 2.1","DLSS":"3.5 with Ray Reconstruction"}',
  ARRAY['gpu','nvidia','rtx','4k','premium'], 5.0, 43, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'AMD Radeon RX 7900 GRE 16GB',
  'amd-radeon-rx-7900-gre-16gb',
  '5120 stream processors, 16GB GDDR6, and AMD FSR 3 with Fluid Motion Frames. Exceptional 4K rasterisation performance at a competitive price point.',
  (SELECT id FROM public.categories WHERE slug = 'graphics-cards'),
  69999, 84999, 11, 'GPU-RX7900G-001',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  '{"Stream Processors":"5120","VRAM":"16GB GDDR6","Memory Bandwidth":"576 GB/s","TDP":"260W","Outputs":"2x DP 2.1 + 2x HDMI 2.1","FSR":"3 Fluid Motion Frames"}',
  ARRAY['gpu','amd','radeon','4k','value'], 4.8, 89, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'NVIDIA GeForce RTX 4070 Super 12GB',
  'rtx-4070-super-12gb',
  '7168 CUDA cores, 12GB GDDR6X, DLSS 3 Frame Generation. Sweet-spot for 1440p 144Hz gaming. 40% faster than RTX 3080 at a fraction of the power draw.',
  (SELECT id FROM public.categories WHERE slug = 'graphics-cards'),
  54999, 64999, 19, 'GPU-4070S-001',
  'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',
  '{"CUDA Cores":"7168","VRAM":"12GB GDDR6X","Memory Bandwidth":"504 GB/s","TDP":"220W","Outputs":"3x DP 1.4a + HDMI 2.1","DLSS":"3 Frame Generation"}',
  ARRAY['gpu','nvidia','rtx','1440p','sweet-spot'], 4.9, 178, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'AMD Radeon RX 7600 XT 16GB',
  'amd-radeon-rx-7600-xt-16gb',
  '2048 stream processors, 16GB GDDR6 — twice the VRAM of competitors at this price. Great for 1080p high-refresh gaming and future-proofed for upcoming titles.',
  (SELECT id FROM public.categories WHERE slug = 'graphics-cards'),
  29999, 35999, 44, 'GPU-RX7600X-001',
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
  '{"Stream Processors":"2048","VRAM":"16GB GDDR6","Memory Bandwidth":"288 GB/s","TDP":"165W","Outputs":"1x DP 2.1 + 3x HDMI 2.1","FSR":"3"}',
  ARRAY['gpu','amd','radeon','1080p','budget'], 4.6, 132, true
);

-- ─── Networking (4) ───────────────────────────────────────────────────────────

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'ASUS ROG Rapture GT-BE98 Wi-Fi 7 Router',
  'asus-rog-rapture-gt-be98-wifi7',
  'Quad-band Wi-Fi 7 router with 24Gbps combined throughput, 10G + 2.5G WAN ports, and RangeBoost Plus. Dedicated gaming network traffic prioritisation built in.',
  (SELECT id FROM public.categories WHERE slug = 'networking'),
  34999, 42999, 9, 'RT-ASUS-BE98',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  '{"Standard":"Wi-Fi 7 (802.11be)","Bands":"Quad-band","Speed":"24Gbps combined","10G WAN":"Yes","2.5G WAN":"Yes","Coverage":"500 sq.m"}',
  ARRAY['networking','router','wifi7','gaming'], 4.8, 61, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'TP-Link TL-SG1016PE 16-Port PoE+ Switch',
  'tplink-sg1016pe-16port-poe',
  '16-port Gigabit PoE+ unmanaged switch with 8 PoE+ ports (120W total budget). Ideal for IP cameras, access points, and VoIP phones. Fanless, silent operation.',
  (SELECT id FROM public.categories WHERE slug = 'networking'),
  8999, 11499, 24, 'SW-TPSG16P-001',
  'https://images.unsplash.com/photo-1545987796-200677ee1011?w=800&q=80',
  '{"Ports":"16x Gigabit (8x PoE+)","PoE Budget":"120W","Switching Capacity":"32Gbps","Mounting":"Rack / Desktop","Noise":"Fanless","Standards":"IEEE 802.3af/at"}',
  ARRAY['networking','switch','poe','unmanaged'], 4.7, 88, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'TP-Link Archer TXE75E Wi-Fi 6E PCIe Adapter',
  'tplink-archer-txe75e-wifi6e-pcie',
  'Upgrade any desktop to Wi-Fi 6E with this PCIe adapter. Tri-band 6GHz support, Bluetooth 5.3, and an external magnetic antenna stand for best placement.',
  (SELECT id FROM public.categories WHERE slug = 'networking'),
  3999, 5499, 47, 'NIC-TXETXE75E-001',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  '{"Standard":"Wi-Fi 6E (802.11ax)","Bands":"Tri-band 2.4+5+6GHz","Speed":"AXE5400","Interface":"PCIe x1","Bluetooth":"5.3","Antenna":"4x external magnetic"}',
  ARRAY['networking','wifi6e','pcie','adapter','bluetooth'], 4.6, 73, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'Ubiquiti UniFi U6 Lite Access Point',
  'ubiquiti-unifi-u6-lite',
  'Dual-band Wi-Fi 6 access point managed via UniFi Network. 4× spatial streams, 1.5Gbps aggregate throughput, PoE-powered (PoE injector included). Perfect for homes and small offices.',
  (SELECT id FROM public.categories WHERE slug = 'networking'),
  12999, 15999, 18, 'AP-UBU6L-001',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  '{"Standard":"Wi-Fi 6 (802.11ax)","Bands":"Dual-band 2.4+5GHz","Throughput":"1.5Gbps","Spatial Streams":"4","Power":"PoE 802.3af (included)","Management":"UniFi Network"}',
  ARRAY['networking','access-point','wifi6','unifi','enterprise'], 4.9, 114, true
);

-- ─── Office Equipment (3) ─────────────────────────────────────────────────────

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'LG 32UN880-B 32" 4K Ergo Monitor',
  'lg-32un880-4k-ergo-monitor',
  '32-inch IPS 4K UHD display with HDR10, 99% sRGB, and an innovative Ergo stand with full pivot, tilt, height, and swivel adjustment. USB-C 96W power delivery.',
  (SELECT id FROM public.categories WHERE slug = 'office-equipment'),
  52999, 64999, 13, 'MON-LG32U-001',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
  '{"Size":"32 inch","Resolution":"3840x2160 4K","Panel":"IPS","Refresh Rate":"60Hz","HDR":"HDR10","USB-C PD":"96W","Stand":"Ergo (full pivot/tilt/height/swivel)"}',
  ARRAY['monitor','4k','office','ergonomic','usb-c'], 4.8, 156, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'Samsung 34" Odyssey G85SB OLED Ultrawide',
  'samsung-odyssey-g85sb-34-oled',
  '34-inch QD-OLED ultrawide at 3440×1440 175Hz. 0.03ms response, infinite contrast ratio, and 99.3% DCI-P3. A single monitor that handles both gaming and colour-accurate creative work.',
  (SELECT id FROM public.categories WHERE slug = 'office-equipment'),
  84999, 99999, 6, 'MON-SG85-001',
  'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80',
  '{"Size":"34 inch","Resolution":"3440x1440 UWQHD","Panel":"QD-OLED","Refresh Rate":"175Hz","Response Time":"0.03ms","HDR":"DisplayHDR True Black 400","Color":"99.3% DCI-P3"}',
  ARRAY['monitor','oled','ultrawide','gaming','creative'], 5.0, 87, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'Brother MFC-L3760CDW Colour Laser Printer',
  'brother-mfc-l3760cdw-colour-laser',
  'All-in-one colour laser: print, copy, scan, fax. 31 ppm, automatic duplex, Wi-Fi, and NFC tap-to-print. Low per-page cost with high-yield toner cartridges.',
  (SELECT id FROM public.categories WHERE slug = 'office-equipment'),
  28999, 34999, 17, 'PRN-BML376-001',
  'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80',
  '{"Type":"All-in-one colour laser","Speed":"31 ppm (mono+colour)","Duplex":"Automatic","Connectivity":"Wi-Fi, USB, NFC","Scan Resolution":"1200 dpi","Paper Capacity":"250 sheets"}',
  ARRAY['printer','laser','colour','office','all-in-one'], 4.6, 103, true
);

-- ─── Accessories (3) ──────────────────────────────────────────────────────────

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'Samsung 990 Pro NVMe SSD 2TB',
  'samsung-990-pro-nvme-2tb',
  'PCIe 4.0 flagship NVMe SSD. Sequential reads of 7450 MB/s and writes of 6900 MB/s. Includes a heatsink variant for PS5 compatibility. 5-year warranty.',
  (SELECT id FROM public.categories WHERE slug = 'accessories'),
  14999, 17999, 33, 'SSD-S990P-2T',
  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
  '{"Capacity":"2TB","Interface":"PCIe 4.0 x4 NVMe","Sequential Read":"7450 MB/s","Sequential Write":"6900 MB/s","Form Factor":"M.2 2280","DRAM":"Yes","Warranty":"5 years"}',
  ARRAY['ssd','nvme','samsung','storage','pcie4'], 4.9, 389, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'Corsair RM1000x Shift 1000W Modular PSU',
  'corsair-rm1000x-shift-1000w',
  '80 PLUS Gold certified 1000W fully modular PSU with side-mounted cables for easier routing in modern cases. Quiet 135mm fan stays off under 40% load.',
  (SELECT id FROM public.categories WHERE slug = 'accessories'),
  16999, 20999, 21, 'PSU-CRM1K-001',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  '{"Wattage":"1000W","Certification":"80 PLUS Gold","Modular":"Fully modular (side-mount)","Fan":"135mm Zero RPM","ATX Spec":"ATX 3.0 / PCIe 5.0","Protections":"OVP/UVP/SCP/OCP/OTP"}',
  ARRAY['psu','1000w','gold','modular','corsair'], 4.8, 167, true
);

INSERT INTO public.products (name, slug, description, category_id, price, original_price, stock_quantity, sku, main_image_url, specifications, tags, rating, review_count, is_active) VALUES (
  'Anker 777 USB-C Docking Station 13-in-1',
  'anker-777-usbc-docking-13in1',
  'One cable turns your laptop into a workstation. Dual 4K HDMI, 2× Thunderbolt 4, 4× USB-A 3.2, 100W laptop charging, SD/microSD, and Gigabit Ethernet — all in a compact aluminium housing.',
  (SELECT id FROM public.categories WHERE slug = 'accessories'),
  11999, 14999, 39, 'DOCK-ANK777-001',
  'https://cdn.shopify.com/s/files/1/0493/9834/9974/products/666_3840x.png?v=1756800781',
  '{"Ports":"13-in-1","HDMI":"2x 4K 60Hz","Thunderbolt":"2x TB4","USB-A":"4x 3.2 Gen 2","Power Delivery":"100W","Ethernet":"Gigabit","SD/microSD":"Yes"}',
  ARRAY['usb-c','thunderbolt','hub','dock','accessories'], 4.7, 241, true
);
