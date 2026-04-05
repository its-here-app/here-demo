-- Rewrite existing spots.photo_url values to use the stable proxy route.
--
-- Prior to this migration, photo_url was stored as a raw Google Places URL
-- containing a rotating `photo_reference` and our API key:
--   https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=...&key=...
--
-- These URLs break when Google rotates the photo reference. Going forward,
-- we store a stable proxy URL that resolves the photo on demand:
--   /api/spots/photo?place_id={google_place_id}
--
-- Only rows that previously had a photo are updated; rows with NULL photo_url
-- are left alone (the spot had no photo from Google in the first place).

UPDATE spots
SET photo_url = '/api/spots/photo?place_id=' || google_place_id
WHERE photo_url IS NOT NULL
  AND photo_url LIKE 'https://maps.googleapis.com/%';
