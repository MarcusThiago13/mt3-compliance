DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS public.osc_partnership_workplans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
    object_description TEXT,
    methodology TEXT,
    status TEXT DEFAULT 'Em Elaboração',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.osc_partnership_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workplan_id UUID NOT NULL REFERENCES public.osc_partnership_workplans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_value NUMERIC(10,2) DEFAULT 0,
    unit TEXT,
    achieved_value NUMERIC(10,2) DEFAULT 0,
    status TEXT DEFAULT 'Pendente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS public.osc_partnership_occurrences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT DEFAULT 'Baixa',
    status TEXT DEFAULT 'Registrada',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
END $$;

ALTER TABLE public.osc_partnership_workplans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osc_partnership_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osc_partnership_occurrences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_osc_workplans" ON public.osc_partnership_workplans;
CREATE POLICY "auth_all_osc_workplans" ON public.osc_partnership_workplans
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

DROP POLICY IF EXISTS "auth_all_osc_goals" ON public.osc_partnership_goals;
CREATE POLICY "auth_all_osc_goals" ON public.osc_partnership_goals
  FOR ALL TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.osc_partnership_workplans w 
    JOIN public.osc_partnerships p ON p.id = w.partnership_id 
    WHERE w.id = workplan_id AND public.is_tenant_member_uuid(p.tenant_id)
  ));

DROP POLICY IF EXISTS "auth_all_osc_occurrences" ON public.osc_partnership_occurrences;
CREATE POLICY "auth_all_osc_occurrences" ON public.osc_partnership_occurrences
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));
