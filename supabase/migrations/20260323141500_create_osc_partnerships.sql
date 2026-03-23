CREATE TABLE IF NOT EXISTS public.osc_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  public_entity TEXT NOT NULL,
  instrument_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Planejamento',
  value NUMERIC(15, 2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.osc_partnership_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  notice_number TEXT,
  publication_date DATE,
  submission_deadline DATE,
  status TEXT NOT NULL DEFAULT 'Aberto',
  result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.osc_partnership_execution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  physical_progress NUMERIC(5, 2) DEFAULT 0,
  financial_progress NUMERIC(5, 2) DEFAULT 0,
  last_update TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.osc_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osc_partnership_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osc_partnership_execution ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_osc_partnerships" ON public.osc_partnerships;
CREATE POLICY "auth_all_osc_partnerships" ON public.osc_partnerships FOR ALL TO authenticated USING (public.is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_all_osc_calls" ON public.osc_partnership_calls;
CREATE POLICY "auth_all_osc_calls" ON public.osc_partnership_calls FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

DROP POLICY IF EXISTS "auth_all_osc_exec" ON public.osc_partnership_execution;
CREATE POLICY "auth_all_osc_exec" ON public.osc_partnership_execution FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));
