import { supabase } from '@/lib/supabase/client'

export const collectionService = {
  async generateToken(
    tenantId: string,
    formType: string,
    daysValid: number = 3,
    createdBy?: string,
  ) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + daysValid)

    const { data, error } = await supabase
      .from('form_collection_tokens' as any)
      .insert({
        tenant_id: tenantId,
        form_type: formType,
        expires_at: expiresAt.toISOString(),
        created_by: createdBy,
      })
      .select('token')
      .single()

    if (error) throw new Error('Falha ao gerar link: ' + error.message)
    return data.token
  },

  async getTokenDetails(token: string) {
    const { data, error } = await supabase
      .from('form_collection_tokens' as any)
      .select('form_type, tenants(name)')
      .eq('token', token)
      .eq('is_used', false)
      .eq('is_revoked', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error) throw new Error('Link inválido, já utilizado, revogado ou expirado.')
    return data
  },

  async submitForm(token: string, payload: any) {
    const { data, error } = await supabase.rpc('submit_form_collection', {
      p_token: token,
      p_payload: payload,
    })

    if (error) throw new Error(error.message)
    return data
  },

  async getTokens(tenantId?: string) {
    let q = supabase
      .from('form_collection_tokens' as any)
      .select('id, token, form_type, expires_at, is_used, is_revoked, created_at, tenants(name)')
      .order('created_at', { ascending: false })

    if (tenantId) q = q.eq('tenant_id', tenantId)

    const { data, error } = await q
    if (error) throw new Error(error.message)
    return data
  },

  async revokeToken(id: string) {
    const { error } = await supabase
      .from('form_collection_tokens' as any)
      .update({ is_revoked: true })
      .eq('id', id)
    if (error) throw new Error(error.message)
  },
}
