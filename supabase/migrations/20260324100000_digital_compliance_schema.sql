-- Adicionar coluna de perfil digital na tabela tenants
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS digital_profile JSONB DEFAULT '{}'::jsonb;

-- Criar tabela de Inventário de Dados (RoPA)
CREATE TABLE IF NOT EXISTS public.digital_ropa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  process_name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  data_categories TEXT,
  data_subjects TEXT,
  legal_basis TEXT,
  retention_time TEXT,
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criar tabela de Incidentes de Segurança e Privacidade
CREATE TABLE IF NOT EXISTS public.digital_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  incident_date DATE,
  severity TEXT,
  status TEXT DEFAULT 'Aberto',
  description TEXT,
  affected_data TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criar tabela de Requisições de Titulares
CREATE TABLE IF NOT EXISTS public.digital_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  request_type TEXT NOT NULL,
  status TEXT DEFAULT 'Pendente',
  deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.digital_ropa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_requests ENABLE ROW LEVEL SECURITY;

-- Aplicar Políticas de Isolamento (Tenants)
DROP POLICY IF EXISTS "auth_ropa_all" ON public.digital_ropa;
CREATE POLICY "auth_ropa_all" ON public.digital_ropa FOR ALL TO authenticated USING (is_tenant_member_uuid(tenant_id)) WITH CHECK (is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_incidents_all" ON public.digital_incidents;
CREATE POLICY "auth_incidents_all" ON public.digital_incidents FOR ALL TO authenticated USING (is_tenant_member_uuid(tenant_id)) WITH CHECK (is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_requests_all" ON public.digital_requests;
CREATE POLICY "auth_requests_all" ON public.digital_requests FOR ALL TO authenticated USING (is_tenant_member_uuid(tenant_id)) WITH CHECK (is_tenant_member_uuid(tenant_id));
