-- Add contact_phone to user_tenants to store WhatsApp/Phone numbers securely per tenant
ALTER TABLE public.user_tenants ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Recreate function get_tenant_users to return contact_phone
DROP FUNCTION IF EXISTS public.get_tenant_users(uuid);
CREATE OR REPLACE FUNCTION public.get_tenant_users(target_tenant_id uuid)
RETURNS TABLE (
    user_id uuid,
    email text,
    name text,
    role text,
    classification text,
    status text,
    contact_phone text
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
        ut.contact_phone
    FROM auth.users u
    JOIN public.user_tenants ut ON u.id = ut.user_id
    WHERE ut.tenant_id = target_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate function get_all_users to return contact_phone
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
    tenant_name text,
    contact_phone text
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
        t.name as tenant_name,
        ut.contact_phone
    FROM auth.users u
    JOIN public.user_tenants ut ON u.id = ut.user_id
    JOIN public.tenants t ON t.id = ut.tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
