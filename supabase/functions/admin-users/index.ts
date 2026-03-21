import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

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

    const token = authHeader.replace('Bearer ', '')
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      throw new Error(
        `Não autorizado (Token inválido): ${userError?.message || 'Sessão não identificada'}`,
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      const { action, tenant_id, target_user_id, target_tenant_id, updates } = body

      if (action === 'get_users') {
        let users = []
        if (tenant_id) {
          const { data, error } = await supabaseAdmin.rpc('get_tenant_users', {
            target_tenant_id: tenant_id,
          })
          if (error) throw new Error(`Erro ao buscar usuários: ${error.message}`)
          users = (data || []).map((u: any) => ({
            id: u.user_id,
            email: u.email,
            name: u.name || 'Sem Nome',
            status: u.status,
            role: u.role,
            classification: u.classification,
            phone: u.contact_phone,
          }))
        } else {
          const { data, error } = await supabaseAdmin.rpc('get_all_users')
          if (error) throw new Error(`Erro ao buscar usuários: ${error.message}`)
          users = (data || []).map((u: any) => ({
            id: u.user_id,
            email: u.email,
            name: u.name || 'Sem Nome',
            status: u.status,
            role: u.role,
            classification: u.classification,
            tenant: { id: u.tenant_id, name: u.tenant_name },
            phone: u.contact_phone,
          }))
        }

        return new Response(JSON.stringify({ users }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      if (action === 'update_user') {
        if (!target_user_id || !target_tenant_id) throw new Error('Parâmetros inválidos')
        const { error } = await supabaseAdmin
          .from('user_tenants')
          .update(updates)
          .match({ user_id: target_user_id, tenant_id: target_tenant_id })

        if (error) throw new Error(`Erro ao atualizar usuário: ${error.message}`)

        const { data: userResp } = await supabaseAdmin.auth.admin.getUserById(target_user_id)
        if (userResp?.user?.email) {
          // Prepare invitation updates mapping contact_phone to phone
          const invUpdates = { ...updates }
          if (invUpdates.contact_phone !== undefined) {
            invUpdates.phone = invUpdates.contact_phone
            delete invUpdates.contact_phone
          }
          await supabaseAdmin
            .from('invitations')
            .update(invUpdates)
            .match({ email: userResp.user.email, tenant_id: target_tenant_id })
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      if (action === 'remove_user') {
        if (!target_user_id || !target_tenant_id) throw new Error('Parâmetros inválidos')

        const { data: userResp } = await supabaseAdmin.auth.admin.getUserById(target_user_id)

        const { error } = await supabaseAdmin
          .from('user_tenants')
          .delete()
          .match({ user_id: target_user_id, tenant_id: target_tenant_id })

        if (error) throw new Error(`Erro ao remover usuário: ${error.message}`)

        if (userResp?.user?.email) {
          await supabaseAdmin
            .from('invitations')
            .delete()
            .match({ email: userResp.user.email, tenant_id: target_tenant_id })
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      throw new Error('Ação não suportada.')
    }

    throw new Error('Método não permitido.')
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Erro desconhecido.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
