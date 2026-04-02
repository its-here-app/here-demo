-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_place_id text UNIQUE NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add city_id to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES cities(id);

-- Add city_id to playlists
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES cities(id);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_cities_google_place_id ON cities(google_place_id);
CREATE INDEX IF NOT EXISTS idx_profiles_city_id ON profiles(city_id);
CREATE INDEX IF NOT EXISTS idx_playlists_city_id ON playlists(city_id);

-- Allow authenticated users to read cities
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cities"
  ON cities FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert cities"
  ON cities FOR INSERT
  TO authenticated
  WITH CHECK (true);
