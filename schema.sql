-- Schema D1 per le recensioni verificate con Google.
-- Eseguire una volta per database:
--   npm run db:local    (sviluppo, database locale di Wrangler)
--   npm run db:remote   (produzione, database Cloudflare)

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  google_sub TEXT NOT NULL,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  percorso TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL,
  decided_at TEXT,
  decided_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_reviews_status_created
  ON reviews (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_google_sub
  ON reviews (google_sub);

CREATE TABLE IF NOT EXISTS review_photos (
  id TEXT PRIMARY KEY,
  review_id TEXT NOT NULL,
  object_key TEXT NOT NULL,
  content_type TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_review_photos_review
  ON review_photos (review_id, position);
