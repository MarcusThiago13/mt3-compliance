ALTER TABLE public.digital_ropa ADD COLUMN IF NOT EXISTS next_review_date DATE;

ALTER TABLE public.due_diligence_processes ADD COLUMN IF NOT EXISTS block_payments BOOLEAN DEFAULT false;
ALTER TABLE public.due_diligence_processes ADD COLUMN IF NOT EXISTS last_incident_date DATE;

CREATE TABLE IF NOT EXISTS public.privacy_health_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  report_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'Gerado',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.privacy_health_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_health_reports" ON public.privacy_health_reports;
CREATE POLICY "auth_health_reports" ON public.privacy_health_reports FOR ALL TO authenticated USING (is_tenant_member_uuid(tenant_id)) WITH CHECK (is_tenant_member_uuid(tenant_id));
