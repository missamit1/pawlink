-- P1 / 04 — Add dog_id (nullable) to telemetry, alerts, safe_zone.
-- NO REMOTE APPLY until approved.
--
-- FK to public.dogs(id) which must already be uuid (step 02).
-- Remains NULL until backfill (step 05). No NOT NULL here.

BEGIN;

-- Guard: dogs.id must be uuid
DO $$
DECLARE
  id_type text;
BEGIN
  SELECT data_type INTO id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'dogs'
    AND column_name = 'id';

  IF id_type IS DISTINCT FROM 'uuid' THEN
    RAISE EXCEPTION
      'P1-04 blocked: dogs.id must be uuid (run step 02 first). Found: %', id_type;
  END IF;
END $$;

ALTER TABLE public.telemetry
  ADD COLUMN IF NOT EXISTS dog_id uuid
    REFERENCES public.dogs (id)
    ON DELETE CASCADE;

ALTER TABLE public.alerts
  ADD COLUMN IF NOT EXISTS dog_id uuid
    REFERENCES public.dogs (id)
    ON DELETE CASCADE;

ALTER TABLE public.safe_zone
  ADD COLUMN IF NOT EXISTS dog_id uuid
    REFERENCES public.dogs (id)
    ON DELETE CASCADE;

-- Helpful for dog-scoped queries/realtime later (non-unique yet)
CREATE INDEX IF NOT EXISTS telemetry_dog_id_idx ON public.telemetry (dog_id);
CREATE INDEX IF NOT EXISTS alerts_dog_id_idx ON public.alerts (dog_id);
CREATE INDEX IF NOT EXISTS safe_zone_dog_id_idx ON public.safe_zone (dog_id);

COMMIT;

-- ── Verification (run after apply) ─────────────────────────────
-- SELECT table_name, column_name, is_nullable, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND column_name = 'dog_id'
--   AND table_name IN ('telemetry', 'alerts', 'safe_zone')
-- ORDER BY table_name;
-- Expect: 3 rows, is_nullable = YES, data_type = uuid
--
-- SELECT
--   (SELECT COUNT(*) FROM public.telemetry WHERE dog_id IS NULL) AS telemetry_null,
--   (SELECT COUNT(*) FROM public.alerts WHERE dog_id IS NULL) AS alerts_null;
-- Expect: telemetry_null = 477, alerts_null = 459 (inspection baseline; re-count live)
