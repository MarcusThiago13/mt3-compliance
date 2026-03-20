import { supabase } from '@/lib/supabase/client'

export const getUsers = async (tenantId?: string) => {
  const { data, error } = await supabase.functions.invoke('admin-users', {
    method: 'POST',
    body: { action: 'get_users', tenant_id: tenantId },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data.users || []
}

export const getInvitations = async (tenantId?: string) => {
  let query = supabase
    .from('invitations' as any)
    .select('*, tenant:tenants(id, name)')
    .order('created_at', { ascending: false })

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export const createInvitation = async (
  email: string,
  name: string,
  tenant_id: string,
  phone?: string,
  role: string = 'viewer',
  classification: string = 'Usuário Colaborador',
) => {
  const { data, error } = await supabase
    .from('invitations' as any)
    .insert([{ email, name, tenant_id, phone, status: 'pending', role, classification }])
    .select()
    .single()
  if (error) throw error
  return data
}

export const sendInvitation = async (invitation_id: string, type: 'email' | 'link') => {
  const { data, error } = await supabase.functions.invoke('admin-invite', {
    method: 'POST',
    body: { invitation_id, type, redirectUrl: window.location.origin },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

export const updateUser = async (
  target_user_id: string,
  target_tenant_id: string,
  updates: any,
) => {
  const { data, error } = await supabase.functions.invoke('admin-users', {
    method: 'POST',
    body: { action: 'update_user', target_user_id, target_tenant_id, updates },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

export const removeUser = async (target_user_id: string, target_tenant_id: string) => {
  const { data, error } = await supabase.functions.invoke('admin-users', {
    method: 'POST',
    body: { action: 'remove_user', target_user_id, target_tenant_id },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

export const updateInvitation = async (invitation_id: string, updates: any) => {
  const { data, error } = await supabase
    .from('invitations' as any)
    .update(updates)
    .eq('id', invitation_id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const removeInvitation = async (invitation_id: string) => {
  const { error } = await supabase
    .from('invitations' as any)
    .delete()
    .eq('id', invitation_id)
  if (error) throw error
}
