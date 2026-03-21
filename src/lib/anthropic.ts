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
    // Fallback para mock se a chave não estiver configurada
    await new Promise((resolve) => setTimeout(resolve, 1500))
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
      // Fire and forget da criação do batch para demonstração
      fetch('https://api.anthropic.com/v1/messages/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          requests: [
            {
              custom_id: 'report-batch-01',
              params: {
                model,
                max_tokens: 4096,
                system: [
                  { type: 'text', text: SYSTEM_PROMPT },
                  { type: 'text', text: ISO_CACHE_TEXT, cache_control: { type: 'ephemeral' } },
                ],
                messages: [{ role: 'user', content: prompt }],
              },
            },
          ],
        }),
      }).catch(console.error)
    } catch (error) {
      console.error(error)
    }
  }

  // Simulamos a latência e o retorno do lote processado (Async UX)
  await new Promise((resolve) => setTimeout(resolve, 2500))
  return mockAiResponse(prompt + '\n\n(Batch Processed - 50% Cost Discount Applied)')
}

export async function callAnthropicChat(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  tenantName: string,
): Promise<{ role: 'assistant'; content: string; references?: string[] }> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return mockChatResponse(message)
  }

  try {
    const systemPrompt = `Você é um Especialista em Compliance da organização ${tenantName}. Responda às dúvidas dos colaboradores com base nas boas práticas de compliance, políticas internas da base de conhecimento (RAG), ISO 37301 e Decreto 11.129/22. Seja direto e didático. Se for relevante, simule referências bibliográficas ao final do texto no formato [Ref: Documento XYZ].`

    // A API da Anthropic exige que as mensagens comecem com 'user'
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
      return mockChatResponse(message)
    }

    const data = await response.json()
    const text = data.content[0].text

    // Extrair referências formatadas [Ref: Documento XYZ]
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
    return mockChatResponse(message)
  }
}

function mockChatResponse(message: string): {
  role: 'assistant'
  content: string
  references?: string[]
} {
  const lower = message.toLowerCase()

  if (
    lower.includes('conflito de interesses') ||
    lower.includes('conflito') ||
    lower.includes('parente')
  ) {
    return {
      role: 'assistant',
      content:
        'Nossa política estabelece que qualquer potencial conflito de interesses deve ser declarado imediatamente ao Compliance Officer através do formulário oficial. É estritamente proibido participar de decisões de contratação de fornecedores onde o colaborador tenha parentes de até 3º grau como sócios ou diretores.',
      references: ['Código de Conduta - Cap. 4', 'Política de Relacionamento com Terceiros (v2.1)'],
    }
  }

  if (lower.includes('brinde') || lower.includes('presente') || lower.includes('ingresso')) {
    return {
      role: 'assistant',
      content:
        'A política atual permite o recebimento e oferecimento de brindes institucionais (com logo da empresa) até o valor limite de R$ 100,00. Valores superiores a este teto devem ser recusados, devolvidos ou encaminhados ao RH para sorteio geral. Dinheiro em espécie ou equivalente (gift cards) são sempre proibidos.',
      references: ['Política de Brindes e Hospitalidades - Item 2.1'],
    }
  }

  if (lower.includes('denúncia') || lower.includes('relatar') || lower.includes('canal')) {
    return {
      role: 'assistant',
      content:
        'Qualquer suspeita de violação ao nosso Código de Conduta ou legislação vigente deve ser reportada imediatamente através do nosso Canal de Denúncias oficial. O relato pode ser feito de forma 100% anônima e garantimos proteção absoluta contra qualquer tipo de retaliação.',
      references: ['Política do Canal de Denúncias e Não Retaliação'],
    }
  }

  return {
    role: 'assistant',
    content:
      'Com base nos documentos atualmente indexados na base de conhecimento da organização, não encontrei uma diretriz específica para essa situação. Recomendo consultar seu gestor direto ou enviar a dúvida formalmente ao departamento de Compliance.',
    references: [],
  }
}

