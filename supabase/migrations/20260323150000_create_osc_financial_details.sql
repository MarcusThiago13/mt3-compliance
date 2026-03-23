CREATE TABLE IF NOT EXISTS public.osc_financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  category_code TEXT NOT NULL,
  provider_document TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  gross_value NUMERIC(15, 2) NOT NULL DEFAULT 0,
  paid_value NUMERIC(15, 2) NOT NULL DEFAULT 0,
  nexus_notes TEXT,
  status TEXT DEFAULT 'Pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.osc_accountability_diligences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  notification_date DATE NOT NULL,
  deadline DATE,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Aberta',
  response_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.osc_financial_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_osc_fin_trans" ON public.osc_financial_transactions;
CREATE POLICY "auth_all_osc_fin_trans" ON public.osc_financial_transactions 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

ALTER TABLE public.osc_accountability_diligences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_osc_acc_dil" ON public.osc_accountability_diligences;
CREATE POLICY "auth_all_osc_acc_dil" ON public.osc_accountability_diligences 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));
