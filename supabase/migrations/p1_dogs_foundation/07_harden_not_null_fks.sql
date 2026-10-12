-- P1 / 07 — Harden NOT NULL + tighten FKs (ONLY after 06 passes).
-- NO REMOTE APPLY until verification is green.
--
-- Sets:
--   dogs.owner_user_id NOT NULL
--   telemetry.dog_id / alerts.dog_id / safe_zone.dog_id NOT NULL
--
-- Aborts if any nulls remain or Ray has no owner.

BEGIN;

DO $$
DECLARE
  null_owners bigint;
  null_t bigint;
  null_a bigint;
  null_z bigint;
  orphan_t bigint;
  orphan_a bigint;
  orphan_z bigint;
  ray_owned boolean;
BEGIN
  SELECT COUNT(*) INTO null_owners
  FROM public.dogs
  WHERE owner_user_id IS NULL;

  SELECT EXISTS (
    SELECT 1
    FROM public.dogs d
    JOIN auth.users u ON u.id = d.owner_user_id
    WHERE d.name = 'Ray'
  ) INTO ray_owned;

  SELECT COUNT(*) INTO null_t FROM public.telemetry WHERE dog_id IS NULL;
  SELECT COUNT(*) INTO null_a FROM public.alerts WHERE dog_id IS NULL;
  SELECT COUNT(*) INTO null_z FROM public.safe_zone WHERE dog_id IS NULL;

  SELECT COUNT(*) INTO orphan_t
  FROM public.telemetry t
  LEFT JOIN public.dogs d ON d.id = t.dog_id
  WHERE t.dog_id IS NOT NULL AND d.id IS NULL;

  SELECT COUNT(*) INTO orphan_a
  FROM public.alerts a
  LEFT JOIN public.dogs d ON d.id = a.dog_id
  WHERE a.dog_id IS NOT NULL AND d.id IS NULL;

  SELECT COUNT(*) INTO orphan_z
  FROM public.safe_zone z
  LEFT JOIN public.dogs d ON d.id = z.dog_id
  WHERE z.dog_id IS NOT NULL AND d.id IS NULL;

  IF null_owners > 0 THEN
    RAISE EXCEPTION
      'P1-07 blocked: % dogs still missing owner_user_id', null_owners;
  END IF;

  IF NOT ray_owned THEN
    RAISE EXCEPTION
      'P1-07 blocked: Ray is not linked to a real auth.users row';
  END IF;

  IF null_t > 0 OR null_a > 0 OR null_z > 0 THEN
    RAISE EXCEPTION
      'P1-07 blocked: null dog_id remain (telemetry=%, alerts=%, safe_zone=%)',
      null_t, null_a, null_z;
  END IF;

  IF orphan_t > 0 OR orphan_a > 0 OR orphan_z > 0 THEN
    RAISE EXCEPTION
      'P1-07 blocked: orphan dog_id refs (telemetry=%, alerts=%, safe_zone=%)',
      orphan_t, orphan_a, orphan_z;
  END IF;
END $$;

ALTER TABLE public.dogs
  ALTER COLUMN owner_user_id SET NOT NULL;

ALTER TABLE public.telemetry
  ALTER COLUMN dog_id SET NOT NULL;

ALTER TABLE public.alerts
  ALTER COLUMN dog_id SET NOT NULL;

ALTER TABLE public.safe_zone
  ALTER COLUMN dog_id SET NOT NULL;

COMMIT;

-- ── Verification ───────────────────────────────────────────────
-- SELECT column_name, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND (
--     (table_name = 'dogs' AND column_name = 'owner_user_id')
--     OR (column_name = 'dog_id' AND table_name IN ('telemetry','alerts','safe_zone'))
--   );
-- Expect: all is_nullable = NO
