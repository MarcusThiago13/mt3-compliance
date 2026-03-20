-- Create invitations table for manual invite control
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending',
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraint to prevent duplicate active invitations for the same tenant
CREATE UNIQUE INDEX IF NOT EXISTS invitations_email_tenant_idx ON public.invitations (email, tenant_id);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "auth_all_invitations" ON public.invitations;
CREATE POLICY "auth_all_invitations" ON public.invitations 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed data for testing
DO $$
DECLARE
    default_tenant_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM public.tenants LIMIT 1;
    IF default_tenant_id IS NOT NULL THEN
        INSERT INTO public.invitations (email, name, tenant_id, status, phone)
        VALUES ('pendente@example.com', 'Usuário Pendente', default_tenant_id, 'pending', '5511999999999')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
