ALTER TABLE public.osc_partnerships 
ADD COLUMN IF NOT EXISTS instrument_number TEXT,
ADD COLUMN IF NOT EXISTS process_number TEXT,
ADD COLUMN IF NOT EXISTS object_description TEXT,
ADD COLUMN IF NOT EXISTS current_phase TEXT DEFAULT 'Planejamento',
ADD COLUMN IF NOT EXISTS general_status TEXT DEFAULT 'Regular';

CREATE TABLE IF NOT EXISTS public.osc_partnership_workplans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Em Elaboração',
  methodology TEXT,
  expected_results TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.osc_partnership_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workplan_id UUID NOT NULL REFERENCES public.osc_partnership_workplans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC(15, 2) DEFAULT 0,
  achieved_value NUMERIC(15, 2) DEFAULT 0,
  unit TEXT,
  verification_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.osc_partnership_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT DEFAULT 'Pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.osc_partnership_workplans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osc_partnership_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osc_partnership_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_workplans" ON public.osc_partnership_workplans;
CREATE POLICY "auth_all_workplans" ON public.osc_partnership_workplans 
FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

DROP POLICY IF EXISTS "auth_all_goals" ON public.osc_partnership_goals;
CREATE POLICY "auth_all_goals" ON public.osc_partnership_goals 
FOR ALL TO authenticated USING (EXISTS (
  SELECT 1 FROM public.osc_partnership_workplans w 
  JOIN public.osc_partnerships p ON p.id = w.partnership_id 
  WHERE w.id = workplan_id AND public.is_tenant_member_uuid(p.tenant_id)
));

DROP POLICY IF EXISTS "auth_all_milestones" ON public.osc_partnership_milestones;
CREATE POLICY "auth_all_milestones" ON public.osc_partnership_milestones 
FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));
