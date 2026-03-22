-- Migration for the new Document & Report Engine (Module)

CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    base_structure TEXT NOT NULL,
    ai_instructions TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.compliance_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    content TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    audience TEXT,
    confidentiality TEXT,
    period_ref TEXT,
    created_by UUID DEFAULT auth.uid() REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.compliance_documents(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    content TEXT NOT NULL,
    change_reason TEXT,
    created_by UUID DEFAULT auth.uid() REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- Policies for document_templates (read all if global or tenant_id matches)
DROP POLICY IF EXISTS "auth_read_templates_doc" ON public.document_templates;
CREATE POLICY "auth_read_templates_doc" ON public.document_templates FOR SELECT TO authenticated
USING (tenant_id IS NULL OR public.is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_insert_templates_doc" ON public.document_templates;
CREATE POLICY "auth_insert_templates_doc" ON public.document_templates FOR INSERT TO authenticated
WITH CHECK (tenant_id IS NOT NULL AND public.is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "auth_update_templates_doc" ON public.document_templates;
CREATE POLICY "auth_update_templates_doc" ON public.document_templates FOR UPDATE TO authenticated
USING (tenant_id IS NOT NULL AND public.is_tenant_member_uuid(tenant_id));

-- Policies for compliance_documents
DROP POLICY IF EXISTS "tenant_docs_all" ON public.compliance_documents;
CREATE POLICY "tenant_docs_all" ON public.compliance_documents FOR ALL TO authenticated
USING (public.is_tenant_member_uuid(tenant_id))
WITH CHECK (public.is_tenant_member_uuid(tenant_id));

-- Policies for document_versions
DROP POLICY IF EXISTS "tenant_doc_versions_all" ON public.document_versions;
CREATE POLICY "tenant_doc_versions_all" ON public.document_versions FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.compliance_documents d WHERE d.id = document_id AND public.is_tenant_member_uuid(d.tenant_id)))
WITH CHECK (EXISTS (SELECT 1 FROM public.compliance_documents d WHERE d.id = document_id AND public.is_tenant_member_uuid(d.tenant_id)));

-- Seed global templates (Família A e B)
INSERT INTO public.document_templates (name, category, description, base_structure, ai_instructions) VALUES
('A.1. Relatório Técnico Anual (CMS)', 'Família A', 'Consolida o estado geral do sistema de compliance no período.', '# Relatório Técnico Anual do Sistema de Gestão de Compliance (CMS)

## 1. Sumário Executivo
[A IA deve escrever um sumário das principais atividades e do estado do programa.]

## 2. Perfil e Contexto da Organização
[A IA deve consolidar as informações de perfil, porte e governança.]

## 3. Matriz de Riscos de Compliance
[A IA deve extrair e listar os riscos mapeados, destacando os de maior impacto.]

## 4. Gaps e Melhorias Necessárias
[A IA deve listar as não conformidades abertas.]

## 5. Conclusões e Recomendações
[A IA deve redigir conclusões formais.]', 'Assuma o papel de Chief Compliance Officer. Use linguagem técnica e gerencial. Extraia do contexto fornecido os riscos mais críticos e as não conformidades abertas. Se não houver dados em alguma seção, escreva "[Informação não disponível no sistema até a data da emissão]".'),
('B.1. Parecer Técnico de Conformidade', 'Família B', 'Documento operacional para atestar conformidade de ações específicas.', '# Parecer Técnico de Conformidade

## 1. Identificação da Demanda
[Detalhar a demanda com base nas instruções adicionais.]

## 2. Contexto Fático
[Descrever o contexto fático considerando o perfil do cliente.]

## 3. Análise de Compliance
[Análise legal e de integridade baseada nos riscos.]

## 4. Conclusão e Encaminhamentos
[Parecer final.]', 'Assuma o papel de Consultor de Integridade Especialista. A análise central deve basear-se primordialmente no que for fornecido no campo "Instruções Adicionais do Usuário", cruzando com o perfil geral da empresa. Formule recomendações seguras para mitigar riscos de compliance.')
ON CONFLICT DO NOTHING;
