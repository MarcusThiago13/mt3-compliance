import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || authHeader.includes('undefined') || authHeader.includes('null')) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado (Sessão expirada ou token ausente).' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    // 1. Validate Authenticated User and Enforce RLS
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const token = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: `Não autorizado: ${userError?.message || 'Token inválido'}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    const { userMessage, history = [], contextData = {} } = await req.json()
    const anthropicKey = Deno.env.get('VITE_ANTHROPIC_API_KEY') || Deno.env.get('ANTHROPIC_API_KEY')

    // 2. Validate Strict Tenant Isolation (Security Hardening)
    if (contextData.tenantId) {
      const isSuperAdmin =
        user.email === 'admin@example.com' ||
        user.email === 'marcusthiago.adv@gmail.com' ||
        user.app_metadata?.role === 'admin' ||
        user.app_metadata?.role === 'super_admin' ||
        user.user_metadata?.is_admin === true ||
        user.user_metadata?.is_admin === 'true'

      if (!isSuperAdmin) {
        const { data: isMember, error: memberError } = await supabaseClient.rpc(
          'is_tenant_member_uuid',
          { check_tenant_id: contextData.tenantId },
        )
        if (memberError || !isMember) {
          throw new Error(
            'Acesso Negado: Tentativa de injeção de contexto cruzado detectada e bloqueada (Tenant Isolation Violation).',
          )
        }
      }
    }

    let aiResponseText = ''
    let actions: any[] = []

    const persona = contextData.persona || 'Geral'

    if (anthropicKey) {
      const baseContext = `Você é o Claude, integrado nativamente e de forma onipresente ao sistema "mt3 Compliance".
O mt3 é um Sistema de Gestão de Compliance (SGC) Multi-tenant focado em governança corporativa e em organizações da sociedade civil (OSC).
Você possui profundo conhecimento sobre:
- MROSC (Lei 13.019/14 e Decreto 11.129/22): foco em prestação de contas, nexo causal, glosas, plano de trabalho e parcerias.
- LGPD (Lei 13.709/18): proteção de dados pessoais, privacidade e relatórios de impacto.
- ISO 37301:2021 (Sistemas de Gestão de Compliance) e ISO 37001:2016 (Antissuborno).
- GRC (Governança, Riscos e Compliance).

O usuário autenticado está visualizando a seguinte tela/rota do sistema: ${contextData.path || 'Desconhecida'}

Contexto Visível na Tela Atual (Filtrado de forma segura):
---
${contextData.pageText?.substring(0, 3000) || 'Nenhum contexto textual visível ou disponível'}
---`

      let personaInstruction =
        'Atue como um ASSISTENTE GERAL DE COMPLIANCE. Responda de forma profissional, didática, direta e técnica.'
      if (persona === 'Auditor')
        personaInstruction =
          'Atue como um AUDITOR INTERNO RIGOROSO. Seu foco é rastreabilidade, análise crítica de evidências e conformidade normativa.'
      if (persona === 'Consultor')
        personaInstruction =
          'Atue como um CONSULTOR DE GESTÃO. Seu foco é apoiar a estruturação de metas, revisar indicadores e otimizar processos MROSC.'
      if (persona === 'DPO')
        personaInstruction =
          'Atue como DPO (Data Protection Officer). Seu foco é proteção de dados pessoais, Privacy by Design e mitigação de riscos de vazamento LGPD.'
      if (persona === 'Compliance')
        personaInstruction =
          'Atue como COMPLIANCE OFFICER. Seu foco é integridade, matriz de riscos e implementação estruturada de controles internos.'

      const systemPrompt = `${baseContext}\n\nPersona Selecionada: ${personaInstruction}\n\nDiretrizes de Atuação:
1. Forneça respostas contextualizadas utilizando os dados fornecidos.
2. Mantenha o tom estrito da persona escolhida em toda a interação.
3. Se o usuário pedir explícita ou implicitamente para navegar para outro módulo, inclua OBRIGATORIAMENTE um bloco JSON puro no final da resposta contendo o comando de navegação:
\`\`\`json
{"action": "NAVIGATE", "path": "/caminho/desejado"}
\`\`\``

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

        // Audit log token consumption securely using Admin Client
        try {
          const adminClient = createClient(supabaseUrl, supabaseServiceKey)
          await adminClient.from('ai_usage_logs').insert({
            tenant_id: contextData.tenantId || null,
            user_id: user.id,
            model: data.model || 'claude-3-haiku-20240307',
            input_tokens: data.usage?.input_tokens || 0,
            output_tokens: data.usage?.output_tokens || 0,
          })
        } catch (logError) {
          console.warn('Falha silenciosa ao gravar log de uso de IA:', logError)
        }
      } else {
        throw new Error(
          data.error?.message ||
            'Resposta inválida ou vazia recebida do provedor da API Anthropic.',
        )
      }
    } else {
      // Intelligent Mock Fallback
      aiResponseText = `[Modo Simulado - Persona: ${persona}]\nCompreendi sua mensagem: "${userMessage}".\nComo estou operando sem a chave da API do Claude configurada, funciono como um assistente pré-programado para validação de contexto.\nO seu acesso ao escopo da organização \`${contextData.tenantId || 'N/A'}\` foi validado com sucesso via backend de segurança.`

      const targetLower = userMessage.toLowerCase()
      if (
        targetLower.includes('ir para') ||
        targetLower.includes('navegar') ||
        targetLower.includes('dashboard')
      ) {
        aiResponseText += `\n\nIdentifiquei a intenção de navegação. Executando o redirecionamento seguro:\n\`\`\`json\n{"action": "NAVIGATE", "path": "/tenants"}\n\`\`\``
      }
    }

    // Parse actionable commands from Claude's response
    const actionMatch = aiResponseText.match(/```json\s*(\{.*?\})\s*```/s)
    if (actionMatch) {
      try {
        actions.push(JSON.parse(actionMatch[1]))
        aiResponseText = aiResponseText.replace(actionMatch[0], '')
      } catch (e) {
        console.warn('Falha ao efetuar parse de comando JSON da IA', e)
      }
    }

    return new Response(JSON.stringify({ message: aiResponseText.trim(), actions }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (e: any) {
    console.error('Chat API Guard Error:', e.message)
    return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: corsHeaders })
  }
})
