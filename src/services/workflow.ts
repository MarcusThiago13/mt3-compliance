import { supabase } from '@/lib/supabase/client'

export const workflowService = {
  async createEvidenceRequest(payload: any) {
    const { data, error } = await supabase
      .from('evidence_requests' as any)
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getEvidenceRequest(id: string) {
    const { data, error } = await supabase
      .from('evidence_requests' as any)
      .select('*, tenant:tenants(name)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async updateEvidenceRequest(id: string, payload: any) {
    const { data, error } = await supabase
      .from('evidence_requests' as any)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getTenantEvidenceRequests(tenantId: string) {
    const { data, error } = await supabase
      .from('evidence_requests' as any)
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
}
