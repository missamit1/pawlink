-- ROLLBACK for 05 — undo backfill (set dog_id back to NULL).
-- Only works while dog_id is still nullable (before step 07).

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'dog_id'
      AND table_name = 'telemetry'
      AND is_nullable = 'NO'
  ) THEN
    RAISE EXCEPTION
      'Rollback 05 blocked: dog_id is NOT NULL. Run rollback/07 first.';
  END IF;
END $$;

UPDATE public.telemetry SET dog_id = NULL;
UPDATE public.alerts SET dog_id = NULL;
UPDATE public.safe_zone SET dog_id = NULL;

COMMIT;
