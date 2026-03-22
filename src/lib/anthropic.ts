export const DEFAULT_MODEL = 'claude-haiku-4-5-20251001'
export const SONNET_MODEL = 'claude-sonnet-4-6'

const SYSTEM_PROMPT =
  'Você é um auditor técnico especializado em programas de compliance e integridade corporativa. Sua linguagem deve ser formal, objetiva e alinhada às normas ISO 37301 e ao Decreto 11.129/22 do Brasil. Seja direto e estruture suas respostas em tópicos claros.'

const ISO_CACHE_TEXT =
  'A norma ABNT NBR ISO 37301:2021 especifica os requisitos e fornece diretrizes para estabelecer, desenvolver, implementar, avaliar, manter e melhorar continuamente um sistema de gestão de compliance eficaz dentro de uma organização. O Decreto 11.129/2022 regulamenta a Lei Anticorrupção no Brasil. (Este bloco simula o conteúdo completo da norma para efeito de caching).'

export async function callAnthropicMessage(
  prompt: string,
  maxTokens: number = 1024,
  useSonnet: boolean = false,
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
    return data.content[0].text
  } catch (error) {
    console.error('Falha de rede ao contatar a API da Anthropic:', error)
    return mockAiResponse(prompt)
  }
}

export async function createBatchRequest(
  prompt: string,
  useSonnet: boolean = false,
): Promise<string> {
  const model = useSonnet ? SONNET_MODEL : DEFAULT_MODEL
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (apiKey) {
    try {
      fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      }).catch(console.error)
    } catch (error) {
      console.error(error)
    }
  }

  const res = await callAnthropicMessage(prompt, 4096, useSonnet)
  return res
}

export async function callAnthropicChat(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  tenantName: string,
): Promise<{ role: 'assistant'; content: string; references?: string[] }> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    return mockChatResponse()
  }

  try {
    const systemPrompt = `Você é um Especialista em Compliance da organização ${tenantName}. Responda às dúvidas dos colaboradores com base nas boas práticas de compliance, políticas internas da base de conhecimento (RAG), ISO 37301 e Decreto 11.129/22. Seja direto e didático. Se for relevante, simule referências bibliográficas ao final do texto no formato [Ref: Documento XYZ].`

    const apiMessages = history
      .filter((h, idx) => !(idx === 0 && h.role === 'assistant'))
      .map((h) => ({ role: h.role, content: h.content }))

    apiMessages.push({ role: 'user', content: message })

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

  return 'A funcionalidade de Inteligência Artificial requer uma chave de API válida (Anthropic) configurada no painel de Integração de Backend do sistema.'
}
