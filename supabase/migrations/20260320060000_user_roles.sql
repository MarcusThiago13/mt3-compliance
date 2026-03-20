-- Add role and classification to user_tenants
ALTER TABLE public.user_tenants ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'viewer';
ALTER TABLE public.user_tenants ADD COLUMN IF NOT EXISTS classification TEXT;

-- Add role and classification to invitations
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'viewer';
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS classification TEXT;

-- Helper function to get user id by email (used by edge functions)
DROP FUNCTION IF EXISTS public.get_user_id_by_email(text);

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email text)
RETURNS uuid AS $$
DECLARE
    found_user_id uuid;
BEGIN
    SELECT id INTO found_user_id FROM auth.users WHERE email = user_email LIMIT 1;
    RETURN found_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to get users for a specific tenant securely
DROP FUNCTION IF EXISTS public.get_tenant_users(uuid);

CREATE OR REPLACE FUNCTION public.get_tenant_users(target_tenant_id uuid)
RETURNS TABLE (
    user_id uuid,
    email text,
    name text,
    role text,
    classification text,
    status text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.email::text,
        (u.raw_user_meta_data->>'name')::text as name,
        ut.role,
        ut.classification,
        CASE WHEN u.email_confirmed_at IS NOT NULL THEN 'Ativo' ELSE 'Pendente' END as status
    FROM auth.users u
    JOIN public.user_tenants ut ON u.id = ut.user_id
    WHERE ut.tenant_id = target_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to get all users across all tenants (for SuperAdmin view)
DROP FUNCTION IF EXISTS public.get_all_users();

CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
    user_id uuid,
    email text,
    name text,
    role text,
    classification text,
    status text,
    tenant_id uuid,
    tenant_name text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.email::text,
        (u.raw_user_meta_data->>'name')::text as name,
        ut.role,
        ut.classification,
        CASE WHEN u.email_confirmed_at IS NOT NULL THEN 'Ativo' ELSE 'Pendente' END as status,
        ut.tenant_id,
        t.name as tenant_name
    FROM auth.users u
    JOIN public.user_tenants ut ON u.id = ut.user_id
    JOIN public.tenants t ON t.id = ut.tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
