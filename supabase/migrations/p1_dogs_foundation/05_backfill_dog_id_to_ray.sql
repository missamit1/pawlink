-- P1 / 05 — Backfill dog_id → Ray (lookup by lineage; no hardcoded Ray UUID).
-- NO REMOTE APPLY until approved.
--
-- Resolves Ray with:
--   name = 'Ray' AND legacy_bigint_id = 1
-- Never pastes Ray's UUID into this file.

BEGIN;

DO $$
DECLARE
  ray_id uuid;
  ray_legacy bigint;
  ray_count integer;
  t_before bigint;
  a_before bigint;
  z_before bigint;
  t_total bigint;
  a_total bigint;
  z_total bigint;
  t_updated bigint;
  a_updated bigint;
  z_updated bigint;
  orphan_t bigint;
  orphan_a bigint;
  orphan_z bigint;
  expected_legacy_ray_id constant bigint := 1;
BEGIN
  SELECT COUNT(*) INTO ray_count
  FROM public.dogs
  WHERE name = 'Ray'
    AND legacy_bigint_id = expected_legacy_ray_id;

  IF ray_count = 0 THEN
    RAISE EXCEPTION
      'P1-05 blocked: no dog with name=Ray AND legacy_bigint_id=%',
      expected_legacy_ray_id;
  END IF;

  IF ray_count > 1 THEN
    RAISE EXCEPTION
      'P1-05 blocked: % matching Ray rows — refusing ambiguous backfill',
      ray_count;
  END IF;

  SELECT id, legacy_bigint_id
  INTO ray_id, ray_legacy
  FROM public.dogs
  WHERE name = 'Ray'
    AND legacy_bigint_id = expected_legacy_ray_id;

  IF ray_id IS NULL THEN
    RAISE EXCEPTION 'P1-05 blocked: Ray.id (uuid) is null';
  END IF;

  IF ray_legacy IS DISTINCT FROM expected_legacy_ray_id THEN
    RAISE EXCEPTION
      'P1-05 blocked: Ray.legacy_bigint_id=% does not match verified lineage %',
      ray_legacy, expected_legacy_ray_id;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.dogs
    WHERE name = 'Ray'
      AND legacy_bigint_id = expected_legacy_ray_id
      AND owner_user_id IS NULL
  ) THEN
    RAISE NOTICE
      'P1-05 warning: Ray.owner_user_id is still NULL. Prefer step 03 first.';
  END IF;

  SELECT COUNT(*) INTO t_total FROM public.telemetry;
  SELECT COUNT(*) INTO a_total FROM public.alerts;
  SELECT COUNT(*) INTO z_total FROM public.safe_zone;

  SELECT COUNT(*) INTO t_before FROM public.telemetry WHERE dog_id IS NULL;
  SELECT COUNT(*) INTO a_before FROM public.alerts WHERE dog_id IS NULL;
  SELECT COUNT(*) INTO z_before FROM public.safe_zone WHERE dog_id IS NULL;

  -- Fill only NULL dog_id. Do NOT invent safe_zone rows.
  UPDATE public.telemetry
  SET dog_id = ray_id
  WHERE dog_id IS NULL;

  GET DIAGNOSTICS t_updated = ROW_COUNT;

  UPDATE public.alerts
  SET dog_id = ray_id
  WHERE dog_id IS NULL;

  GET DIAGNOSTICS a_updated = ROW_COUNT;

  UPDATE public.safe_zone
  SET dog_id = ray_id
  WHERE dog_id IS NULL;

  GET DIAGNOSTICS z_updated = ROW_COUNT;

  IF (SELECT COUNT(*) FROM public.telemetry) IS DISTINCT FROM t_total
     OR (SELECT COUNT(*) FROM public.alerts) IS DISTINCT FROM a_total
     OR (SELECT COUNT(*) FROM public.safe_zone) IS DISTINCT FROM z_total THEN
    RAISE EXCEPTION 'P1-05 blocked: row totals changed during backfill';
  END IF;

  IF EXISTS (SELECT 1 FROM public.telemetry WHERE dog_id IS NULL)
     OR EXISTS (SELECT 1 FROM public.alerts WHERE dog_id IS NULL)
     OR EXISTS (SELECT 1 FROM public.safe_zone WHERE dog_id IS NULL) THEN
    RAISE EXCEPTION 'P1-05 blocked: null dog_id rows remain after backfill';
  END IF;

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

  IF orphan_t > 0 OR orphan_a > 0 OR orphan_z > 0 THEN
    RAISE EXCEPTION
      'P1-05 blocked: orphan dog_id (telemetry=%, alerts=%, safe_zone=%)',
      orphan_t, orphan_a, orphan_z;
  END IF;

  RAISE NOTICE
    'P1-05 backfill Ray uuid=% legacy=% — telemetry %/% nulls, alerts %/%, safe_zone %/% (total sz=%)',
    ray_id, ray_legacy, t_updated, t_before, a_updated, a_before, z_updated, z_before, z_total;
END $$;

COMMIT;
