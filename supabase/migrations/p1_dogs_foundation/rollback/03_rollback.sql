-- ROLLBACK for 03 — clear Ray owner (back to nullable unowned).

BEGIN;

UPDATE public.dogs
SET owner_user_id = NULL
WHERE name = 'Ray';

COMMIT;
