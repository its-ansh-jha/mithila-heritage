CREATE TABLE IF NOT EXISTS guest_accounts (
 firebase_uid text PRIMARY KEY CHECK(length(firebase_uid) BETWEEN 1 AND 128),
 email text NOT NULL,
 email_verified boolean NOT NULL DEFAULT false,
 display_name text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE guest_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS firebase_uid text REFERENCES guest_accounts(firebase_uid);
CREATE INDEX IF NOT EXISTS bookings_guest_uid_idx ON bookings(firebase_uid,created_at DESC) WHERE firebase_uid IS NOT NULL;
