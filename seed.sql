SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- 1. Kategori
INSERT INTO public.categories (id, name) VALUES
  (1, 'Fotografi'),
  (2, 'Ilustrasi'),
  (3, '3D Art'),
  (4, 'UI/UX'),
  (5, 'Desain Grafis'),
  (6, 'Lainnya');

-- 2. Akun Admin & Kreator Pemilik Karya
INSERT INTO public.users (id, email, password_hash, role, curator_status, display_name, bio, avatar_url, external_url, rejection_reason, reviewed_by, created_at) VALUES
  (1, 'admin@rupa.com', '$2b$10$QeBE01UzcOHIngNXgF5df.TeW3RRHc1qOBFQ9eo4s/4X5Q2IhmAJS', 'admin', NULL, 'Admin Rupa', NULL, NULL, NULL, NULL, NULL, '2026-11-16 20:17:28.316239'),
  (8, 'mfarhannrt@gmail.com', '$2b$10$5TNeOSwvjfiq4Wvz7Sw0cumczPpwZSM7Revh.toz6ct5.Yekr35W6', 'member', NULL, 'Farhan Nurrahmat', NULL, NULL, NULL, NULL, NULL, '2026-11-25 10:40:29.807357'),
  (9, 'han@gmail.com', '$2b$10$d4MzkHHdb7ppgZzpHC5Jluq6A/2hbX/bsa.ZuxWstbADFvc.ZVT.G', 'member', NULL, 'Hanz', NULL, NULL, NULL, NULL, NULL, '2026-11-25 10:49:41.982698'),
  (10, 'member3@gmail.com', '$2b$10$UflKTBUmzmLgJqvhgn6hcuBsvZ9d8Bnl5U76s7Ks2VdMl1fK6o1Ge', 'member', NULL, 'Member 3', NULL, NULL, NULL, NULL, NULL, '2026-11-25 10:59:06.516626'),
  (11, 'member4@gmail.com', '$2b$10$Cs0X3yJDr5iUdC3jCGLoyOQIELJP.N3QV7gNL97yGB3Q9bbBda8YS', 'member', NULL, 'member 4', NULL, NULL, NULL, NULL, NULL, '2026-11-25 14:30:18.255765');

