-- Akun Admin
-- Email    : admin@rupa.com
-- Password : Admin12345   (disimpan sebagai hash bcrypt, bukan teks biasa)
INSERT INTO users (email, password_hash, role, display_name)
VALUES (
  'admin@rupa.com',
  '$2b$10$QeBE01UzcOHIngNXgF5df.TeW3RRHc1qOBFQ9eo4s/4X5Q2IhmAJS',
  'admin',
  'Admin Rupa'
);

-- Kategori awal
INSERT INTO categories (name) VALUES
  ('Fotografi'),
  ('Ilustrasi'),
  ('3D Art'),
  ('UI/UX'),
  ('Desain Grafis'),
  ('Lainnya');