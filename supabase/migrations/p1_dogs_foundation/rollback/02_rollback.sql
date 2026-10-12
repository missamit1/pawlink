-- ROLLBACK for 02 — restore dogs.id from legacy_bigint_id EXACTLY.
-- NO invented IDs. NO ROW_NUMBER().
--
-- Expected Ray:
--   AFTER rollback: id = 1 (from legacy_bigint_id), name = Ray
--
-- Only safe BEFORE step 04 (no dog_id UUID FKs yet).

BEGIN;

-- Block if downstream UUID dog_id columns exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN ('telemetry', 'alerts', 'safe_zone')
      AND column_name = 'dog_id'
  ) THEN
    RAISE EXCEPTION
      'Rollback 02 blocked: dog_id columns exist. Roll back 05→04 first.';
  END IF;
END $$;

-- Guards A–C: legacy_bigint_id complete + unique
DO $$
DECLARE
  null_legacy bigint;
  dup_legacy bigint;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'dogs'
      AND column_name = 'legacy_bigint_id'
  ) THEN
    RAISE EXCEPTION
      'Rollback 02 blocked: legacy_bigint_id column missing — cannot restore exact IDs';
  END IF;

  SELECT COUNT(*) INTO null_legacy
  FROM public.dogs
  WHERE legacy_bigint_id IS NULL;

  IF null_legacy > 0 THEN
    RAISE EXCEPTION
      'Rollback 02 blocked: % dogs missing legacy_bigint_id', null_legacy;
  END IF;

  SELECT COUNT(*) INTO dup_legacy
  FROM (
    SELECT legacy_bigint_id
    FROM public.dogs
    GROUP BY legacy_bigint_id
    HAVING COUNT(*) > 1
  ) d;

  IF dup_legacy > 0 THEN
    RAISE EXCEPTION
      'Rollback 02 blocked: duplicate legacy_bigint_id values — refusing invented IDs';
  END IF;
END $$;

-- Guard D: dogs.id must currently be uuid (post-02 state)
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
      'Rollback 02 blocked: unexpected dogs.id type % (expected uuid)', id_type;
  END IF;
END $$;

-- Restore bigint PK from preserved legacy values
ALTER TABLE public.dogs
  ADD COLUMN IF NOT EXISTS id_bigint bigint;

UPDATE public.dogs
SET id_bigint = legacy_bigint_id
WHERE id_bigint IS NULL;

-- Confirm exact copy before destructive swap
DO $$
DECLARE
  mismatch bigint;
BEGIN
  SELECT COUNT(*) INTO mismatch
  FROM public.dogs
  WHERE id_bigint IS DISTINCT FROM legacy_bigint_id
     OR id_bigint IS NULL;

  IF mismatch > 0 THEN
    RAISE EXCEPTION
      'Rollback 02 blocked: id_bigint does not exactly match legacy_bigint_id (% rows)',
      mismatch;
  END IF;
END $$;

ALTER TABLE public.dogs DROP CONSTRAINT IF EXISTS dogs_pkey;
ALTER TABLE public.dogs DROP CONSTRAINT IF EXISTS dogs_legacy_bigint_id_key;

ALTER TABLE public.dogs DROP COLUMN id;

ALTER TABLE public.dogs RENAME COLUMN id_bigint TO id;

ALTER TABLE public.dogs
  ALTER COLUMN id SET NOT NULL;

ALTER TABLE public.dogs ADD CONSTRAINT dogs_pkey PRIMARY KEY (id);

-- Keep legacy_bigint_id for audit (still equals id after restore).
-- Optional cleanup left to operator; do NOT drop here by default.

COMMIT;

-- ── Verification ───────────────────────────────────────────────
-- SELECT id, legacy_bigint_id, name FROM public.dogs WHERE name = 'Ray';
-- Expect: id = 1, legacy_bigint_id = 1
