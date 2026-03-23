CREATE TABLE IF NOT EXISTS public.osc_partnership_accountability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  period_start DATE,
  period_end DATE,
  report_type TEXT NOT NULL DEFAULT 'Final',
  status TEXT NOT NULL DEFAULT 'Em Elaboração',
  deadline DATE,
  submission_date DATE,
  diligence_notes TEXT,
  final_decision TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.osc_partnership_accountability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_osc_acc" ON public.osc_partnership_accountability;
CREATE POLICY "auth_all_osc_acc" ON public.osc_partnership_accountability FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));
