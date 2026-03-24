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
    if (!authHeader || authHeader.includes('undefined') || authHeader.includes('null')) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado (Sessão expirada ou token ausente).' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    // Initialize client with user's JWT to enforce RLS and permissions natively
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

    const isSuperAdmin =
      user.email === 'admin@example.com' ||
      user.email === 'marcusthiago.adv@gmail.com' ||
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.is_admin === true ||
      user.user_metadata?.is_admin === 'true'

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      const { action, tenant_id, target_user_id, target_tenant_id, updates } = body

      if (!action) {
        throw new Error('Ação não especificada na requisição.')
      }

      if (action === 'get_users') {
        let users = []
        if (tenant_id) {
          // Security Check: Verify if caller is authorized for this tenant
          if (!isSuperAdmin) {
            const { data: isMember } = await supabaseClient.rpc('is_tenant_member_uuid', {
              check_tenant_id: tenant_id,
            })
            if (!isMember) throw new Error('Acesso negado ao tenant especificado.')
          }

          const { data, error } = await supabaseAdmin.rpc('get_tenant_users', {
            target_tenant_id: tenant_id,
          })
          if (error) throw new Error(`Erro ao buscar usuários da organização: ${error.message}`)
          users = (data || []).map((u: any) => ({
            id: u.user_id,
            email: u.email,
            name: u.name || 'Usuário',
            status: u.status,
            role: u.role,
            classification: u.classification,
            phone: u.contact_phone,
          }))
        } else {
          // Only superadmins can fetch all users globally
          if (!isSuperAdmin)
            throw new Error('Acesso negado. Operação restrita a administradores globais.')

          const { data, error } = await supabaseAdmin.rpc('get_all_users')
          if (error) throw new Error(`Erro ao buscar usuários globais: ${error.message}`)
          users = (data || []).map((u: any) => ({
            id: u.user_id,
            email: u.email,
            name: u.name || 'Usuário',
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

      if (action === 'update_user' || action === 'remove_user') {
        if (!target_user_id || !target_tenant_id)
          throw new Error('Parâmetros inválidos. Informe o usuário e a organização.')

        // Security Check for mutations
        if (!isSuperAdmin) {
          const { data: isMember } = await supabaseClient.rpc('is_tenant_member_uuid', {
            check_tenant_id: target_tenant_id,
          })
          if (!isMember) throw new Error('Acesso negado para modificar acessos nesta organização.')
        }

        if (action === 'update_user') {
          const { error } = await supabaseAdmin
            .from('user_tenants')
            .update(updates)
            .match({ user_id: target_user_id, tenant_id: target_tenant_id })

          if (error) throw new Error(`Erro ao atualizar acessos do usuário: ${error.message}`)

          const { data: userResp } = await supabaseAdmin.auth.admin.getUserById(target_user_id)
          if (userResp?.user?.email) {
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
        } else if (action === 'remove_user') {
          const { data: userResp } = await supabaseAdmin.auth.admin.getUserById(target_user_id)

          const { error } = await supabaseAdmin
            .from('user_tenants')
            .delete()
            .match({ user_id: target_user_id, tenant_id: target_tenant_id })

          if (error) throw new Error(`Erro ao remover acessos do usuário: ${error.message}`)

          if (userResp?.user?.email) {
            await supabaseAdmin
              .from('invitations')
              .delete()
              .match({ email: userResp.user.email, tenant_id: target_tenant_id })
          }
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      throw new Error('Ação não suportada no endpoint.')
    }

    throw new Error('Método HTTP não permitido.')
  } catch (error: any) {
    console.warn('Admin-Users Edge Function Error:', error.message)
    return new Response(JSON.stringify({ error: error.message || 'Erro interno desconhecido.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
