CREATE TABLE IF NOT EXISTS site_settings (id integer PRIMARY KEY CHECK(id=1), data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS resources (id uuid PRIMARY KEY, kind text NOT NULL CHECK(kind IN ('room','table')), name text NOT NULL, room_type text, capacity integer NOT NULL CHECK(capacity>0), rate numeric(12,2) NOT NULL DEFAULT 0 CHECK(rate>=0), active boolean NOT NULL DEFAULT true);
CREATE TABLE IF NOT EXISTS bookings (
 id uuid PRIMARY KEY, reference text UNIQUE NOT NULL, kind text NOT NULL CHECK(kind IN ('room','table','property')),
 resource_ids uuid[] NOT NULL DEFAULT '{}', starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL CHECK(ends_at>starts_at),
 status text NOT NULL CHECK(status IN ('hold','confirmed','cancel_requested','cancelled','expired','reconciliation','blocked')),
 expires_at timestamptz, guest jsonb NOT NULL, quote jsonb NOT NULL, amount integer NOT NULL CHECK(amount>=0),
 order_id text UNIQUE, payment_id text UNIQUE, source text NOT NULL DEFAULT 'website', refund_id text, refund_status text,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bookings_window_idx ON bookings(starts_at,ends_at);
CREATE TABLE IF NOT EXISTS access_tokens (token_hash text PRIMARY KEY, booking_id uuid NOT NULL REFERENCES bookings(id), expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS inquiries (id uuid PRIMARY KEY, data jsonb NOT NULL, status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS notifications (id uuid PRIMARY KEY, booking_id uuid REFERENCES bookings(id), recipient text NOT NULL, subject text NOT NULL, html text NOT NULL, status text NOT NULL DEFAULT 'pending', attempts integer NOT NULL DEFAULT 0, last_error text, sent_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS audit_log (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, actor text NOT NULL, action text NOT NULL, entity_id text, created_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
