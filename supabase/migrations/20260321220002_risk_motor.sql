DO $$ 
BEGIN

-- Tables Creation for Risk Motor
CREATE TABLE IF NOT EXISTS public.risk_methodologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.risk_methodology_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  methodology_id UUID NOT NULL REFERENCES public.risk_methodologies(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  model_type TEXT NOT NULL DEFAULT 'basic',
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.risk_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  process TEXT,
  owner_id UUID REFERENCES auth.users(id),
  source TEXT,
  status TEXT NOT NULL DEFAULT 'Identificado',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id UUID NOT NULL REFERENCES public.risk_register(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.risk_methodology_versions(id),
  inherent_prob INTEGER,
  inherent_impact INTEGER,
  inherent_score INTEGER,
  residual_prob INTEGER,
  residual_impact INTEGER,
  residual_score INTEGER,
  justification TEXT,
  status TEXT NOT NULL DEFAULT 'Em Avaliação',
  evaluated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.controls_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  control_type TEXT,
  nature TEXT,
  owner_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.risk_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id UUID NOT NULL REFERENCES public.risk_register(id) ON DELETE CASCADE,
  control_id UUID NOT NULL REFERENCES public.controls_library(id) ON DELETE CASCADE,
  design_effectiveness TEXT,
  operational_effectiveness TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.risk_treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id UUID NOT NULL REFERENCES public.risk_register(id) ON DELETE CASCADE,
  response_type TEXT NOT NULL,
  description TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'Planejado',
  effectiveness_indicator TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error creating tables: %', SQLERRM;
END $$;

-- Policies and RLS
DO $$ 
BEGIN
  -- Enable RLS
  ALTER TABLE public.risk_methodologies ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.risk_methodology_versions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.risk_register ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.controls_library ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.risk_controls ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.risk_treatments ENABLE ROW LEVEL SECURITY;
  
  -- Methodologies
  DROP POLICY IF EXISTS "auth_all_risk_meth" ON public.risk_methodologies;
  CREATE POLICY "auth_all_risk_meth" ON public.risk_methodologies FOR ALL TO authenticated USING (is_tenant_member_uuid(tenant_id));

  -- Versions
  DROP POLICY IF EXISTS "auth_all_risk_meth_ver" ON public.risk_methodology_versions;
  CREATE POLICY "auth_all_risk_meth_ver" ON public.risk_methodology_versions FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.risk_methodologies m WHERE m.id = risk_methodology_versions.methodology_id AND is_tenant_member_uuid(m.tenant_id))
  );

  -- Risk Register
  DROP POLICY IF EXISTS "auth_all_risk_reg" ON public.risk_register;
  CREATE POLICY "auth_all_risk_reg" ON public.risk_register FOR ALL TO authenticated USING (is_tenant_member_uuid(tenant_id));

  -- Risk Assessments
  DROP POLICY IF EXISTS "auth_all_risk_ass" ON public.risk_assessments;
  CREATE POLICY "auth_all_risk_ass" ON public.risk_assessments FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.risk_register r WHERE r.id = risk_assessments.risk_id AND is_tenant_member_uuid(r.tenant_id))
  );

  -- Controls Library
  DROP POLICY IF EXISTS "auth_all_ctrl_lib" ON public.controls_library;
  CREATE POLICY "auth_all_ctrl_lib" ON public.controls_library FOR ALL TO authenticated USING (is_tenant_member_uuid(tenant_id));

  -- Risk Controls
  DROP POLICY IF EXISTS "auth_all_risk_ctrl" ON public.risk_controls;
  CREATE POLICY "auth_all_risk_ctrl" ON public.risk_controls FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.risk_register r WHERE r.id = risk_controls.risk_id AND is_tenant_member_uuid(r.tenant_id))
  );

  -- Risk Treatments
  DROP POLICY IF EXISTS "auth_all_risk_treat" ON public.risk_treatments;
  CREATE POLICY "auth_all_risk_treat" ON public.risk_treatments FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.risk_register r WHERE r.id = risk_treatments.risk_id AND is_tenant_member_uuid(r.tenant_id))
  );

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error setting up RLS: %', SQLERRM;
END $$;
