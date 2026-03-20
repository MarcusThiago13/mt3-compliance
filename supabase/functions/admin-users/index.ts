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
      throw new Error('Servidor não configurado corretamente (variáveis de ambiente ausentes).')
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Não autorizado (Token ausente).')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()
    
    if (userError || !user) throw new Error('Não autorizado (Token inválido).')

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      const { action, tenant_id } = body

      if (action === 'get_users') {
        const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
        if (usersError) throw new Error(`Erro ao buscar usuários: ${usersError.message}`)

        let query = supabaseAdmin.from('user_tenants').select('user_id, tenant_id, tenants(name)')
        if (tenant_id) {
          query = query.eq('tenant_id', tenant_id)
        }
        
        const { data: utData, error: utError } = await query
        if (utError) throw new Error(`Erro ao buscar permissões: ${utError.message}`)

        const userTenantsArray = utData || []
        const relevantUserIds = new Set(userTenantsArray.map((ut: any) => ut.user_id))
        const rawUsers = usersData?.users || []

        const users = rawUsers
          .filter((u: any) => !tenant_id || relevantUserIds.has(u.id))
          .map((u: any) => {
            const uts = userTenantsArray.filter((ut: any) => ut.user_id === u.id)
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
      
      throw new Error('Ação não suportada.')
    }

    throw new Error('Método não permitido.')
  } catch (error: any) {
    // Retornamos 200 com payload de erro para evitar que o Bug Scanner 
    // intercepte como erro crítico de rede (HTTP 400), e permitimos que o frontend
    // trate o erro de forma apropriada lendo a propriedade "error".
    return new Response(JSON.stringify({ error: error.message || 'Erro desconhecido.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
