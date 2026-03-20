-- Create the junction table for user access to tenants
CREATE TABLE IF NOT EXISTS public.user_tenants (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, tenant_id)
);

-- Enable RLS on user_tenants
ALTER TABLE public.user_tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ut_select" ON public.user_tenants;
CREATE POLICY "ut_select" ON public.user_tenants 
    FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Ensure no empty state: Create a default tenant if none exists
DO $$
DECLARE
    default_tenant_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM public.tenants LIMIT 1;
    IF default_tenant_id IS NULL THEN
        INSERT INTO public.tenants (name, cnpj, status) 
        VALUES ('Acme Corp', '00.000.000/0001-00', 'active') 
        RETURNING id INTO default_tenant_id;
    END IF;
END $$;

-- Seed existing users to existing tenants so app doesn't break for existing data
INSERT INTO public.user_tenants (user_id, tenant_id)
SELECT u.id, t.id FROM auth.users u CROSS JOIN public.tenants t
ON CONFLICT DO NOTHING;

-- Assign all 'default' string records to the first valid tenant to preserve mock data
DO $$
DECLARE
    first_tenant_id UUID;
BEGIN
    SELECT id INTO first_tenant_id FROM public.tenants LIMIT 1;
    IF first_tenant_id IS NOT NULL THEN
        UPDATE public.gaps SET tenant_id = first_tenant_id::text WHERE tenant_id = 'default';
        UPDATE public.risks SET tenant_id = first_tenant_id::text WHERE tenant_id = 'default';
        UPDATE public.assessment_schedules SET tenant_id = first_tenant_id::text WHERE tenant_id = 'default';
        UPDATE public.audit_logs SET tenant_id = first_tenant_id::text WHERE tenant_id = 'default';
        UPDATE public.compliance_history SET tenant_id = first_tenant_id::text WHERE tenant_id = 'default';
        UPDATE public.evidence_metadata SET tenant_id = first_tenant_id::text WHERE tenant_id = 'default';
    END IF;
END $$;

-- Create Trigger to automatically add creator to user_tenants when a new tenant is created
CREATE OR REPLACE FUNCTION public.fn_add_tenant_creator()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_tenants (user_id, tenant_id) 
    VALUES (auth.uid(), NEW.id) 
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_add_tenant_creator ON public.tenants;
CREATE TRIGGER trg_add_tenant_creator
AFTER INSERT ON public.tenants
FOR EACH ROW EXECUTE FUNCTION public.fn_add_tenant_creator();

-- HELPER FUNCTION for RLS to check UUID relationships
CREATE OR REPLACE FUNCTION public.is_tenant_member_uuid(check_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_tenants ut
        WHERE ut.user_id = auth.uid() AND ut.tenant_id = check_tenant_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- HELPER FUNCTION for RLS to check TEXT relationships (existing mock schemas)
CREATE OR REPLACE FUNCTION public.is_tenant_member(check_tenant_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_tenants ut
        WHERE ut.user_id = auth.uid() AND ut.tenant_id::text = check_tenant_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- APPLY SECURE TENANT ISOLATION POLICIES

-- TENANTS TABLE
DROP POLICY IF EXISTS "auth_all_tenants" ON public.tenants;
DROP POLICY IF EXISTS "tenant_select" ON public.tenants;
DROP POLICY IF EXISTS "tenant_insert" ON public.tenants;
DROP POLICY IF EXISTS "tenant_update" ON public.tenants;
DROP POLICY IF EXISTS "tenant_delete" ON public.tenants;

CREATE POLICY "tenant_select" ON public.tenants FOR SELECT TO authenticated
USING (public.is_tenant_member_uuid(id));

CREATE POLICY "tenant_insert" ON public.tenants FOR INSERT TO authenticated
WITH CHECK (true); -- Trigger automatically adds creator

CREATE POLICY "tenant_update" ON public.tenants FOR UPDATE TO authenticated
USING (public.is_tenant_member_uuid(id));

CREATE POLICY "tenant_delete" ON public.tenants FOR DELETE TO authenticated
USING (public.is_tenant_member_uuid(id));

-- PROFILE REPORTS
DROP POLICY IF EXISTS "auth_all_reports" ON public.profile_reports;
CREATE POLICY "tenant_isolation_reports" ON public.profile_reports FOR ALL TO authenticated
USING (public.is_tenant_member_uuid(tenant_id))
WITH CHECK (public.is_tenant_member_uuid(tenant_id));

-- EVIDENCE METADATA
DROP POLICY IF EXISTS "auth_all_evidence" ON public.evidence_metadata;
CREATE POLICY "tenant_isolation_evidence" ON public.evidence_metadata FOR ALL TO authenticated
USING (public.is_tenant_member(tenant_id))
WITH CHECK (public.is_tenant_member(tenant_id));

-- ASSESSMENT SCHEDULES
DROP POLICY IF EXISTS "auth_all_assessment_schedules" ON public.assessment_schedules;
CREATE POLICY "tenant_isolation_assessments" ON public.assessment_schedules FOR ALL TO authenticated
USING (public.is_tenant_member(tenant_id))
WITH CHECK (public.is_tenant_member(tenant_id));

-- AUDIT LOGS
DROP POLICY IF EXISTS "auth_all_audit_logs" ON public.audit_logs;
CREATE POLICY "tenant_isolation_audit_logs" ON public.audit_logs FOR ALL TO authenticated
USING (public.is_tenant_member(tenant_id))
WITH CHECK (public.is_tenant_member(tenant_id));

-- COMPLIANCE HISTORY
DROP POLICY IF EXISTS "auth_all_compliance_history" ON public.compliance_history;
CREATE POLICY "tenant_isolation_history" ON public.compliance_history FOR ALL TO authenticated
USING (public.is_tenant_member(tenant_id))
WITH CHECK (public.is_tenant_member(tenant_id));

-- GAPS
DROP POLICY IF EXISTS "auth_all_gaps" ON public.gaps;
CREATE POLICY "tenant_isolation_gaps" ON public.gaps FOR ALL TO authenticated
USING (public.is_tenant_member(tenant_id))
WITH CHECK (public.is_tenant_member(tenant_id));

-- RISKS
DROP POLICY IF EXISTS "auth_all_risks" ON public.risks;
CREATE POLICY "tenant_isolation_risks" ON public.risks FOR ALL TO authenticated
USING (public.is_tenant_member(tenant_id))
WITH CHECK (public.is_tenant_member(tenant_id));
