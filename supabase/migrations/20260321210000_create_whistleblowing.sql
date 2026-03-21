CREATE TABLE IF NOT EXISTS public.whistleblower_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    protocol_number VARCHAR(50) NOT NULL UNIQUE,
    access_password_hash VARCHAR(255) NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT true,
    reporter_name TEXT,
    reporter_email TEXT,
    reporter_phone TEXT,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    involved_persons TEXT,
    incident_date_start DATE,
    incident_date_end DATE,
    incident_location VARCHAR(255),
    status TEXT NOT NULL DEFAULT 'nova',
    severity TEXT,
    admissibility_decision TEXT,
    admissibility_justification TEXT,
    admissibility_decided_by UUID REFERENCES auth.users(id),
    admissibility_decided_at TIMESTAMPTZ,
    assigned_investigator_id UUID REFERENCES auth.users(id),
    conclusion TEXT,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.whistleblower_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_reports" ON public.whistleblower_reports;
CREATE POLICY "anon_insert_reports" ON public.whistleblower_reports FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_reports" ON public.whistleblower_reports;
CREATE POLICY "auth_select_reports" ON public.whistleblower_reports FOR SELECT TO authenticated USING (is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_update_reports" ON public.whistleblower_reports;
CREATE POLICY "auth_update_reports" ON public.whistleblower_reports FOR UPDATE TO authenticated USING (is_tenant_member_uuid(tenant_id));


CREATE TABLE IF NOT EXISTS public.report_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.whistleblower_reports(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.report_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_messages" ON public.report_messages;
CREATE POLICY "anon_insert_messages" ON public.report_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_messages" ON public.report_messages;
CREATE POLICY "anon_select_messages" ON public.report_messages FOR SELECT TO anon, authenticated USING (true);


CREATE OR REPLACE FUNCTION public.check_report_credentials(p_protocol text, p_password text)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_report_id UUID;
BEGIN
    SELECT id INTO v_report_id
    FROM public.whistleblower_reports
    WHERE protocol_number = p_protocol AND access_password_hash = p_password
    LIMIT 1;
    RETURN v_report_id;
END;
$$;

DROP POLICY IF EXISTS "anon_read_tenants" ON public.tenants;
CREATE POLICY "anon_read_tenants" ON public.tenants FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_insert_storage" ON storage.objects;
CREATE POLICY "anon_insert_storage" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'tenant_documents');

DROP POLICY IF EXISTS "anon_select_storage" ON storage.objects;
CREATE POLICY "anon_select_storage" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'tenant_documents');
