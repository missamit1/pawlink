-- P1 / 06 — Verification ONLY (SELECT). No DDL / DML.
-- Run before hardening (step 07). Safe to re-run anytime.
--
-- Current verified expectations (re-count live if data drifts):
--   dogs = 1
--   telemetry = 477 all Ray, 0 null
--   alerts = 459 all Ray, 0 null
--   safe_zone = 0
--   zero orphans

-- ── One result set: schema + Ray + counts + orphans ────────────
SELECT
  -- Schema
  (SELECT data_type
     FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'dogs' AND column_name = 'id'
  ) AS dogs_id_type,
  (SELECT data_type
     FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'dogs' AND column_name = 'legacy_bigint_id'
  ) AS dogs_legacy_type,
  (SELECT data_type
     FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'telemetry' AND column_name = 'dog_id'
  ) AS telemetry_dog_id_type,
  (SELECT data_type
     FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'alerts' AND column_name = 'dog_id'
  ) AS alerts_dog_id_type,
  (SELECT data_type
     FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'safe_zone' AND column_name = 'dog_id'
  ) AS safe_zone_dog_id_type,
  (SELECT is_nullable
     FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'telemetry' AND column_name = 'dog_id'
  ) AS telemetry_dog_id_nullable,
  (SELECT is_nullable
     FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'alerts' AND column_name = 'dog_id'
  ) AS alerts_dog_id_nullable,

  -- Ray identity / ownership
  (SELECT COUNT(*) FROM public.dogs WHERE name = 'Ray') AS ray_name_count,
  (SELECT COUNT(*)
     FROM public.dogs
    WHERE name = 'Ray' AND legacy_bigint_id = 1
  ) AS ray_lineage_count,
  (SELECT id
     FROM public.dogs
    WHERE name = 'Ray' AND legacy_bigint_id = 1
    LIMIT 1
  ) AS ray_uuid,
  (SELECT legacy_bigint_id
     FROM public.dogs
    WHERE name = 'Ray' AND legacy_bigint_id = 1
    LIMIT 1
  ) AS ray_legacy_bigint_id,
  (SELECT owner_user_id
     FROM public.dogs
    WHERE name = 'Ray' AND legacy_bigint_id = 1
    LIMIT 1
  ) AS ray_owner_user_id,
  EXISTS (
    SELECT 1
    FROM public.dogs d
    JOIN auth.users u ON u.id = d.owner_user_id
    WHERE d.name = 'Ray' AND d.legacy_bigint_id = 1
  ) AS ray_owner_exists_in_auth,

  -- Totals
  (SELECT COUNT(*) FROM public.dogs) AS dogs_total,
  (SELECT COUNT(*) FROM public.telemetry) AS telemetry_total,
  (SELECT COUNT(*) FROM public.telemetry WHERE dog_id IS NULL) AS telemetry_null_dog_id,
  (SELECT COUNT(*)
     FROM public.telemetry t
     JOIN public.dogs d ON d.id = t.dog_id
    WHERE d.name = 'Ray' AND d.legacy_bigint_id = 1
  ) AS telemetry_ray_count,
  (SELECT COUNT(DISTINCT dog_id) FROM public.telemetry) AS telemetry_distinct_dogs,
  (SELECT COUNT(*) FROM public.alerts) AS alerts_total,
  (SELECT COUNT(*) FROM public.alerts WHERE dog_id IS NULL) AS alerts_null_dog_id,
  (SELECT COUNT(*)
     FROM public.alerts a
     JOIN public.dogs d ON d.id = a.dog_id
    WHERE d.name = 'Ray' AND d.legacy_bigint_id = 1
  ) AS alerts_ray_count,
  (SELECT COUNT(DISTINCT dog_id) FROM public.alerts) AS alerts_distinct_dogs,
  (SELECT COUNT(*) FROM public.safe_zone) AS safe_zone_total,
  (SELECT COUNT(*) FROM public.safe_zone WHERE dog_id IS NULL) AS safe_zone_null_dog_id,

  -- Orphans
  (SELECT COUNT(*)
     FROM public.telemetry t
     LEFT JOIN public.dogs d ON d.id = t.dog_id
    WHERE t.dog_id IS NOT NULL AND d.id IS NULL
  ) AS telemetry_orphans,
  (SELECT COUNT(*)
     FROM public.alerts a
     LEFT JOIN public.dogs d ON d.id = a.dog_id
    WHERE a.dog_id IS NOT NULL AND d.id IS NULL
  ) AS alerts_orphans,
  (SELECT COUNT(*)
     FROM public.safe_zone z
     LEFT JOIN public.dogs d ON d.id = z.dog_id
    WHERE z.dog_id IS NOT NULL AND d.id IS NULL
  ) AS safe_zone_orphans;
