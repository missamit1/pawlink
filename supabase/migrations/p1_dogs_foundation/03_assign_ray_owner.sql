-- P1 / 03 — Assign Ray → real Auth owner (apply-time paste only).
-- NO REMOTE APPLY until approved + Auth user exists.
--
-- PREREQUISITE:
--   Create a real user in Supabase Auth (Dashboard).
--   Copy that user's UUID.
--   Paste it ONLY at apply time into owner_id below (keep repo file empty).
--
-- Does NOT:
--   invent / commit an Auth UUID
--   set NOT NULL yet
--   touch telemetry / alerts

BEGIN;

DO $$
DECLARE
  -- APPLY-TIME ONLY: paste real auth.users.id inside the quotes.
  -- Leave empty in the committed repo so blind apply fails safely.
  owner_id uuid := NULLIF(trim(''), '')::uuid;
  ray_count integer;
  updated_count integer;
BEGIN
  IF owner_id IS NULL THEN
    RAISE EXCEPTION
      'P1-03 blocked: paste a real auth.users.id into owner_id before running';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = owner_id) THEN
    RAISE EXCEPTION
      'P1-03 blocked: auth.users has no row for %', owner_id;
  END IF;

  SELECT COUNT(*) INTO ray_count
  FROM public.dogs
  WHERE name = 'Ray';

  IF ray_count <> 1 THEN
    RAISE EXCEPTION
      'P1-03 blocked: expected exactly 1 dog named Ray, found %', ray_count;
  END IF;

  UPDATE public.dogs
  SET owner_user_id = owner_id
  WHERE name = 'Ray'
    AND (owner_user_id IS NULL OR owner_user_id IS DISTINCT FROM owner_id);

  GET DIAGNOSTICS updated_count = ROW_COUNT;

  RAISE NOTICE 'P1-03: Ray owner assigned (rows touched: %)', updated_count;
END $$;

COMMIT;

-- ── Verification (run after apply) ─────────────────────────────
-- SELECT d.id, d.name, d.owner_user_id, u.id AS auth_id
-- FROM public.dogs d
-- JOIN auth.users u ON u.id = d.owner_user_id
-- WHERE d.name = 'Ray';
-- Expect: 1 joined row.
