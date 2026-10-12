-- P1 / 08 — RLS policies (ownership via dogs.owner_user_id).
-- NO REMOTE APPLY until approved.
--
-- WARNING — DEMO CONTINUITY:
--   Frontend today uses the publishable key with NO auth session.
--   Enabling RLS with these policies will hide rows from anon clients
--   (auth.uid() IS NULL → no access).
--
--   Apply this ONLY when you accept that:
--     - server continues with secret key (bypasses RLS), AND/OR
--     - Auth session exists for Dashboard reads, AND/OR
--     - you add a temporary explicit dev policy (not included here).
--
-- Policies: a user may access a row only when the related dog's
-- owner_user_id = auth.uid().

BEGIN;

-- ── dogs ───────────────────────────────────────────────────────
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dogs_select_own ON public.dogs;
DROP POLICY IF EXISTS dogs_insert_own ON public.dogs;
DROP POLICY IF EXISTS dogs_update_own ON public.dogs;
DROP POLICY IF EXISTS dogs_delete_own ON public.dogs;

CREATE POLICY dogs_select_own ON public.dogs
  FOR SELECT
  TO authenticated
  USING (owner_user_id = auth.uid());

CREATE POLICY dogs_insert_own ON public.dogs
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY dogs_update_own ON public.dogs
  FOR UPDATE
  TO authenticated
  USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY dogs_delete_own ON public.dogs
  FOR DELETE
  TO authenticated
  USING (owner_user_id = auth.uid());

-- ── telemetry ──────────────────────────────────────────────────
ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS telemetry_select_own_dog ON public.telemetry;
DROP POLICY IF EXISTS telemetry_insert_own_dog ON public.telemetry;
DROP POLICY IF EXISTS telemetry_update_own_dog ON public.telemetry;
DROP POLICY IF EXISTS telemetry_delete_own_dog ON public.telemetry;

CREATE POLICY telemetry_select_own_dog ON public.telemetry
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = telemetry.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

CREATE POLICY telemetry_insert_own_dog ON public.telemetry
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = telemetry.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

CREATE POLICY telemetry_update_own_dog ON public.telemetry
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = telemetry.dog_id
        AND d.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = telemetry.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

CREATE POLICY telemetry_delete_own_dog ON public.telemetry
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = telemetry.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

-- ── alerts ─────────────────────────────────────────────────────
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS alerts_select_own_dog ON public.alerts;
DROP POLICY IF EXISTS alerts_insert_own_dog ON public.alerts;
DROP POLICY IF EXISTS alerts_update_own_dog ON public.alerts;
DROP POLICY IF EXISTS alerts_delete_own_dog ON public.alerts;

CREATE POLICY alerts_select_own_dog ON public.alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = alerts.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

CREATE POLICY alerts_insert_own_dog ON public.alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = alerts.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

CREATE POLICY alerts_update_own_dog ON public.alerts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = alerts.dog_id
        AND d.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = alerts.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

CREATE POLICY alerts_delete_own_dog ON public.alerts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = alerts.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

-- ── safe_zone ──────────────────────────────────────────────────
ALTER TABLE public.safe_zone ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS safe_zone_select_own_dog ON public.safe_zone;
DROP POLICY IF EXISTS safe_zone_insert_own_dog ON public.safe_zone;
DROP POLICY IF EXISTS safe_zone_update_own_dog ON public.safe_zone;
DROP POLICY IF EXISTS safe_zone_delete_own_dog ON public.safe_zone;

CREATE POLICY safe_zone_select_own_dog ON public.safe_zone
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = safe_zone.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

CREATE POLICY safe_zone_insert_own_dog ON public.safe_zone
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = safe_zone.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

CREATE POLICY safe_zone_update_own_dog ON public.safe_zone
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = safe_zone.dog_id
        AND d.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = safe_zone.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

CREATE POLICY safe_zone_delete_own_dog ON public.safe_zone
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.dogs d
      WHERE d.id = safe_zone.dog_id
        AND d.owner_user_id = auth.uid()
    )
  );

COMMIT;

-- Note: service_role / sb_secret bypasses RLS (server path).
-- anon / publishable without session: no access under these policies.
