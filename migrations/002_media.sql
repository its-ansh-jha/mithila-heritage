CREATE TABLE IF NOT EXISTS media_assets (
 id uuid PRIMARY KEY,
 content_type text NOT NULL CHECK(content_type IN ('image/jpeg','image/png','image/webp')),
 data bytea NOT NULL CHECK(octet_length(data)<=4000000),
 created_by text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
