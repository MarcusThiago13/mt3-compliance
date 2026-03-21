CREATE TABLE IF NOT EXISTS public.evidence_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  clause_id TEXT,
  action_id TEXT,
  task_title TEXT NOT NULL,
  task_description TEXT,
  deadline TIMESTAMPTZ,
  assignee_id UUID REFERENCES auth.users(id),
  assignee_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  file_url TEXT,
  file_name TEXT,
  submitter_comments TEXT,
  reviewer_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.evidence_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "evidence_requests_select" ON public.evidence_requests;
CREATE POLICY "evidence_requests_select" ON public.evidence_requests
  FOR SELECT TO authenticated
  USING (
    assignee_email = auth.jwt()->>'email' OR 
    is_tenant_member_uuid(tenant_id)
  );

DROP POLICY IF EXISTS "evidence_requests_insert" ON public.evidence_requests;
CREATE POLICY "evidence_requests_insert" ON public.evidence_requests
  FOR INSERT TO authenticated
  WITH CHECK (is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "evidence_requests_update" ON public.evidence_requests;
CREATE POLICY "evidence_requests_update" ON public.evidence_requests
  FOR UPDATE TO authenticated
  USING (
    assignee_email = auth.jwt()->>'email' OR 
    is_tenant_member_uuid(tenant_id)
  );
