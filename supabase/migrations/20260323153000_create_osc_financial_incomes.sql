CREATE TABLE IF NOT EXISTS public.osc_financial_incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  income_date DATE NOT NULL,
  income_type TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.osc_financial_incomes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_osc_fin_inc" ON public.osc_financial_incomes;
CREATE POLICY "auth_all_osc_fin_inc" ON public.osc_financial_incomes 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));
