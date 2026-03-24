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
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!resendApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Serviço não configurado corretamente (variáveis ausentes).')
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

    // Initialize authenticated client to check credentials
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

    const { to, subject, html, log_body, tenant_id } = await req.json()

    if (!to || !subject || !html) {
      throw new Error('Parâmetros incompletos. Necessário: to, subject, html.')
    }

    // Enforce Tenant Security
    if (tenant_id) {
      const isSuperAdmin =
        user.email === 'admin@example.com' ||
        user.email === 'marcusthiago.adv@gmail.com' ||
        user.app_metadata?.role === 'admin' ||
        user.user_metadata?.is_admin === true ||
        user.user_metadata?.is_admin === 'true'

      if (!isSuperAdmin) {
        const { data: isMember } = await supabaseClient.rpc('is_tenant_member_uuid', {
          check_tenant_id: tenant_id,
        })
        if (!isMember) throw new Error('Acesso negado para enviar e-mails em nome deste tenant.')
      }
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'mt3 Compliance <onboarding@resend.dev>', // Update for production domain
        to: [to],
        subject: subject,
        html: html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Falha ao enviar e-mail pelo provedor Resend.')
    }

    if (data.id) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
      await supabaseAdmin.from('communication_logs').insert({
        tenant_id: tenant_id || null,
        to_email: to,
        subject: subject,
        body: log_body || html,
        status: 'sent',
        external_id: data.id,
      })
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
