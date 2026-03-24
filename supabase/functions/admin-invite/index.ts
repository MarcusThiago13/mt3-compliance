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
    if (!authHeader || authHeader.includes('undefined') || authHeader.includes('null')) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado (Sessão expirada ou token ausente).' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    // Create secure client bound to user
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
        JSON.stringify({
          error: `Não autorizado (Token inválido): ${userError?.message || 'Sessão não identificada'}`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const isSuperAdmin =
      user.email === 'admin@example.com' ||
      user.email === 'marcusthiago.adv@gmail.com' ||
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.is_admin === true ||
      user.user_metadata?.is_admin === 'true'

    const body = await req.json().catch(() => ({}))
    const { invitation_id, redirectUrl } = body

    if (!invitation_id) throw new Error('O ID do convite (invitation_id) é obrigatório.')

    // Verify invitation exists
    const { data: invitation, error: invError } = await supabaseAdmin
      .from('invitations')
      .select('*')
      .eq('id', invitation_id)
      .single()

    if (invError || !invitation) throw new Error('Convite não encontrado.')

    // Security Check: Enforce tenant isolation
    if (!isSuperAdmin) {
      const { data: isMember } = await supabaseClient.rpc('is_tenant_member_uuid', {
        check_tenant_id: invitation.tenant_id,
      })
      if (!isMember)
        throw new Error(
          'Acesso negado. Você não tem permissão para processar convites neste tenant.',
        )
    }

    // 1. Check if user already exists
    const { data: existingUserId } = await supabaseAdmin.rpc('get_user_id_by_email', {
      user_email: invitation.email,
    })

    if (existingUserId) {
      // Bind existing user to tenant
      const { error: utError } = await supabaseAdmin.from('user_tenants').upsert(
        {
          user_id: existingUserId,
          tenant_id: invitation.tenant_id,
          role: invitation.role || 'viewer',
          classification: invitation.classification,
          contact_phone: invitation.phone,
        },
        { onConflict: 'user_id,tenant_id' },
      )

      if (utError) throw new Error(`Erro ao vincular usuário existente: ${utError.message}`)

      await supabaseAdmin.from('invitations').update({ status: 'accepted' }).eq('id', invitation_id)

      return new Response(
        JSON.stringify({
          success: true,
          link: redirectUrl,
          message: 'Usuário já possuía cadastro e foi vinculado à organização automaticamente.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // 2. Generate invite link for new user
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: invitation.email,
      data: { name: invitation.name },
      options: { redirectTo: redirectUrl || undefined },
    })

    if (error) {
      if (error.status === 422 || error.message.includes('already registered')) {
        throw new Error(
          `O usuário com e-mail ${invitation.email} já está registrado, mas houve falha na verificação prévia.`,
        )
      }
      throw new Error(`Erro ao gerar link: ${error.message}`)
    }

    let actionLink = data.properties?.action_link
    const newUserId = data.user?.id

    if (actionLink && redirectUrl) {
      try {
        const parsedAction = new URL(actionLink)
        const parsedRedirect = new URL(redirectUrl)
        parsedAction.protocol = parsedRedirect.protocol
        parsedAction.host = parsedRedirect.host
        parsedAction.port = parsedRedirect.port
        actionLink = parsedAction.toString()
      } catch (e) {
        console.warn('Falha ao processar URL de redirecionamento', e)
      }
    }

    if (newUserId) {
      const { error: utError } = await supabaseAdmin.from('user_tenants').upsert(
        {
          user_id: newUserId,
          tenant_id: invitation.tenant_id,
          role: invitation.role || 'viewer',
          classification: invitation.classification,
          contact_phone: invitation.phone,
        },
        { onConflict: 'user_id,tenant_id' },
      )
      if (utError) console.warn('Error linking user:', utError)
    }

    await supabaseAdmin.from('invitations').update({ status: 'sent' }).eq('id', invitation_id)

    return new Response(JSON.stringify({ success: true, link: actionLink }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.warn('Admin-Invite Edge Function Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message || 'Erro desconhecido ao gerar convite.' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
