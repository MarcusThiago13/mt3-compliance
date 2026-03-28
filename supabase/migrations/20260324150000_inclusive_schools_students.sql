CREATE TABLE IF NOT EXISTS public.osc_inclusive_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  internal_code TEXT,
  school_network TEXT,
  city TEXT,
  address TEXT,
  school_type TEXT,
  local_manager TEXT,
  status TEXT NOT NULL DEFAULT 'Ativa',
  observations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.osc_inclusive_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.osc_inclusive_schools(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  birth_date DATE,
  class_grade TEXT,
  legal_guardians TEXT,
  contacts TEXT,
  operational_data TEXT,
  observations TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add linking columns to cases without losing data or failing if already present
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='osc_inclusive_cases' AND column_name='student_id') THEN
        ALTER TABLE public.osc_inclusive_cases ADD COLUMN student_id UUID REFERENCES public.osc_inclusive_students(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='osc_inclusive_cases' AND column_name='school_id') THEN
        ALTER TABLE public.osc_inclusive_cases ADD COLUMN school_id UUID REFERENCES public.osc_inclusive_schools(id) ON DELETE SET NULL;
    END IF;
END $$;

ALTER TABLE public.osc_inclusive_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osc_inclusive_students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_osc_inc_schools" ON public.osc_inclusive_schools;
CREATE POLICY "auth_all_osc_inc_schools" ON public.osc_inclusive_schools FOR ALL TO authenticated USING (public.is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_all_osc_inc_students" ON public.osc_inclusive_students;
CREATE POLICY "auth_all_osc_inc_students" ON public.osc_inclusive_students FOR ALL TO authenticated USING (public.is_tenant_member_uuid(tenant_id));
