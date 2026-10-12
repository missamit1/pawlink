-- ROLLBACK for 07 — re-open NULLABILITY (does not delete data).

BEGIN;

ALTER TABLE public.telemetry ALTER COLUMN dog_id DROP NOT NULL;
ALTER TABLE public.alerts ALTER COLUMN dog_id DROP NOT NULL;
ALTER TABLE public.safe_zone ALTER COLUMN dog_id DROP NOT NULL;
ALTER TABLE public.dogs ALTER COLUMN owner_user_id DROP NOT NULL;

COMMIT;