-- 3. Daftar Karya (24 Karya)
INSERT INTO public.artworks (id, user_id, category_id, title, description, tags, file_url, created_at) VALUES
  (1, 8, 1, 'Rektorat View', 'View Rekotrat Unhas', 'geometri', '/uploads/artworks/c8ba1e58-704d-43f4-ba8b-7a14d13bf5a5.jpg', '2026-11-25 10:42:19.267038'),
  (2, 8, 1, 'Gedung di seberang Danau', 'View dari Yotta Lego Lego', 'cinematic, aesthetic, senja', '/uploads/artworks/48c18e36-82a8-4988-ba21-90822fa02e3f.jpg', '2026-11-25 10:44:20.585044'),
  (3, 8, 1, 'Perahu Berlayar', 'Perahu Berlayar di sekitar laut di makassar', 'clean', '/uploads/artworks/1d47a6a9-25ff-4302-9d39-15c7c014740b.jpg', '2026-11-25 10:45:33.653243'),
  (4, 8, 1, 'Masjid 99 Kubah', 'View Masjid 99 Kubah dari Laut', 'clean, simetris', '/uploads/artworks/9b117d99-2efe-4d2a-ae22-b79e13141052.jpg', '2026-11-25 10:46:37.864372'),
  (5, 8, 1, 'Geometri Clean Architecture', 'Geometri Fotografi Gedung', 'clean, simetris', '/uploads/artworks/0469de35-0f24-4138-9b21-12ac9fd3d6cb.jpg', '2026-11-25 10:48:02.763999'),
  (6, 8, 1, 'Sunset CPI', 'View Sunset di CPI', 'cpi, sunset', '/uploads/artworks/df5dd932-817a-472a-8659-b83167649c53.jpg', '2026-11-25 10:48:56.159059'),
  (7, 9, 1, 'Menunggu Kelas', 'Potret seseorang yang menunggu di kelas dalam potrait', 'clean, framing', '/uploads/artworks/96ef2d6e-2522-4fd8-963a-200a4eee74aa.jpg', '2026-11-25 10:51:25.157237'),
  (8, 9, 1, 'Cahaya yang Berotasi', 'Foto Slow Shutter di CPI', 'slow shutter', '/uploads/artworks/74cd02f7-7ab0-4150-b7e4-93984695881c.jpg', '2026-11-25 10:52:46.502385'),
  (9, 9, 1, 'Menikmati Pantai Bersama', 'Foto Siluet Momen Kebersamaan di Pantai', 'siluet, pantai, aesthetic', '/uploads/artworks/1e97ca53-d200-428b-9ed8-7295328160c0.jpg', '2026-11-25 10:54:10.088611'),
  (10, 9, 1, 'Momen Bakar Ayam', 'Potret Membakar Ayam', 'low light', '/uploads/artworks/7887fed9-7956-41c1-9fff-b36e5a35c267.jpg', '2026-11-25 10:55:58.308051'),
  (11, 9, 1, 'Makan dengan  Cahaya', 'Potret Slow Shutter makan cahaya', 'slow shutter', '/uploads/artworks/51ec5eae-d8aa-4362-9fb3-85662a35db0e.jpg', '2026-11-25 10:56:55.955725'),
  (12, 9, 1, 'Potrait Well', 'Potrait Narsis Slow Shutter', 'clean, slow shutter, aesthetic', '/uploads/artworks/1b7498df-d616-40b2-9370-7abda546657f.jpg', '2026-11-25 10:57:50.154032'),
  (13, 10, 1, 'Rammang Rammang View', 'Foto Landscape Pemandangan', 'lanscape pemandangan', '/uploads/artworks/fbf5ec29-4963-4d35-a65a-b7871cc92026.jpg', '2026-11-25 11:00:34.908091'),
  (14, 10, 1, 'Menjaring Udang', 'Foto seorang Nelayan ingin menjaring udang', 'rule of third', '/uploads/artworks/c7189d86-5a7f-455e-bde9-1b3ea2a60760.jpg', '2026-11-25 11:01:50.745366'),
  (15, 10, 1, 'Siang di Danau CInta', 'Foto Lanscape Pemandangan di Danau Cinta', 'lanscape pemandangan', '/uploads/artworks/d370dc29-e079-4d9f-8f33-7dd86ea1ff8c.jpg', '2026-11-25 11:02:45.108092'),
  (16, 10, 1, 'Petasan Angkasa', 'Foto Petasan seperti Angkasa', 'neon', '/uploads/artworks/6eb90d2c-f7fc-4759-9838-d24a13d8119f.jpg', '2026-11-25 11:04:18.240885'),
  (17, 10, 1, 'Sore Volly', 'Potret Pemandangan di atas Gedung PKM', 'senja', '/uploads/artworks/094dfa0f-a02c-4c29-90aa-34d2a068111b.jpg', '2026-11-25 11:04:59.715638'),
  (18, 11, 2, 'Senja di Pantai', 'Senja di Pantai', 'ilustrasi', '/uploads/artworks/7167b169-1bc4-4c41-bdea-f242e832a59b.png', '2026-11-25 14:32:49.78413'),
  (19, 11, 2, 'Kabut Rose', 'Kabut Rose', 'ilustrasi', '/uploads/artworks/caea38db-f1a1-4929-937c-ef75bd7f144d.png', '2026-11-25 14:33:16.228196'),
  (20, 11, 2, 'Tiga Lapis', 'Tiga Lapis', 'ilustrasi', '/uploads/artworks/e8489dbd-dc06-4e9e-89fc-d2d677743cbb.png', '2026-11-25 14:33:53.018969'),
  (21, 11, 2, 'Anyaman', 'Anyaman Ilustrasi', 'ilustrasi', '/uploads/artworks/4cda27cb-9150-457e-8ee0-3cd304c1aa26.png', '2026-11-25 14:34:27.172714'),
  (22, 11, 2, 'Gerhana Kecil', 'Ilustrasi Gerhana Kecil', 'ilustrasi', '/uploads/artworks/635467af-5510-4050-833c-a30e3ab6853c.png', '2026-11-25 14:34:57.245925'),
  (23, 11, 2, 'Arus Sore', 'Ilustrasi Arus Sore', 'ilustrasi', '/uploads/artworks/ab34bec0-e712-405e-a5ff-30ccf4c3d10c.png', '2026-11-25 14:35:23.805308'),
  (24, 11, 2, 'Bukit Berlapis', 'Ilustrasi Bukit Berlapis', 'ilustrasi', '/uploads/artworks/69da2487-c9e0-4fd9-9b7d-99a87e95c2b8.png', '2026-11-25 14:36:19.548693');

-- 4. Sinkronisasi Sequence ID agar input baru tidak bentrok
SELECT pg_catalog.setval('public.categories_id_seq', 6, true);
SELECT pg_catalog.setval('public.users_id_seq', 11, true);
SELECT pg_catalog.setval('public.artworks_id_seq', 24, true);