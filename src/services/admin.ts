import { supabase } from '@/lib/supabase/client'
import { logError } from '@/lib/logger'

const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 3 * 60 * 1000 // 3 minutes

export const clearAdminCache = (keyPattern?: string) => {
  if (keyPattern) {
    for (const key of cache.keys()) {
      if (key.includes(keyPattern)) cache.delete(key)
    }
  } else {
    cache.clear()
  }
}

const fetchUsersAPI = async (tenantId?: string) => {
  const { data, error } = await supabase.functions.invoke('admin-users', {
    method: 'POST',
    body: { action: 'get_users', tenant_id: tenantId },
  })

  if (error) {
    throw new Error(error.message || 'Erro de comunicação com o servidor ao buscar usuários.')
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  return data?.users || []
}

export const getUsers = async (tenantId?: string, forceRefresh = false) => {
  const cacheKey = `users_${tenantId || 'global'}`

  if (!forceRefresh && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      // Revalidação em background (SWR)
      fetchUsersAPI(tenantId)
        .then((data) => cache.set(cacheKey, { data, timestamp: Date.now() }))
        .catch((e) => logError(e.message, e.stack, { context: 'background_revalidate_users' }))
      return cached.data
    }
  }

  try {
    const data = await fetchUsersAPI(tenantId)
    cache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  } catch (err: any) {
    await logError(err.message, err.stack, { action: 'get_users', tenantId })
    throw err
  }
}

const fetchInvitationsAPI = async (tenantId?: string) => {
  let query = supabase
    .from('invitations' as any)
    .select('*, tenant:tenants(id, name)')
    .order('created_at', { ascending: false })

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data || []
}

export const getInvitations = async (tenantId?: string, forceRefresh = false) => {
  const cacheKey = `invites_${tenantId || 'global'}`

  if (!forceRefresh && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      // Revalidação em background (SWR)
      fetchInvitationsAPI(tenantId)
        .then((data) => cache.set(cacheKey, { data, timestamp: Date.now() }))
        .catch((e) => logError(e.message, e.stack, { context: 'background_revalidate_invites' }))
      return cached.data
    }
  }

  try {
    const data = await fetchInvitationsAPI(tenantId)
    cache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  } catch (err: any) {
    await logError(err.message, err.stack, { action: 'get_invitations', tenantId })
    throw err
  }
}

export const createInvitation = async (
  rawEmail: string,
  name: string,
  tenant_id: string,
  phone?: string,
  role: string = 'viewer',
  classification: string = 'Usuário Colaborador',
) => {
  try {
    const email = rawEmail.trim().toLowerCase()

    const { data: existing } = await supabase
      .from('invitations' as any)
      .select('id')
      .eq('email', email)
      .eq('tenant_id', tenant_id)
      .maybeSingle()

    let result
    if (existing) {
      const { data, error } = await supabase
        .from('invitations' as any)
        .update({ name, phone, status: 'pending', role, classification })
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      result = data
    } else {
      const { data, error } = await supabase
        .from('invitations' as any)
        .insert([{ email, name, tenant_id, phone, status: 'pending', role, classification }])
        .select()
        .single()
      if (error) throw new Error(error.message)
      result = data
    }
    clearAdminCache()
    return result
  } catch (err: any) {
    await logError(err.message, err.stack, { action: 'create_invitation', tenant_id, rawEmail })
    throw err
  }
}

export const sendInvitation = async (invitation_id: string, type: 'email' | 'link') => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-invite', {
      method: 'POST',
      body: { invitation_id, type, redirectUrl: window.location.origin },
    })

    if (error) {
      throw new Error(error.message || 'Erro de comunicação com o servidor ao enviar convite.')
    }

    if (data?.error) {
      throw new Error(data.error)
    }
    clearAdminCache()
    return data
  } catch (err: any) {
    await logError(err.message, err.stack, { action: 'send_invitation', invitation_id })
    throw err
  }
}

export const updateUser = async (
  target_user_id: string,
  target_tenant_id: string,
  updates: any,
) => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-users', {
      method: 'POST',
      body: { action: 'update_user', target_user_id, target_tenant_id, updates },
    })

    if (error) {
      throw new Error(error.message || 'Erro de comunicação com o servidor ao atualizar usuário.')
    }

    if (data?.error) {
      throw new Error(data.error)
    }
    clearAdminCache()
    return data
  } catch (err: any) {
    await logError(err.message, err.stack, {
      action: 'update_user',
      target_user_id,
      target_tenant_id,
    })
    throw err
  }
}

export const removeUser = async (target_user_id: string, target_tenant_id: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-users', {
      method: 'POST',
      body: { action: 'remove_user', target_user_id, target_tenant_id },
    })

    if (error) {
      throw new Error(error.message || 'Erro de comunicação com o servidor ao remover usuário.')
    }

    if (data?.error) {
      throw new Error(data.error)
    }
    clearAdminCache()
    return data
  } catch (err: any) {
    await logError(err.message, err.stack, {
      action: 'remove_user',
      target_user_id,
      target_tenant_id,
    })
    throw err
  }
}

export const updateInvitation = async (invitation_id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('invitations' as any)
      .update(updates)
      .eq('id', invitation_id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    clearAdminCache()
    return data
  } catch (err: any) {
    await logError(err.message, err.stack, { action: 'update_invitation', invitation_id })
    throw err
  }
}

export const removeInvitation = async (invitation_id: string) => {
  try {
    const { error } = await supabase
      .from('invitations' as any)
      .delete()
      .eq('id', invitation_id)
    if (error) throw new Error(error.message)
    clearAdminCache()
  } catch (err: any) {
    await logError(err.message, err.stack, { action: 'remove_invitation', invitation_id })
    throw err
  }
}
