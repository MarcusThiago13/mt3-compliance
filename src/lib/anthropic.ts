import { supabase } from '@/lib/supabase/client'

export const DEFAULT_MODEL = 'claude-haiku-4-5-20251001'
export const SONNET_MODEL = 'claude-sonnet-4-6'

const SYSTEM_PROMPT =
  'Você é um auditor técnico especializado em programas de compliance e integridade corporativa. Sua linguagem deve ser formal, objetiva e alinhada às normas ISO 37301 e ao Decreto 11.129/22 do Brasil. Seja direto e estruture suas respostas em tópicos claros.'

const ISO_CACHE_TEXT =
  'A norma ABNT NBR ISO 37301:2021 especifica os requisitos e fornece diretrizes para estabelecer, desenvolver, implementar, avaliar, manter e melhorar continuamente um sistema de gestão de compliance eficaz dentro de uma organização. O Decreto 11.129/2022 regulamenta a Lei Anticorrupção no Brasil. (Este bloco simula o conteúdo completo da norma para efeito de caching).'

async function logAiUsage(
  model: string,
  inputTokens: number,
  outputTokens: number,
  providedTenantId?: string,
) {
  try {
    let tenantId = providedTenantId

    if (!tenantId && typeof window !== 'undefined') {
      const match = window.location.pathname.match(
        /^\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i,
      )
      if (match) tenantId = match[1]
    }

    let userId = null
    if (typeof window !== 'undefined') {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      userId = user?.id
    }

    await supabase.from('ai_usage_logs' as any).insert({
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      tenant_id: tenantId || null,
      user_id: userId || null,
    })
  } catch (error) {
    console.error('Falha ao registrar log de consumo de IA', error)
  }
}

export async function callAnthropicMessage(
  prompt: string,
  maxTokens: number = 1024,
  useSonnet: boolean = false,
  tenantId?: string,
): Promise<string> {
  const model = useSonnet ? SONNET_MODEL : DEFAULT_MODEL
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    return mockAiResponse(prompt)
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
          },
          {
            type: 'text',
            text: ISO_CACHE_TEXT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      console.error('Anthropic API Error:', await response.text())
      return mockAiResponse(prompt)
    }

    const data = await response.json()

    if (data.usage) {
      logAiUsage(model, data.usage.input_tokens || 0, data.usage.output_tokens || 0, tenantId)
    }

    return data.content[0].text
  } catch (error) {
    console.error('Falha de rede ao contatar a API da Anthropic:', error)
    return mockAiResponse(prompt)
  }
}

export async function createBatchRequest(
  prompt: string,
  useSonnet: boolean = false,
  tenantId?: string,
): Promise<string> {
  const res = await callAnthropicMessage(prompt, 4096, useSonnet, tenantId)
  return res
}

export async function callAnthropicChat(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  tenantName: string,
  tenantId?: string,
  attachment?:
    | { type: 'image'; mediaType: string; data: string }
    | { type: 'document'; text: string },
): Promise<{ role: 'assistant'; content: string; references?: string[] }> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    return mockChatResponse()
  }

  try {
    const systemPrompt = `Você é um Especialista em Compliance da organização ${tenantName}. Responda às dúvidas dos colaboradores com base nas boas práticas de compliance, políticas internas da base de conhecimento (RAG), ISO 37301 e Decreto 11.129/22. Seja direto e didático. Analise documentos ou imagens fornecidas pelo usuário considerando o contexto de integridade corporativa. Se for relevante, simule referências bibliográficas ao final do texto no formato [Ref: Documento XYZ].`

    const apiMessages = history
      .filter((h, idx) => !(idx === 0 && h.role === 'assistant'))
      .map((h) => ({ role: h.role, content: h.content }))

    let userContent: any = message

    if (attachment) {
      userContent = []
      if (attachment.type === 'image') {
        userContent.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: attachment.mediaType,
            data: attachment.data,
          },
        })
      } else if (attachment.type === 'document') {
        userContent.push({
          type: 'text',
          text: `[Conteúdo do Documento Anexo]\n${attachment.text}\n[Fim do Documento]\n\n`,
        })
      }
      userContent.push({ type: 'text', text: message })
    }

    apiMessages.push({ role: 'user', content: userContent })

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: apiMessages,
      }),
    })

    if (!response.ok) {
      console.error('Anthropic API Error:', await response.text())
      return mockChatResponse()
    }

    const data = await response.json()

    if (data.usage) {
      logAiUsage(
        DEFAULT_MODEL,
        data.usage.input_tokens || 0,
        data.usage.output_tokens || 0,
        tenantId,
      )
    }

    const text = data.content[0].text

    const refMatch = text.match(/\[Ref:(.*?)\]/g)
    const references = refMatch
      ? refMatch.map((r: string) => r.replace('[Ref:', '').replace(']', '').trim())
      : []
    const cleanText = text.replace(/\[Ref:(.*?)\]/g, '').trim()

    return {
      role: 'assistant',
      content: cleanText,
      references: references.length > 0 ? references : undefined,
    }
  } catch (error) {
    console.error('Falha de rede ao contatar a API da Anthropic:', error)
    return mockChatResponse()
  }
}

