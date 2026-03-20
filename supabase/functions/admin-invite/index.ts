import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Servidor não configurado corretamente.')
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Não autorizado (Token ausente).')
    }

    const token = authHeader.replace('Bearer ', '')
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error(`Não autorizado (Token inválido): ${userError?.message || 'Sessão não identificada'}`)
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.json().catch(() => ({}))
    const { invitation_id, redirectUrl } = body

    if (!invitation_id) throw new Error('O ID do convite (invitation_id) é obrigatório.')

    const { data: invitation, error: invError } = await supabaseAdmin
      .from('invitations')
      .select('*')
      .eq('id', invitation_id)
      .single()

    if (invError || !invitation) throw new Error('Convite não encontrado.')

    // Sempre geramos o link de convite em vez de usar inviteUserByEmail. 
    // Isso evita o envio de e-mails em inglês (padrão do Supabase) 
    // e nos permite interceptar a URL final no frontend para compartilhar.
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: invitation.email,
      data: { name: invitation.name },
      options: { redirectTo: redirectUrl || undefined },
    })
    
    if (error) {
      if (error.status === 422 || error.message.includes('already registered')) {
        throw new Error(`O usuário com e-mail ${invitation.email} já está registrado. O sistema logo suportará a vinculação de usuários existentes.`)
      }
      throw new Error(`Erro ao gerar link: ${error.message}`)
    }
    
    let actionLink = data.properties?.action_link
    const newUserId = data.user?.id

    // Substitui o domínio padrão (localhost:3000) pela URL de redirecionamento real
    if (actionLink && redirectUrl) {
      try {
        const parsedAction = new URL(actionLink)
        const parsedRedirect = new URL(redirectUrl)
        parsedAction.protocol = parsedRedirect.protocol
        parsedAction.host = parsedRedirect.host
        parsedAction.port = parsedRedirect.port
        actionLink = parsedAction.toString()
      } catch (e) {
        console.error('Falha ao processar URL de redirecionamento', e)
      }
    }

    if (newUserId) {
      const { error: utError } = await supabaseAdmin.from('user_tenants').upsert({
        user_id: newUserId,
        tenant_id: invitation.tenant_id
      }, { onConflict: 'user_id,tenant_id' })
      if (utError) console.error('Error linking user:', utError)
    }

    await supabaseAdmin.from('invitations').update({ status: 'sent' }).eq('id', invitation_id)

    return new Response(JSON.stringify({ success: true, link: actionLink }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Erro desconhecido.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
