-- 1. Drop old function if it exists
DROP FUNCTION IF EXISTS public.check_report_credentials(text, text);

-- 2. Create updated function with tenant_id validation
CREATE OR REPLACE FUNCTION public.check_report_credentials(p_tenant_id uuid, p_protocol text, p_password text)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_report_id UUID;
BEGIN
    SELECT id INTO v_report_id
    FROM public.whistleblower_reports
    WHERE tenant_id = p_tenant_id 
      AND protocol_number = p_protocol 
      AND access_password_hash = crypt(p_password, access_password_hash)
    LIMIT 1;
    
    RETURN v_report_id;
END;
$$;

-- 3. Cleanup trigger for orphaned mock data when a tenant is deleted
CREATE OR REPLACE FUNCTION public.cleanup_tenant_mock_data()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.assessment_schedules WHERE tenant_id = OLD.id::text;
    DELETE FROM public.audit_logs WHERE tenant_id = OLD.id::text;
    DELETE FROM public.compliance_history WHERE tenant_id = OLD.id::text;
    DELETE FROM public.evidence_metadata WHERE tenant_id = OLD.id::text;
    DELETE FROM public.gaps WHERE tenant_id = OLD.id::text;
    DELETE FROM public.risks WHERE tenant_id = OLD.id::text;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_cleanup_tenant_mock_data ON public.tenants;
CREATE TRIGGER trg_cleanup_tenant_mock_data
AFTER DELETE ON public.tenants
FOR EACH ROW EXECUTE FUNCTION public.cleanup_tenant_mock_data();
