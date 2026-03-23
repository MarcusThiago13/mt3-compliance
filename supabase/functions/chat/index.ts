import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { userMessage, history = [], contextData = {} } = await req.json()
    const anthropicKey = Deno.env.get('VITE_ANTHROPIC_API_KEY') || Deno.env.get('ANTHROPIC_API_KEY')
    
    let aiResponseText = ""
    let actions: any[] = []
    
    if (anthropicKey) {
      const systemPrompt = `Você é o Claude, assistente de IA especialista em Compliance Corporativo, ISO 37301 e MROSC (Decreto 11.129/22 e Lei 13.019/14), integrado nativamente e de forma onipresente ao sistema "mt3 Compliance".
O usuário está visualizando a seguinte tela/rota do sistema: ${contextData.path || 'Desconhecida'}

Contexto Visível na Tela Atual (Dados Extraídos do DOM):
---
${contextData.pageText?.substring(0, 2500) || 'Nenhum contexto textual visível ou disponível'}
---

Diretrizes de Atuação:
1. Responda de forma profissional, didática, direta e técnica às dúvidas sobre regras de compliance, MROSC, ISO 37301 e operação do sistema.
2. Utilize os dados fornecidos no "Contexto Visível na Tela Atual" para fornecer respostas altamente contextualizadas. O usuário não precisa repetir o que já está vendo; atue como se você estivesse olhando para a tela com ele.
3. Se o usuário solicitar explícita ou implicitamente para navegar para outro módulo ou executar uma ação de redirecionamento, inclua OBRIGATORIAMENTE no final de sua resposta um bloco JSON puro com o comando de navegação, conforme o formato exato abaixo.

Formato JSON de Comando (Use apenas quando apropriado e útil):
\`\`\`json
{"action": "NAVIGATE", "path": "/caminho/desejado"}
\`\`\`

Dicas de caminhos de navegação (Substitua {tenantId} pelo ID ${contextData.tenantId || 'da organização atual'}):
- Dashboard Global de Clientes: /tenants
- Matriz de Usuários: /admin/users
- Prestação de Contas (MROSC): /{tenantId}/osc/prestacao-contas
- Gestão de Parcerias: /{tenantId}/osc/parcerias
- Inteligência & Dossiê: /{tenantId}/intelligence
- Clause 4.1 (Visão ISO): /{tenantId}/clause/4.1
`
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1500,
          system: systemPrompt,
          messages: [
            ...history.map((h: any) => ({ role: h.role, content: h.content })),
            { role: 'user', content: userMessage }
          ]
        })
      })
      
      const data = await res.json()
      if (data.content && data.content[0]) {
        aiResponseText = data.content[0].text
      } else {
        throw new Error(data.error?.message || "Invalid or empty response from Anthropic API")
      }
    } else {
      // Intelligent Mock when API key is missing
      const isMrosc = contextData.path?.includes('/osc')
      const isReport = contextData.path?.includes('/report')
      
      aiResponseText = `Compreendi sua mensagem: "${userMessage}".\n\nComo estou rodando em modo de simulação (sem a chave da API do Claude configurada no backend), atuo como um assistente pré-programado para demonstrar minhas capacidades contextuais e onipresentes.`
      
      if (isMrosc) {
        aiResponseText += `\n\nVejo pelo contexto da tela que você está operando no módulo **MROSC (OSCs)**. Posso ajudar a analisar a prestação de contas baseada no extrato bancário, conferir o enquadramento de rubricas do DID ou sugerir ações de saneamento para diligências do Ente Público.`
      } else if (isReport) {
        aiResponseText += `\n\nPercebo que você está no **Canal de Denúncias Seguro**. Se precisar de dicas sobre como relatar uma fraude de forma detalhada (usando a metodologia 5W2H) ou entender como o sistema garante seu anonimato, estou aqui para orientar.`
      } else {
        aiResponseText += `\n\nEstou analisando o contexto da tela atual (\`${contextData.path}\`) e estou pronto para auxiliar com a implementação da ISO 37301, avaliação de Due Diligence e geração do Dossiê Oficial.`
      }
      
      const targetLower = userMessage.toLowerCase()
      if (targetLower.includes('ir para') || targetLower.includes('navegar') || targetLower.includes('prestação de contas') || targetLower.includes('dashboard') || targetLower.includes('usuário')) {
         const targetPath = targetLower.includes('prestaç') && contextData.tenantId 
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
        console.warn("Failed to parse AI action JSON block", e)
      }
    }

    return new Response(JSON.stringify({ message: aiResponseText.trim(), actions }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: corsHeaders })
  }
})
