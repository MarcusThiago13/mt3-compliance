import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload = await req.json()
    const type = payload.type
    const data = payload.data
    
    if (!data || !data.email_id) {
      return new Response('Missing email_id', { status: 400 })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    let status = 'sent'
    if (type === 'email.delivered') status = 'delivered'
    if (type === 'email.opened') status = 'opened'
    if (type === 'email.bounced') status = 'bounced'
    if (type === 'email.complained') status = 'complained'

    if (status !== 'sent') {
      await supabaseAdmin
        .from('communication_logs')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('external_id', data.email_id)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
