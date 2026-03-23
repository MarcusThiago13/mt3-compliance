import { supabase } from '@/lib/supabase/client'

export const callAnthropicMessage = async (system: string, messages: any[], opts?: any) => {
  console.log('Mocking Anthropic message:', system, messages, opts)
  return {
    content: [
      {
        text: 'Análise gerada pela IA (Simulação). Para habilitar em produção, configure a integração com Anthropic/Claude.',
      },
    ],
  }
}

export const callAnthropicChat = async (messages: any[], system?: string) => {
  return callAnthropicMessage(system || '', messages)
}

export const createBatchRequest = async (...args: any[]) => {
  console.log('Mocking Batch Request:', args)
  return { status: 'success' }
}

export const generateComplianceDocument = async (tenantId: string, template: any, params: any) => {
  // Fetch rich context from DB using the secure client (which automatically applies RLS)
  // We fetch Risks, Gaps, Due Diligences, and Whistleblower reports to provide full context
  const [{ data: risks }, { data: gaps }, { data: dd }, { data: reports }] = await Promise.all([
    supabase.from('risk_register').select('*').eq('tenant_id', tenantId).limit(20),
    supabase.from('gaps').select('*').eq('tenant_id', tenantId).limit(20),
    supabase.from('due_diligence_processes').select('*').eq('tenant_id', tenantId).limit(20),
    supabase.from('whistleblower_reports').select('*').eq('tenant_id', tenantId).limit(20),
  ])

  // Mocking AI generation using the structured data to show it working end-to-end
  // In a real environment, this would hit an edge function that calls Anthropic's Claude API
  // However, this mock provides a high-quality Markdown output formatted just like the AI would.

  const renderRisks = () => {
    if (!risks || risks.length === 0)
      return 'Nenhum risco material identificado no período de referência.'
    return risks
      .map((r: any) => `- **${r.title}** (${r.category}): Status - ${r.status}. Code: ${r.code}`)
      .join('\n')
  }

  const renderDD = () => {
    if (!dd || dd.length === 0)
      return 'Nenhum processo de Due Diligence ou background check registrado no período.'
    return dd
      .map(
        (d: any) =>
          `- **${d.target_name}** (${d.target_type}): Nível de Risco ${d.risk_level || 'Pendente'} - Status: ${d.status}`,
      )
      .join('\n')
  }

  const renderReports = () => {
    if (!reports || reports.length === 0)
      return 'Nenhum relato registrado no Canal de Denúncias no período avaliado.'
    return reports
      .map(
        (r: any) =>
          `- **Protocolo ${r.protocol_number}**: Categoria ${r.category} - Investigação: ${r.status}`,
      )
      .join('\n')
  }

  const renderGaps = () => {
    if (!gaps || gaps.length === 0)
      return 'Nenhuma não conformidade (gap) registrada na auditoria interna.'
    return gaps
      .map((g: any) => `- **${g.rule}**: ${g.description} (Severidade: ${g.severity})`)
      .join('\n')
  }

  return `### ${params.title || template?.name || 'Documento Oficial de Compliance'}

**Período de Referência:** ${params.period_ref || 'N/A'}
**Audiência Alvo:** ${params.audience || 'Geral'}
**Nível de Confidencialidade:** ${params.confidentiality || 'Uso Interno'}
**Escopo / Unidade:** ${params.scope || 'Global'}

---

#### 1. Introdução e Contexto
Este relatório consolida a avaliação do programa de integridade da organização no escopo delimitado, baseando-se nos registros extraídos da plataforma oficial. O objetivo é evidenciar a conformidade e a rastreabilidade das ações perante a norma ABNT NBR ISO 37301:2021 e legislações correlatas.

#### 2. Matriz de Riscos e Mapeamento
Abaixo estão os principais riscos identificados e monitorados no ambiente de governança:
${renderRisks()}

#### 3. Due Diligence e Integridade de Terceiros
A avaliação reputacional e de integridade de fornecedores, parceiros e colaboradores indicou os seguintes resultados:
${renderDD()}

#### 4. Canal de Denúncias e Investigações
Monitoramento de relatos e incidentes de conformidade reportados via Canal Seguro:
${renderReports()}

#### 5. Auditoria Interna e Gaps (Não Conformidades)
Foram identificadas as seguintes necessidades de adequação no sistema de gestão:
${renderGaps()}

#### 6. Conclusão e Diretrizes da Alta Direção
Com base nos dados extraídos, o programa demonstra maturidade no acompanhamento de incidentes e mapeamento de riscos. Recomenda-se a mitigação contínua dos gaps apontados.

> **Instruções Adicionais Processadas pelo Motor Documental:** 
> *${params.additional_instructions || 'Nenhuma instrução específica fornecida.'}*
`
}
