ALTER TABLE public.communication_logs ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'email';
ALTER TABLE public.communication_logs ADD COLUMN IF NOT EXISTS to_phone TEXT;
ALTER TABLE public.communication_logs ALTER COLUMN to_email DROP NOT NULL;
