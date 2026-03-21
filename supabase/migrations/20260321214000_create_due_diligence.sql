DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dd_risk_level') THEN
        CREATE TYPE dd_risk_level AS ENUM ('Baixo', 'Médio', 'Alto');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dd_level_enum') THEN
        CREATE TYPE dd_level_enum AS ENUM ('SDD', 'CDD', 'EDD');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.due_diligence_processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL, 
    target_name TEXT NOT NULL,
    target_document TEXT, 
    risk_score INTEGER DEFAULT 0,
    risk_level TEXT,
    dd_level TEXT,
    status TEXT NOT NULL DEFAULT 'Em Análise', 
    analyst_id UUID REFERENCES auth.users(id),
    decision_date TIMESTAMPTZ,
    decision_justification TEXT,
    expiration_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.due_diligence_processes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_ddp" ON public.due_diligence_processes;
CREATE POLICY "auth_select_ddp" ON public.due_diligence_processes FOR SELECT TO authenticated USING (is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_insert_ddp" ON public.due_diligence_processes;
CREATE POLICY "auth_insert_ddp" ON public.due_diligence_processes FOR INSERT TO authenticated WITH CHECK (is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_update_ddp" ON public.due_diligence_processes;
CREATE POLICY "auth_update_ddp" ON public.due_diligence_processes FOR UPDATE TO authenticated USING (is_tenant_member_uuid(tenant_id));

CREATE TABLE IF NOT EXISTS public.dd_red_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID NOT NULL REFERENCES public.due_diligence_processes(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    mitigation_plan TEXT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.dd_red_flags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_select_ddrf" ON public.dd_red_flags;
CREATE POLICY "auth_select_ddrf" ON public.dd_red_flags FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_ddrf" ON public.dd_red_flags;
CREATE POLICY "auth_insert_ddrf" ON public.dd_red_flags FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_ddrf" ON public.dd_red_flags;
CREATE POLICY "auth_update_ddrf" ON public.dd_red_flags FOR UPDATE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.dd_conflict_declarations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES auth.users(id),
    employee_name TEXT,
    year INTEGER NOT NULL,
    has_conflict BOOLEAN DEFAULT false,
    details_json JSONB DEFAULT '{}'::jsonb,
    reviewer_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'Pendente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.dd_conflict_declarations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_select_ddcd" ON public.dd_conflict_declarations;
CREATE POLICY "auth_select_ddcd" ON public.dd_conflict_declarations FOR SELECT TO authenticated USING (is_tenant_member_uuid(tenant_id));
DROP POLICY IF EXISTS "auth_insert_ddcd" ON public.dd_conflict_declarations;
CREATE POLICY "auth_insert_ddcd" ON public.dd_conflict_declarations FOR INSERT TO authenticated WITH CHECK (is_tenant_member_uuid(tenant_id));
DROP POLICY IF EXISTS "auth_update_ddcd" ON public.dd_conflict_declarations;
CREATE POLICY "auth_update_ddcd" ON public.dd_conflict_declarations FOR UPDATE TO authenticated USING (is_tenant_member_uuid(tenant_id));

DO $$
DECLARE
    v_tenant_id UUID;
    v_process_1 UUID;
    v_process_2 UUID;
BEGIN
    SELECT id INTO v_tenant_id FROM public.tenants LIMIT 1;
    
    IF v_tenant_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM public.due_diligence_processes WHERE tenant_id = v_tenant_id AND target_name = 'Tech Solutions SA') THEN
            INSERT INTO public.due_diligence_processes (tenant_id, target_type, target_name, target_document, risk_score, risk_level, dd_level, status, expiration_date)
            VALUES (v_tenant_id, 'Fornecedor', 'Tech Solutions SA', '12.345.678/0001-90', 3, 'Baixo', 'SDD', 'Aprovado', CURRENT_DATE + INTERVAL '1 year')
            RETURNING id INTO v_process_1;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM public.due_diligence_processes WHERE tenant_id = v_tenant_id AND target_name = 'Global Logistics Ltd') THEN
            INSERT INTO public.due_diligence_processes (tenant_id, target_type, target_name, target_document, risk_score, risk_level, dd_level, status)
            VALUES (v_tenant_id, 'Parceiro', 'Global Logistics Ltd', '98.765.432/0001-10', 8, 'Médio', 'CDD', 'Em Análise')
            RETURNING id INTO v_process_2;
            
            INSERT INTO public.dd_red_flags (process_id, category, description)
            VALUES (v_process_2, 'Mídia Adversa', 'Notícia sobre possível envolvimento em cartel de fretes em 2019.');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM public.dd_conflict_declarations WHERE tenant_id = v_tenant_id AND employee_name = 'Ana Silva (Gerente de Compras)') THEN
            INSERT INTO public.dd_conflict_declarations (tenant_id, employee_name, year, has_conflict, status)
            VALUES (v_tenant_id, 'Ana Silva (Gerente de Compras)', 2024, false, 'Aprovado');
        END IF;

        IF NOT EXISTS (SELECT 1 FROM public.dd_conflict_declarations WHERE tenant_id = v_tenant_id AND employee_name = 'Carlos Gomes (Diretor Comercial)') THEN
            INSERT INTO public.dd_conflict_declarations (tenant_id, employee_name, year, has_conflict, status, details_json)
            VALUES (v_tenant_id, 'Carlos Gomes (Diretor Comercial)', 2024, true, 'Em Análise', '{"description": "Minha esposa é sócia minoritária de uma empresa de consultoria de marketing."}');
        END IF;
    END IF;
END $$;
