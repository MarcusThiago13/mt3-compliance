-- Migration for Fase 2 - Operação e Monitoramento

CREATE TABLE IF NOT EXISTS public.osc_inclusive_daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.osc_inclusive_students(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.osc_inclusive_schools(id) ON DELETE SET NULL,
    professional_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    professional_name TEXT NOT NULL,
    log_date DATE NOT NULL,
    activity_type TEXT NOT NULL,
    presence BOOLEAN DEFAULT true,
    description TEXT NOT NULL,
    strategies_used TEXT,
    observations TEXT,
    needs_referral BOOLEAN DEFAULT false,
    paee_adherence BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.osc_inclusive_technical_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.osc_inclusive_students(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.osc_inclusive_schools(id) ON DELETE SET NULL,
    professional_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    professional_name TEXT NOT NULL,
    professional_role TEXT NOT NULL,
    log_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    intervention_type TEXT NOT NULL,
    description TEXT,
    orientations TEXT,
    referrals TEXT,
    is_secret BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.osc_inclusive_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osc_inclusive_technical_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_osc_inc_daily" ON public.osc_inclusive_daily_logs;
CREATE POLICY "auth_all_osc_inc_daily" ON public.osc_inclusive_daily_logs
    FOR ALL TO authenticated USING (is_tenant_member_uuid(tenant_id)) WITH CHECK (is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_all_osc_inc_technical" ON public.osc_inclusive_technical_logs;
CREATE POLICY "auth_all_osc_inc_technical" ON public.osc_inclusive_technical_logs
    FOR ALL TO authenticated USING (is_tenant_member_uuid(tenant_id)) WITH CHECK (is_tenant_member_uuid(tenant_id));
