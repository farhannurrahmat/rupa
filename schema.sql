-- Pengguna: Admin, Member, Curator
CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(10)  NOT NULL CHECK (role IN ('admin', 'member', 'curator')),
  curator_status  VARCHAR(10)  CHECK (curator_status IN ('pending', 'approved', 'rejected')),
  display_name    VARCHAR(100) NOT NULL,
  avatar_url      VARCHAR(255),
  bio             TEXT,
  link_instagram  VARCHAR(255),
  link_behance    VARCHAR(255),
  link_website    VARCHAR(255),
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  CHECK (
    (role = 'curator' AND curator_status IS NOT NULL) OR
    (role <> 'curator' AND curator_status IS NULL)
  )
);

--  Sesi login (token disimpan di cookie)
CREATE TABLE sessions (
  token      VARCHAR(64) PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL
);

-- Kategori karya, nama harus unik
CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Karya
CREATE TABLE artworks (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories(id),
  title       VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  tags        TEXT NOT NULL,            
  file_url    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Like (satu pengguna hanya bisa like satu kali per karya)
CREATE TABLE likes (
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, artwork_id)
);

-- Favorites
CREATE TABLE favorites (
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, artwork_id)
);

-- Komentar
CREATE TABLE comments (
  id         SERIAL PRIMARY KEY,
  artwork_id INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Laporan karya (satu Member hanya bisa melapor satu kali per karya)
CREATE TABLE artwork_reports (
  id          SERIAL PRIMARY KEY,
  artwork_id  INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  reporter_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason      VARCHAR(50) NOT NULL,
  status      VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dismissed')),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (artwork_id, reporter_id)
);

-- Challenge
CREATE TABLE challenges (
  id          SERIAL PRIMARY KEY,
  curator_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  rules       TEXT NOT NULL,
  prize       TEXT NOT NULL,
  start_date  TIMESTAMP NOT NULL,
  end_date    TIMESTAMP NOT NULL,
  banner_url  VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  CHECK (end_date > start_date)
);

-- Submisi challenge, kolom placement diisi 1-3 untuk pemenang
CREATE TABLE challenge_submissions (
  id           SERIAL PRIMARY KEY,
  challenge_id INT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  artwork_id   INT NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  placement    SMALLINT CHECK (placement BETWEEN 1 AND 3),
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (challenge_id, user_id),       -- 1 karya per Member per challenge
  UNIQUE (challenge_id, artwork_id),    -- satu karya tidak didaftarkan dua kali
  UNIQUE (challenge_id, placement)      -- satu peringkat hanya untuk satu karya
);

-- Index agar query galeri dan relasi tetap cepat
CREATE INDEX idx_artworks_user     ON artworks(user_id);
CREATE INDEX idx_artworks_category ON artworks(category_id);
CREATE INDEX idx_artworks_created  ON artworks(created_at DESC);
CREATE INDEX idx_comments_artwork  ON comments(artwork_id);
CREATE INDEX idx_likes_artwork     ON likes(artwork_id);
CREATE INDEX idx_submissions_chal  ON challenge_submissions(challenge_id);
CREATE INDEX idx_sessions_user     ON sessions(user_id);