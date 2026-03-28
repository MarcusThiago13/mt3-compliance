import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { userMessage, history = [], contextData = {} } = await req.json()
    const anthropicKey = Deno.env.get('VITE_ANTHROPIC_API_KEY') || Deno.env.get('ANTHROPIC_API_KEY')

    let aiResponseText = ''
    let actions: any[] = []

    const persona = contextData.persona || 'Geral'

    if (anthropicKey) {
      const baseContext = `Você é o Claude, integrado nativamente e de forma onipresente ao sistema "mt3 Compliance".
O mt3 é um Sistema de Gestão de Compliance (SGC) Multi-tenant focado em governança corporativa e em organizações da sociedade civil (OSC).
Você possui profundo conhecimento sobre:
- MROSC (Lei 13.019/14 e Decreto 11.129/22): foco em prestação de contas, nexo causal, glosas, plano de trabalho e parcerias.
- LGPD (Lei 13.709/18): proteção de dados pessoais, privacidade e relatórios de impacto.
- ISO 37301:2021 (Sistemas de Gestão de Compliance): matriz de requisitos e controles.
- ISO 37001:2016 (Sistemas de Gestão Antissuborno): avaliação de riscos e due diligence.
- GRC (Governança, Riscos e Compliance): melhores práticas corporativas.

O usuário está visualizando a seguinte tela/rota do sistema: ${contextData.path || 'Desconhecida'}

Contexto Visível na Tela Atual (Dados Extraídos do DOM):
---
${contextData.pageText?.substring(0, 3000) || 'Nenhum contexto textual visível ou disponível'}
---`

      let personaInstruction = ''
      switch (persona) {
        case 'Auditor':
          personaInstruction =
            'Atue como um AUDITOR INTERNO RIGOROSO. Seu foco é identificar riscos sistêmicos, cobrar evidências documentais sólidas, alertar sobre descompassos físico-financeiros, potenciais glosas de despesas e quebras de conformidade (MROSC e ISOs). Seja extremamente analítico, crítico e focado em rastreabilidade de auditoria.'
          break
        case 'Consultor':
          personaInstruction =
            'Atue como um CONSULTOR DE PLANO DE TRABALHO E GESTÃO. Seu foco é ajudar a estruturar metas SMART, revisar indicadores de resultado, aprimorar o planejamento financeiro e garantir que a execução física esteja perfeitamente alinhada às exigências do MROSC. Seja propositivo, didático e focado na eficiência da execução.'
          break
        case 'DPO':
          personaInstruction =
            'Atue como um ESPECIALISTA EM LGPD / DPO (Data Protection Officer). Seu foco absoluto é a proteção de dados pessoais, privacidade by design, anonimização em relatórios de transparência pública, bases legais e adequação de contratos/termos de parceria. Alerte proativamente sobre riscos de exposição indevida de dados na tela atual.'
          break
        case 'Compliance':
          personaInstruction =
            'Atue como um COMPLIANCE OFFICER / GESTOR DE GRC. Seu foco é a integridade corporativa, avaliação de riscos (matriz de impacto x probabilidade), Due Diligence de terceiros, aplicação de normativos internos e atendimento estrito às ISOs 37301 e 37001. Promova a cultura de ética corporativa e prevenção a desvios.'
          break
        default:
          personaInstruction =
            'Atue como um ASSISTENTE GERAL DE COMPLIANCE. Responda de forma profissional, didática, direta e técnica às dúvidas sobre regras de compliance, LGPD, MROSC, ISOs e a operação do sistema mt3.'
      }

      const systemPrompt = `${baseContext}\n\nPersona Selecionada: ${personaInstruction}\n\nDiretrizes de Atuação:
1. Utilize os dados fornecidos no "Contexto Visível na Tela Atual" para fornecer respostas altamente contextualizadas. O usuário não precisa repetir o que já está vendo; atue como se você estivesse olhando para a tela com ele.
2. Mantenha o alinhamento com a persona escolhida em todo o seu tom, vocabulário e profundidade de análise.
3. Se o usuário solicitar explícita ou implicitamente para navegar para outro módulo ou executar uma ação de redirecionamento, inclua OBRIGATORIAMENTE no final de sua resposta um bloco JSON puro com o comando de navegação, conforme o formato exato abaixo.

Formato JSON de Comando (Use apenas quando apropriado e útil):
\`\`\`json
{"action": "NAVIGATE", "path": "/caminho/desejado"}
\`\`\`

Dicas de caminhos de navegação (Substitua {tenantId} pelo ID ${contextData.tenantId || 'da organização atual'}):
- Dashboard Global: /tenants
- Matriz de Usuários: /admin/users
- Prestação de Contas (MROSC): /{tenantId}/osc/prestacao-contas
- Gestão de Parcerias: /{tenantId}/osc/parcerias
- Inteligência & Dossiê: /{tenantId}/intelligence
- Relatos / Canal de Denúncias Seguro: /r/{tenantId}/report
`
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1500,
          system: systemPrompt,
          messages: [
            ...history.map((h: any) => ({ role: h.role, content: h.content })),
            { role: 'user', content: userMessage },
          ],
        }),
      })

      const data = await res.json()
      if (data.content && data.content[0]) {
        aiResponseText = data.content[0].text
      } else {
        throw new Error(data.error?.message || 'Invalid or empty response from Anthropic API')
      }
    } else {
      // Intelligent Mock when API key is missing
      const isMrosc = contextData.path?.includes('/osc')
      const isReport = contextData.path?.includes('/report')

      aiResponseText = `[Modo Simulado - Persona: ${persona}]\nCompreendi sua mensagem: "${userMessage}".\n\nComo estou rodando sem a chave da API do Claude configurada no backend, atuo como um assistente pré-programado para demonstrar minhas capacidades contextuais.`

      if (persona === 'Auditor') {
        aiResponseText += `\n\n**Análise de Auditor Interno:** Com base na tela atual (\`${contextData.path}\`), identifico que a rastreabilidade das evidências é o ponto mais crítico. Recomendo revisar minuciosamente se há lastro documental para cada lançamento listado a fim de mitigar riscos de glosa ou não conformidade.`
      } else if (persona === 'DPO') {
        aiResponseText += `\n\n**Análise de DPO:** Nesta tela (\`${contextData.path}\`), preste atenção especial ao tratamento de dados pessoais. Assegure-se de que a anonimização está aplicada conforme exigido pela LGPD antes da extração ou publicação de qualquer relatório de transparência.`
      } else if (isMrosc) {
        aiResponseText += `\n\nVejo pelo contexto da tela que você está operando no módulo **MROSC (OSCs)**. Posso ajudar a analisar a prestação de contas baseada no extrato bancário, conferir o enquadramento de rubricas do DID ou sugerir ações de saneamento para diligências do Ente Público.`
      } else if (isReport) {
        aiResponseText += `\n\nPercebo que você está no **Canal de Denúncias Seguro**. Se precisar de dicas sobre como relatar uma fraude de forma detalhada (usando a metodologia 5W2H) ou entender como o sistema garante seu anonimato, estou aqui para orientar.`
      } else {
        aiResponseText += `\n\nEstou analisando o contexto da tela atual (\`${contextData.path}\`) sob a perspectiva de ${persona} e estou pronto para auxiliar com as normativas GRC e ISO 37301/37001 aplicáveis ao cenário.`
      }

      const targetLower = userMessage.toLowerCase()
      if (
        targetLower.includes('ir para') ||
        targetLower.includes('navegar') ||
        targetLower.includes('prestação de contas') ||
        targetLower.includes('dashboard') ||
        targetLower.includes('usuário')
      ) {
        const targetPath =
          targetLower.includes('prestaç') && contextData.tenantId
            ? `/${contextData.tenantId}/osc/prestacao-contas`
            : targetLower.includes('usuário')
              ? '/admin/users'
              : '/tenants'

        aiResponseText += `\n\nEntendido, vou executar a tarefa de redirecionamento imediatamente para você!\n\`\`\`json\n{"action": "NAVIGATE", "path": "${targetPath}"}\n\`\`\``
      }
    }

    // Parse actionable commands from Claude's response
    const actionMatch = aiResponseText.match(/```json\s*(\{.*?\})\s*```/s)
    if (actionMatch) {
      try {
        actions.push(JSON.parse(actionMatch[1]))
        aiResponseText = aiResponseText.replace(actionMatch[0], '')
      } catch (e) {
        console.warn('Failed to parse AI action JSON block', e)
      }
    }

    return new Response(JSON.stringify({ message: aiResponseText.trim(), actions }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: corsHeaders })
  }
})
