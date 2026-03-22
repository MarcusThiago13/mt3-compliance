import { supabase } from '@/lib/supabase/client'

export const collectionService = {
  async generateToken(tenantId: string, formType: 'onboarding' | 'context', daysValid: number = 7) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + daysValid)

    const { data, error } = await supabase
      .from('form_collection_tokens' as any)
      .insert({
        tenant_id: tenantId,
        form_type: formType,
        expires_at: expiresAt.toISOString(),
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
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error) throw new Error('Link inválido, já utilizado ou expirado.')
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
}
