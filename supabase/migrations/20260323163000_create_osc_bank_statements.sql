CREATE TABLE IF NOT EXISTS public.osc_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  bank TEXT,
  agency TEXT,
  account_number TEXT,
  status TEXT DEFAULT 'Ativa',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.osc_bank_statement_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.osc_bank_accounts(id) ON DELETE SET NULL,
  transaction_date DATE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  transaction_type TEXT NOT NULL,
  classification TEXT,
  status TEXT DEFAULT 'Importada',
  category_code TEXT,
  provider_name TEXT,
  provider_document TEXT,
  invoice_number TEXT,
  invoice_date DATE,
  document_url TEXT,
  restitution_line_id UUID REFERENCES public.osc_bank_statement_lines(id) ON DELETE SET NULL,
  restitution_status TEXT,
  competence_month TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.osc_bank_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_osc_bank_accounts" ON public.osc_bank_accounts;
CREATE POLICY "auth_all_osc_bank_accounts" ON public.osc_bank_accounts 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

ALTER TABLE public.osc_bank_statement_lines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_osc_bank_statement_lines" ON public.osc_bank_statement_lines;
CREATE POLICY "auth_all_osc_bank_statement_lines" ON public.osc_bank_statement_lines 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));