function mockAiResponse(prompt: string): string {
  if (prompt.includes('Matriz SWOT') || prompt.includes('questões internas')) {
    return `
    {
      "external": {
        "Regulatório": "Mudanças frequentes na legislação trabalhista e normas de segurança do trabalho no setor.",
        "Legal": "Risco de litígios contratuais com fornecedores de pequeno porte devido à falta de clareza.",
        "Econômico": "Flutuação nos preços de insumos impactando a margem operacional e pressionando cortes.",
        "Político": "Incertezas sobre políticas de incentivo e regulamentações governamentais locais.",
        "Social": "Aumento da pressão da comunidade por práticas sustentáveis e diversidade nas frentes de trabalho.",
        "Cultural": "Resistência a novas tecnologias e processos digitalizados na operação de base.",
        "Ambiental": "Crescente rigor nas exigências de licenciamento e gestão de resíduos sólidos para novas instalações."
      },
      "internal": {
        "Estrutura Organizacional": "Estrutura descentralizada com múltiplas filiais dificulta a padronização e monitoramento do compliance.",
        "Governança": "Comitê de Ética recém-formado, ainda em fase de amadurecimento das rotinas e fluxos de denúncia.",
        "Políticas e Objetivos": "Código de Conduta existe, mas a comunicação e o treinamento não alcançaram plenamente a operação.",
        "Processos Operacionais": "Alta dependência de aprovações manuais em áreas críticas como suprimentos e logística.",
        "Recursos (Humanos, Fin, Tech)": "Equipe de compliance enxuta e orçamento restrito para implementação de ferramentas automatizadas.",
        "Maturidade de TI": "Sistemas legados sem integração direta, dificultando a rastreabilidade rápida e geração de evidências consolidadas."
      }
    }
    `
  }

  if (prompt.includes('riscos críticos') || prompt.includes('array JSON')) {
    return `
    [
      {
        "id": "AI-R01",
        "cat": "Anticorrupção / Terceiros",
        "event": "Oferta de vantagem indevida por intermediários ou despachantes na obtenção de licenças governamentais",
        "controls": "Implementar due diligence aprimorada e incluir cláusulas anticorrupção rigorosas nos contratos",
        "i": 5,
        "p": 4,
        "ri": 4,
        "rp": 2,
        "treat": "Evitar",
        "isAi": true
      },
      {
        "id": "AI-R02",
        "cat": "Trabalhista",
        "event": "Passivo trabalhista severo por falha na fiscalização do recolhimento de encargos de empresas terceirizadas",
        "controls": "Auditoria mensal automatizada de documentação trabalhista e previdenciária de terceiros",
        "i": 4,
        "p": 3,
        "ri": 2,
        "rp": 2,
        "treat": "Mitigar",
        "isAi": true
      },
      {
        "id": "AI-R03",
        "cat": "Proteção de Dados / TI",
        "event": "Vazamento de dados pessoais sensíveis devido a controles de acesso inadequados ou engenharia social",
        "controls": "Campanhas contínuas de conscientização e implantação obrigatória de MFA (Múltiplo Fator)",
        "i": 5,
        "p": 2,
        "ri": 3,
        "rp": 1,
        "treat": "Mitigar",
        "isAi": true
      }
    ]
    `
  }

  if (prompt.includes('5W2H')) {
    return `
    {
      "what": "Implementar processo de Due Diligence aprimorada e fluxo de aprovação sistêmico",
      "why": "Para mitigar riscos críticos mapeados e garantir alinhamento à política interna de compliance",
      "where": "Diretoria de Suprimentos (Matriz e Filiais)",
      "when": "Próximos 30 dias",
      "who": "Equipe de Compliance com apoio da TI",
      "how": "Mapear fluxo de compras atual, integrar API de background check no ERP e criar trava para impedir pagamentos sem aprovação dupla.",
      "howMuch": "R$ 12.000,00 anuais (Software) + 40h de consultoria"
    }
    `
  }

  if (prompt.includes('evidências necessárias para o requisito')) {
    return `### Análise Inteligente de Requisito\n\nCom base na ISO 37301, para atender adequadamente a este requisito, sugerimos a preparação e o anexo das seguintes evidências:\n\n- **Políticas e Procedimentos Documentados:** Manuais atualizados e aprovados formalmente pela alta direção.\n- **Registros de Treinamento:** Listas de presença, cronograma de aplicação e certificados de capacitação dos colaboradores chave.\n- **Relatórios de Monitoramento:** Indicadores de desempenho (KPIs) pertinentes e atas de reunião de análise crítica da direção.`
  }

  if (prompt.includes('Gere um sumário de conformidade')) {
    return `### Sumário de Conformidade Analisado\n\n**Conformidades Encontradas:**\n- A política de compliance anexada abrange as obrigações fundamentais exigidas pelo item analisado.\n- Os procedimentos internos e diretrizes de conduta estão adequadamente descritos no corpo do documento.\n\n**Lacunas (Gaps) Identificadas:**\n- *Aprovação Ausente:* Falta a evidência de aprovação formal e assinatura pela Alta Direção no documento anexado.\n- *Métricas:* Ausência de detalhamento sobre o processo de monitoramento da efetividade (prazos de revisão não definidos).`
  }

  if (prompt.includes('Relatório de Perfil de Integridade')) {
    return `### Relatório de Perfil de Integridade (Decreto 11.129/22)\n*(Processado via Anthropic Batch API - Custo Otimizado em 50%)*\n\n**1. Comprometimento da Alta Direção (Inciso I):**\nO perfil indica "Alta Interação com o Setor Público" e "Grande Porte". Recomenda-se reforço documental imediato das atas do conselho de administração e publicações do tom da liderança.\n\n**2. Políticas e Código de Conduta (Incisos II, III):**\nO código corporativo está implementado; contudo, a extensão destas obrigações a terceiros necessita de revisão e aditivos contratuais, devido ao uso intensivo de agentes intermediários.\n\n**3. Controles Internos e Registros (Incisos VI, VII):**\nProcessos financeiros possuem controles contábeis satisfatórios, mas faltam logs automatizados na transição de pagamentos governamentais.\n\n**4. Due Diligence (Inciso XIII):**\nAvaliação Crítica: Requer a implementação imediata de background check de integridade contínuo para todos os parceiros de negócios considerados de alto risco.\n\n**Conclusão Geral:**\nO nível de maturidade e aderência ao Decreto 11.129/2022 é considerado médio-alto, mas carece de ações corretivas no que tange à diligência de terceiros e à formalização do monitoramento contínuo.`
  }

  return 'Resposta gerada pela IA (Mock de fallback).'
}
