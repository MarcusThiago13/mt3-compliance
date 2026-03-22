import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error(
        'Serviço de e-mail não configurado (RESEND_API_KEY ausente nas variáveis de ambiente).',
      )
    }

    const { to, subject, html, log_body, tenant_id } = await req.json()

    if (!to || !subject || !html) {
      throw new Error('Parâmetros incompletos para envio de e-mail. Necessário: to, subject, html.')
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'mt3 Compliance <onboarding@resend.dev>', // Em produção, altere para seu domínio verificado no Resend
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
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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
