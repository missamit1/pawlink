-- ROLLBACK for 01 — remove added dogs columns (only if still unused).
-- Keeps Ray row. Does not restore anything else.

BEGIN;

ALTER TABLE public.dogs DROP COLUMN IF EXISTS model_url;
ALTER TABLE public.dogs DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE public.dogs DROP COLUMN IF EXISTS sex;
ALTER TABLE public.dogs DROP COLUMN IF EXISTS owner_user_id;

COMMIT;
