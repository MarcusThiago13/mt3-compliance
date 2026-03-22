-- =================================================================================
-- AUDIT & SECURITY FIXES: RLS Policies and SuperAdmin Delegation
-- =================================================================================

-- 1. Enhance is_tenant_member_uuid to automatically allow superadmins
CREATE OR REPLACE FUNCTION public.is_tenant_member_uuid(check_tenant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_email TEXT;
BEGIN
    SELECT email INTO v_email FROM auth.users WHERE id = auth.uid();
    
    -- Superadmin bypass to prevent global dashboard crashes
    IF v_email = 'admin@example.com' THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.user_tenants ut
        WHERE ut.user_id = auth.uid() AND ut.tenant_id = check_tenant_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Enhance is_tenant_member (for TEXT tenant_ids) similarly
CREATE OR REPLACE FUNCTION public.is_tenant_member(check_tenant_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_email TEXT;
BEGIN
    SELECT email INTO v_email FROM auth.users WHERE id = auth.uid();
    
    -- Superadmin bypass to prevent global dashboard crashes
    IF v_email = 'admin@example.com' THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.user_tenants ut
        WHERE ut.user_id = auth.uid() AND ut.tenant_id::text = check_tenant_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Add missing INSERT policy for communication_logs (fixes silent failures on WhatsApp logging)
DROP POLICY IF EXISTS "auth_insert_logs" ON public.communication_logs;
CREATE POLICY "auth_insert_logs" ON public.communication_logs 
    FOR INSERT TO authenticated 
    WITH CHECK (tenant_id IS NULL OR public.is_tenant_member_uuid(tenant_id));

-- 4. Add missing UPDATE policy for communication_logs
DROP POLICY IF EXISTS "auth_update_logs" ON public.communication_logs;
CREATE POLICY "auth_update_logs" ON public.communication_logs 
    FOR UPDATE TO authenticated 
    USING (tenant_id IS NULL OR public.is_tenant_member_uuid(tenant_id));

-- 5. Ensure profile_reports has strict INSERT policies
DROP POLICY IF EXISTS "auth_insert_reports_prof" ON public.profile_reports;
CREATE POLICY "auth_insert_reports_prof" ON public.profile_reports 
    FOR INSERT TO authenticated 
    WITH CHECK (tenant_id IS NULL OR public.is_tenant_member_uuid(tenant_id));
