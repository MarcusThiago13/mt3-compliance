CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    to_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent',
    external_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_templates" ON public.email_templates;
CREATE POLICY "auth_read_templates" ON public.email_templates
    FOR SELECT TO authenticated USING (tenant_id IS NULL OR is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_all_templates" ON public.email_templates;
CREATE POLICY "auth_all_templates" ON public.email_templates
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_logs" ON public.communication_logs;
CREATE POLICY "auth_read_logs" ON public.communication_logs
    FOR SELECT TO authenticated USING (tenant_id IS NULL OR is_tenant_member_uuid(tenant_id));

DO $$
DECLARE
    v_tenant_id UUID;
BEGIN
    -- Seed default templates globally
    IF NOT EXISTS (SELECT 1 FROM public.email_templates WHERE name = 'Boas-vindas e Acesso') THEN
        INSERT INTO public.email_templates (name, subject, body) VALUES
        ('Boas-vindas e Acesso', 'Bem-vindo ao mt3 Compliance', 'Olá,\n\nSeu ambiente no mt3 Compliance foi configurado com sucesso.\nPara acessar o sistema, utilize o link de convite recebido anteriormente ou acesse:\nhttps://mt3-compliance-576a5.goskip.app\n\nAtenciosamente,\nEquipe mt3'),
        ('Formalização de Auditoria', 'Notificação: Processo de Conformidade', 'Prezados,\n\nInformamos que novas requisições de evidências foram disponibilizadas no seu painel. Solicitamos que acompanhem as pendências através da plataforma mt3 Compliance.\n\nAtenciosamente,\nEquipe de Compliance'),
        ('Notificação de Prazo', 'Aviso de Prazo Próximo - mt3 Compliance', 'Olá,\n\nNotamos que existem tarefas ou formulários em seu painel com prazo próximo ao vencimento. Por favor, acesse o sistema para regularizar a situação.\n\nAtenciosamente,\nEquipe mt3');
    END IF;

    -- Seed mock communication logs for the first tenant if exists
    SELECT id INTO v_tenant_id FROM public.tenants LIMIT 1;
    IF v_tenant_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.communication_logs WHERE tenant_id = v_tenant_id) THEN
        INSERT INTO public.communication_logs (tenant_id, to_email, subject, body, status)
        VALUES 
        (v_tenant_id, 'diretoria@cliente.com', 'Bem-vindo ao mt3 Compliance', 'Olá,\n\nSeu ambiente no mt3 Compliance foi configurado.', 'opened'),
        (v_tenant_id, 'compliance@cliente.com', 'Aviso de Prazo Próximo', 'Olá,\n\nNotamos que existem tarefas com prazo próximo.', 'delivered');
    END IF;
END $$;
