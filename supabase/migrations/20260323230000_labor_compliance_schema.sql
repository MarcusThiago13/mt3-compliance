ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS labor_profile JSONB DEFAULT '{}'::jsonb;

