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
) => {
  const { data, error } = await supabase
    .from('invitations' as any)
    .insert([{ email, name, tenant_id, phone, status: 'pending' }])
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
