-- ROLLBACK for 04 — drop dog_id columns + indexes.
-- Blocked if NOT NULL already applied (step 07) or you prefer nulling first via 05 rollback.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'dog_id'
      AND table_name IN ('telemetry', 'alerts', 'safe_zone')
      AND is_nullable = 'NO'
  ) THEN
    RAISE EXCEPTION
      'Rollback 04 blocked: dog_id is NOT NULL. Run rollback/07 first.';
  END IF;
END $$;

DROP INDEX IF EXISTS public.telemetry_dog_id_idx;
DROP INDEX IF EXISTS public.alerts_dog_id_idx;
DROP INDEX IF EXISTS public.safe_zone_dog_id_idx;

ALTER TABLE public.telemetry DROP COLUMN IF EXISTS dog_id;
ALTER TABLE public.alerts DROP COLUMN IF EXISTS dog_id;
ALTER TABLE public.safe_zone DROP COLUMN IF EXISTS dog_id;

COMMIT;
