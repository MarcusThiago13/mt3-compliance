-- Drop and recreate get_all_users to include last_sign_in_at
DROP FUNCTION IF EXISTS public.get_all_users();
CREATE OR REPLACE FUNCTION public.get_all_users()
 RETURNS TABLE(
   user_id uuid, 
   email text, 
   name text, 
   role text, 
   classification text, 
   status text, 
   tenant_id uuid, 
   tenant_name text, 
   contact_phone text, 
   last_sign_in_at timestamptz
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_email TEXT;
    v_role TEXT;
    v_is_admin BOOLEAN;
BEGIN
    SELECT auth.users.email, auth.users.raw_app_meta_data->>'role', (auth.users.raw_user_meta_data->>'is_admin')::boolean
    INTO v_email, v_role, v_is_admin
    FROM auth.users WHERE auth.users.id = auth.uid();

    -- Superadmin verification
    IF NOT (v_email IN ('admin@example.com', 'marcusthiago.adv@gmail.com') OR v_role = 'admin' OR v_is_admin = TRUE) THEN
        RAISE EXCEPTION 'Acesso negado. Apenas administradores globais podem consultar a matriz completa de usuários.';
    END IF;

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
        ut.contact_phone,
        u.last_sign_in_at
    FROM auth.users u
    JOIN public.user_tenants ut ON u.id = ut.user_id
    JOIN public.tenants t ON t.id = ut.tenant_id;
END;
$function$;

-- Drop and recreate get_tenant_users to include last_sign_in_at
DROP FUNCTION IF EXISTS public.get_tenant_users(uuid);
CREATE OR REPLACE FUNCTION public.get_tenant_users(target_tenant_id uuid)
 RETURNS TABLE(
   user_id uuid, 
   email text, 
   name text, 
   role text, 
   classification text, 
   status text, 
   contact_phone text, 
   last_sign_in_at timestamptz
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Implicit security check: only members of the tenant or admins can query this
    IF NOT public.is_tenant_member_uuid(target_tenant_id) THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.email::text,
        (u.raw_user_meta_data->>'name')::text as name,
        ut.role,
        ut.classification,
        CASE WHEN u.email_confirmed_at IS NOT NULL THEN 'Ativo' ELSE 'Pendente' END as status,
        ut.contact_phone,
        u.last_sign_in_at
    FROM auth.users u
    JOIN public.user_tenants ut ON u.id = ut.user_id
    WHERE ut.tenant_id = target_tenant_id;
END;
$function$;
