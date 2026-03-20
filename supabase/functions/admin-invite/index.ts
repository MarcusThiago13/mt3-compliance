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

    const authHeader = req.headers.get('Authorization')
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader || '' } },
    })

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const { invitation_id, type, redirectUrl } = await req.json()

    if (!invitation_id) throw new Error('invitation_id is required')

    const { data: invitation, error: invError } = await supabaseAdmin
      .from('invitations')
      .select('*')
      .eq('id', invitation_id)
      .single()

    if (invError || !invitation) throw new Error('Invitation not found')

    let actionLink = undefined;
    let newUserId = null;

    if (type === 'email') {
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(invitation.email, {
        data: { name: invitation.name },
        redirectTo: redirectUrl || undefined,
      })
      if (error) throw error
      newUserId = data.user.id
    } else if (type === 'link') {
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'invite',
        email: invitation.email,
        data: { name: invitation.name },
        options: { redirectTo: redirectUrl || undefined },
      })
      if (error) throw error
      actionLink = data.properties.action_link
      newUserId = data.user.id
    } else {
      throw new Error('Invalid type')
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
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
