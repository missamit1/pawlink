-- P1 / 01 — Expand dogs columns (nullable). Preserve Ray row.
-- NO REMOTE APPLY until approved.
--
-- Goal:
--   Add ownership + product fields without touching dogs.id yet.
--   owner_user_id starts NULL (assigned later in step 03 with a real Auth UID).
--
-- Does NOT:
--   recreate dogs
--   change primary key
--   invent auth UUID / store UID in this file
--   set NOT NULL
--   assign Ray's owner yet

BEGIN;

-- Ownership (nullable until step 03 apply-time paste of real auth.users.id)
ALTER TABLE public.dogs
  ADD COLUMN IF NOT EXISTS owner_user_id uuid
    REFERENCES auth.users (id)
    ON DELETE CASCADE;

-- Approved product fields (nullable)
ALTER TABLE public.dogs
  ADD COLUMN IF NOT EXISTS sex text;

ALTER TABLE public.dogs
  ADD COLUMN IF NOT EXISTS avatar_url text;

ALTER TABLE public.dogs
  ADD COLUMN IF NOT EXISTS model_url text;

-- Keep existing age / weight (legacy columns). Do not drop in P1.

COMMIT;

-- ── Verification (run after apply) ─────────────────────────────
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'dogs'
-- ORDER BY ordinal_position;
--
-- SELECT id, name, owner_user_id, sex, avatar_url, model_url, age, weight
-- FROM public.dogs
-- WHERE name = 'Ray';
-- Expect: 1 row, owner_user_id IS NULL, id still bigint.
