CREATE TABLE IF NOT EXISTS public.osc_partnership_network (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  cnpj TEXT,
  instrument_type TEXT,
  responsibilities TEXT,
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.osc_partnership_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id UUID NOT NULL REFERENCES public.osc_partnerships(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  acquisition_value NUMERIC(15, 2),
  acquisition_date DATE,
  destination TEXT,
  status TEXT DEFAULT 'Em Uso',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.osc_institutional_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  date_occurred DATE,
  status TEXT DEFAULT 'Vigente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.osc_partnership_network ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_osc_network" ON public.osc_partnership_network;
CREATE POLICY "auth_all_osc_network" ON public.osc_partnership_network 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

ALTER TABLE public.osc_partnership_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_osc_assets" ON public.osc_partnership_assets;
CREATE POLICY "auth_all_osc_assets" ON public.osc_partnership_assets 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

ALTER TABLE public.osc_institutional_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_osc_inst_hist" ON public.osc_institutional_history;
CREATE POLICY "auth_all_osc_inst_hist" ON public.osc_institutional_history 
  FOR ALL TO authenticated 
  USING (public.is_tenant_member_uuid(tenant_id));
