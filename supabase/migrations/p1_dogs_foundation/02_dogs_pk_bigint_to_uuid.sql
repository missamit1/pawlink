-- P1 / 02 — Convert dogs.id from bigint PK → uuid PK.
-- NO REMOTE APPLY until approved.
--
-- Preserves original bigint identity in:
--   legacy_bigint_id
--
-- Ray lifecycle (current remote: id = 1):
--   BEFORE: id = 1, name = Ray
--   AFTER:  id = <gen_random_uuid()>, legacy_bigint_id = 1, name = Ray
--
-- Does NOT:
--   hardcode Ray UUID or legacy id = 1
--   assign owner
--   touch telemetry / alerts / safe_zone
--   invent Auth users

BEGIN;

-- ── Guard: refuse if FKs already reference dogs.id ─────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class rel ON rel.oid = c.confrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE c.contype = 'f'
      AND nsp.nspname = 'public'
      AND rel.relname = 'dogs'
      AND EXISTS (
        SELECT 1
        FROM unnest(c.confkey) AS fk_attnum
        JOIN pg_attribute a
          ON a.attrelid = c.confrelid
         AND a.attnum = fk_attnum
        WHERE a.attname = 'id'
      )
  ) THEN
    RAISE EXCEPTION
      'P1-02 blocked: foreign keys still reference public.dogs(id). Update the migration plan before applying.';
  END IF;
END $$;

-- ── Guard: dogs.id must still be bigint/integer family ─────────
DO $$
DECLARE
  id_type text;
BEGIN
  SELECT data_type INTO id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'dogs'
    AND column_name = 'id';

  IF id_type IS DISTINCT FROM 'bigint'
     AND id_type IS DISTINCT FROM 'integer'
     AND id_type IS DISTINCT FROM 'smallint' THEN
    RAISE EXCEPTION
      'P1-02 blocked: unexpected dogs.id type %, expected bigint/int', id_type;
  END IF;
END $$;

-- Snapshot row count before destructive work
CREATE TEMP TABLE p1_02_rowcount AS
SELECT COUNT(*)::bigint AS n FROM public.dogs;

-- 1) Preserve original bigint IDs (MUST run before DROP COLUMN id)
ALTER TABLE public.dogs
  ADD COLUMN IF NOT EXISTS legacy_bigint_id bigint;

UPDATE public.dogs
SET legacy_bigint_id = id
WHERE legacy_bigint_id IS NULL;

-- 2) Generate UUID identity (database-generated; not hardcoded)
ALTER TABLE public.dogs
  ADD COLUMN IF NOT EXISTS id_uuid uuid;

UPDATE public.dogs
SET id_uuid = gen_random_uuid()
WHERE id_uuid IS NULL;

ALTER TABLE public.dogs
  ALTER COLUMN id_uuid SET DEFAULT gen_random_uuid();

-- ── Pre-destructive guards (A–E) ───────────────────────────────
DO $$
DECLARE
  before_n bigint;
  after_n bigint;
  null_legacy bigint;
  null_uuid bigint;
  dup_legacy bigint;
  dup_uuid bigint;
BEGIN
  SELECT n INTO before_n FROM p1_02_rowcount;
  SELECT COUNT(*) INTO after_n FROM public.dogs;

  IF after_n IS DISTINCT FROM before_n THEN
    RAISE EXCEPTION
      'P1-02 blocked: row count changed during UUID prep (before=%, after=%)',
      before_n, after_n;
  END IF;

  -- A: every dog has legacy_bigint_id
  SELECT COUNT(*) INTO null_legacy
  FROM public.dogs
  WHERE legacy_bigint_id IS NULL;

  IF null_legacy > 0 THEN
    RAISE EXCEPTION
      'P1-02 blocked: % dogs missing legacy_bigint_id', null_legacy;
  END IF;

  -- B: legacy_bigint_id unique
  SELECT COUNT(*) INTO dup_legacy
  FROM (
    SELECT legacy_bigint_id
    FROM public.dogs
    GROUP BY legacy_bigint_id
    HAVING COUNT(*) > 1
  ) d;

  IF dup_legacy > 0 THEN
    RAISE EXCEPTION
      'P1-02 blocked: duplicate legacy_bigint_id values exist';
  END IF;

  -- C: every dog has id_uuid
  SELECT COUNT(*) INTO null_uuid
  FROM public.dogs
  WHERE id_uuid IS NULL;

  IF null_uuid > 0 THEN
    RAISE EXCEPTION
      'P1-02 blocked: % dogs missing id_uuid', null_uuid;
  END IF;

  -- D: id_uuid unique
  SELECT COUNT(*) INTO dup_uuid
  FROM (
    SELECT id_uuid
    FROM public.dogs
    GROUP BY id_uuid
    HAVING COUNT(*) > 1
  ) d;

  IF dup_uuid > 0 THEN
    RAISE EXCEPTION
      'P1-02 blocked: duplicate id_uuid values exist';
  END IF;
END $$;

-- 3) Swap PK only after guards pass
ALTER TABLE public.dogs DROP CONSTRAINT IF EXISTS dogs_pkey;

ALTER TABLE public.dogs DROP COLUMN id;

ALTER TABLE public.dogs RENAME COLUMN id_uuid TO id;

ALTER TABLE public.dogs
  ALTER COLUMN id SET NOT NULL;

ALTER TABLE public.dogs
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE public.dogs ADD CONSTRAINT dogs_pkey PRIMARY KEY (id);

-- 4) Legacy lineage constraint (NOT the product identity / NOT PK)
ALTER TABLE public.dogs
  ALTER COLUMN legacy_bigint_id SET NOT NULL;

ALTER TABLE public.dogs
  DROP CONSTRAINT IF EXISTS dogs_legacy_bigint_id_key;

ALTER TABLE public.dogs
  ADD CONSTRAINT dogs_legacy_bigint_id_key UNIQUE (legacy_bigint_id);

-- Final continuity check
DO $$
DECLARE
  before_n bigint;
  after_n bigint;
BEGIN
  SELECT n INTO before_n FROM p1_02_rowcount;
  SELECT COUNT(*) INTO after_n FROM public.dogs;

  IF after_n IS DISTINCT FROM before_n THEN
    RAISE EXCEPTION
      'P1-02 blocked: row count changed after PK swap (before=%, after=%)',
      before_n, after_n;
  END IF;
END $$;

DROP TABLE p1_02_rowcount;

COMMIT;

-- ── Verification (run after apply) ─────────────────────────────
-- SELECT id, legacy_bigint_id, name, owner_user_id FROM public.dogs WHERE name = 'Ray';
-- Expect: 1 row; legacy_bigint_id = 1; id is uuid
--
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'dogs'
--   AND column_name IN ('id', 'legacy_bigint_id');
