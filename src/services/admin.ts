import { supabase } from '@/lib/supabase/client'

export const getUsers = async () => {
  const { data, error } = await supabase.functions.invoke('admin-users', {
    method: 'GET',
  })
  if (error) throw error
  return data.users
}

export const createUser = async (email: string, name: string, tenant_id: string) => {
  const { data, error } = await supabase.functions.invoke('admin-users', {
    method: 'POST',
    body: { email, name, tenant_id },
  })
  if (error) throw error
  return data.user
}

export const sendInviteEmail = async (email: string) => {
  const { data, error } = await supabase.functions.invoke('admin-invite', {
    method: 'POST',
    body: { email, type: 'email', redirectUrl: window.location.origin },
  })
  if (error) throw error
  return data
}

export const generateInviteLink = async (email: string) => {
  const { data, error } = await supabase.functions.invoke('admin-invite', {
    method: 'POST',
    body: { email, type: 'link', redirectUrl: window.location.origin },
  })
  if (error) throw error
  return data.link
}