export async function generateComplianceDocument(
  tenantId: string,
  template: any,
  params: any,
): Promise<string> {
  // Fetch required RAG context from the tenant
  const { data: tenant } = await supabase.from('tenants').select('*').eq('id', tenantId).single()
  const { data: risks } = await supabase.from('risks').select('*').eq('tenant_id', tenantId)
  const { data: gaps } = await supabase.from('gaps').select('*').eq('tenant_id', tenantId)

  const contextData = {
    organizacao: tenant?.name,
    cnpj: tenant?.cnpj,
    perfil: tenant?.step_1,
    governanca: tenant?.step_2,
    efetivo: tenant?.step_4,
    riscos_mapeados: risks?.map((r) => ({
      titulo: r.title,
      impacto: r.impact,
      probabilidade: r.probability,
    })),
    gaps_identificados: gaps?.map((g) => ({
      regra: g.rule,
      descricao: g.description,
      severidade: g.severity,
      status: g.status,
    })),
  }

  const prompt = `Você é o motor de elaboração documental inteligente de compliance.
Seu objetivo é gerar a primeira minuta qualificada do documento com base exclusivamente nos dados do cliente e no template fornecido.

TEMPLATE SELECIONADO: ${template.name}
Categoria: ${template.category}

ESTRUTURA BASE DO DOCUMENTO:
${template.base_structure}

INSTRUÇÕES ESPECÍFICAS DA IA PARA ESTE TEMPLATE:
${template.ai_instructions}

PARÂMETROS DA GERAÇÃO SOLICITADOS PELO USUÁRIO:
- Título do Documento: ${params.title}
- Audiência Alvo: ${params.audience}
- Nível de Confidencialidade: ${params.confidentiality}
- Período de Referência: ${params.period_ref}
- Instruções Adicionais do Usuário: ${params.additional_instructions || 'Nenhuma'}

DADOS DO CLIENTE PARA CONTEXTO (RAG):
${JSON.stringify(contextData, null, 2)}

REGRAS DE OURO DA GERAÇÃO (OBRIGATÓRIO):
1. Utilize estritamente os dados do cliente fornecidos no contexto acima. NUNCA invente indicadores, valores ou métricas fictícias.
2. Se uma informação exigida pelo template não estiver disponível no contexto, escreva explicitamente: "[Informação não disponível no sistema até a data da emissão]".
3. O texto deve ser formatado impecavelmente em Markdown. Não use tags HTML soltas.
4. Ajuste a profundidade e a linguagem de acordo com a "Audiência Alvo" especificada.
5. Não retorne nenhum texto conversacional (ex: "Aqui está o seu documento:"). Retorne APENAS o código Markdown do documento.

Gere o documento agora:
`

  // Use the advanced Sonnet model for comprehensive document generation
  return callAnthropicMessage(prompt, 4096, true, tenantId)
}

function mockChatResponse(): {
  role: 'assistant'
  content: string
  references?: string[]
} {
  return {
    role: 'assistant',
    content:
      'Não foi possível conectar ao Assistente Virtual de Compliance no momento. Por favor, verifique se a chave de API da Anthropic está configurada corretamente nos segredos do sistema.',
    references: [],
  }
}

function mockAiResponse(prompt: string): string {
  if (prompt.includes('Matriz SWOT') || prompt.includes('questões internas')) {
    return `{ "external": {}, "internal": {} }`
  }

  if (prompt.includes('riscos críticos') || prompt.includes('array JSON')) {
    return `[]`
  }

  if (prompt.includes('5W2H')) {
    return `{ "what": "", "why": "", "where": "", "when": "", "who": "", "how": "", "howMuch": "" }`
  }

  if (prompt.includes('motor inteligente de elaboração documental')) {
    return `# Documento Gerado em Modo Mock\n\n## Atenção\nA funcionalidade de geração de relatórios por Inteligência Artificial requer uma chave de API válida da Anthropic (Claude) configurada nas variáveis de ambiente (\`VITE_ANTHROPIC_API_KEY\`).\n\n## 1. Dados Recebidos\nOs dados do tenant foram capturados, mas a IA não processou o texto.\n[Verifique a integração para utilizar o motor real].`
  }

  return 'A funcionalidade de Inteligência Artificial requer uma chave de API válida (Anthropic) configurada no painel de Integração de Backend do sistema.'
}
