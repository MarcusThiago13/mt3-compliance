import { supabase } from '@/lib/supabase/client'

export const getUsers = async (tenantId?: string) => {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token

  if (!token) {
    throw new Error('Sessão de usuário não encontrada. Por favor, faça login novamente.')
  }

  const { data, error } = await supabase.functions.invoke('admin-users', {
    body: { action: 'get_users', tenant_id: tenantId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (error) {
    // Treat Edge Function specific error structures
    if (error.context?.error) {
      throw new Error(error.context.error)
    }
    throw new Error(error.message || 'Falha ao processar a requisição administrativa.')
  }

  return data?.users || []
}

export const getInvitations = async (tenantId?: string) => {
  let query = supabase.from('invitations').select('*')
  if (tenantId) query = query.eq('tenant_id', tenantId)
  const { data, error } = await query

  if (error) throw new Error(`Falha ao buscar convites: ${error.message}`)
  return data || []
}

export const createInvitation = async (
  email: string,
  name: string,
  tenantId: string,
  phone: string,
  role: string,
  classification: string,
) => {
  const { error } = await supabase.from('invitations').insert({
    email,
    name,
    tenant_id: tenantId,
    phone,
    role,
    classification,
    status: 'pending',
  })

  if (error) throw new Error(`Falha ao registrar convite: ${error.message}`)
}

export const sendInvitation = async (invitationId: string, redirectUrl?: string) => {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token

  if (!token) {
    throw new Error('Sessão de usuário não encontrada. Por favor, faça login novamente.')
  }

  const { data, error } = await supabase.functions.invoke('admin-invite', {
    body: { invitation_id: invitationId, redirectUrl },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (error) {
    if (error.context?.error) {
      throw new Error(error.context.error)
    }
    throw new Error(error.message || 'Falha ao disparar o convite.')
  }

  return data
}

export const updateUser = async (userId: string, tenantId: string, updates: any) => {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token

  if (!token) {
    throw new Error('Sessão de usuário não encontrada.')
  }

  const { error } = await supabase.functions.invoke('admin-users', {
    body: { action: 'update_user', target_user_id: userId, target_tenant_id: tenantId, updates },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (error) {
    throw new Error(error.context?.error || error.message || 'Erro ao atualizar dados do usuário.')
  }
}

export const removeUser = async (userId: string, tenantId: string) => {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token

  if (!token) {
    throw new Error('Sessão de usuário não encontrada.')
  }

  const { error } = await supabase.functions.invoke('admin-users', {
    body: { action: 'remove_user', target_user_id: userId, target_tenant_id: tenantId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (error) {
    throw new Error(error.context?.error || error.message || 'Erro ao remover usuário.')
  }
}

export const updateInvitation = async (invitationId: string, updates: any) => {
  const { error } = await supabase.from('invitations').update(updates).eq('id', invitationId)
  if (error) throw new Error(`Falha ao atualizar convite: ${error.message}`)
}

export const removeInvitation = async (invitationId: string) => {
  const { error } = await supabase.from('invitations').delete().eq('id', invitationId)
  if (error) throw new Error(`Falha ao remover convite: ${error.message}`)
}
