import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'
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

    if (req.method === 'GET') {
      const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
      if (usersError) throw usersError

      const { data: utData, error: utError } = await supabaseAdmin
        .from('user_tenants')
        .select('user_id, tenant_id, tenants(name)')
      if (utError) throw utError

      const users = usersData.users.map((u: any) => {
        const uts = utData.filter((ut: any) => ut.user_id === u.id)
        return {
          id: u.id,
          email: u.email,
          name: u.user_metadata?.name || 'Sem Nome',
          status: u.email_confirmed_at ? 'Ativo' : 'Pendente',
          tenants: uts.map((ut: any) => ({
            id: ut.tenant_id,
            name: ut.tenants?.name,
          })),
        }
      })

      return new Response(JSON.stringify({ users }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const { email, name, tenant_id } = body

      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      let authUser = existingUsers.users.find((u: any) => u.email === email)

      if (!authUser) {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          user_metadata: { name },
          email_confirm: false,
        })
        if (error) throw error
        authUser = data.user
      }

      if (tenant_id) {
        const { error: insertError } = await supabaseAdmin
          .from('user_tenants')
          .upsert({ user_id: authUser.id, tenant_id })
        if (insertError) throw insertError
      }

      return new Response(JSON.stringify({ user: authUser }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
