-- ROLLBACK for 08 — disable RLS + drop ownership policies.

BEGIN;

DROP POLICY IF EXISTS dogs_select_own ON public.dogs;
DROP POLICY IF EXISTS dogs_insert_own ON public.dogs;
DROP POLICY IF EXISTS dogs_update_own ON public.dogs;
DROP POLICY IF EXISTS dogs_delete_own ON public.dogs;
ALTER TABLE public.dogs DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS telemetry_select_own_dog ON public.telemetry;
DROP POLICY IF EXISTS telemetry_insert_own_dog ON public.telemetry;
DROP POLICY IF EXISTS telemetry_update_own_dog ON public.telemetry;
DROP POLICY IF EXISTS telemetry_delete_own_dog ON public.telemetry;
ALTER TABLE public.telemetry DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS alerts_select_own_dog ON public.alerts;
DROP POLICY IF EXISTS alerts_insert_own_dog ON public.alerts;
DROP POLICY IF EXISTS alerts_update_own_dog ON public.alerts;
DROP POLICY IF EXISTS alerts_delete_own_dog ON public.alerts;
ALTER TABLE public.alerts DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS safe_zone_select_own_dog ON public.safe_zone;
DROP POLICY IF EXISTS safe_zone_insert_own_dog ON public.safe_zone;
DROP POLICY IF EXISTS safe_zone_update_own_dog ON public.safe_zone;
DROP POLICY IF EXISTS safe_zone_delete_own_dog ON public.safe_zone;
ALTER TABLE public.safe_zone DISABLE ROW LEVEL SECURITY;

COMMIT;
