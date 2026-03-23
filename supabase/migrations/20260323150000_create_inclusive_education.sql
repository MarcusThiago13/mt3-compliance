CREATE TABLE IF NOT EXISTS public.osc_inclusive_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo',
  demands TEXT,
  barriers TEXT,
  potentialities TEXT,
  support_strategies TEXT,
  accessibility_resources TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.osc_inclusive_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.osc_inclusive_cases(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Em Elaboração',
  objectives TEXT,
  strategies TEXT,
  supports TEXT,
  responsibles TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.osc_inclusive_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osc_inclusive_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_osc_inc_cases" ON public.osc_inclusive_cases;
CREATE POLICY "auth_all_osc_inc_cases" ON public.osc_inclusive_cases FOR ALL TO authenticated USING (public.is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_all_osc_inc_plans" ON public.osc_inclusive_plans;
CREATE POLICY "auth_all_osc_inc_plans" ON public.osc_inclusive_plans FOR ALL TO authenticated USING (public.is_tenant_member_uuid(tenant_id));
