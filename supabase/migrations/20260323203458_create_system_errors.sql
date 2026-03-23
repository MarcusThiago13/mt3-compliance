CREATE TABLE IF NOT EXISTS public.system_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    context JSONB,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP POLICY IF EXISTS "auth_insert_errors" ON public.system_errors;
CREATE POLICY "auth_insert_errors" ON public.system_errors 
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_errors" ON public.system_errors;
CREATE POLICY "anon_insert_errors" ON public.system_errors 
  FOR INSERT TO anon WITH CHECK (true);

ALTER TABLE public.system_errors ENABLE ROW LEVEL SECURITY;
