import { supabase } from '@/lib/supabase/client'

export const ddService = {
  async getProcesses(tenantId: string, types?: string[]) {
    let q = supabase
      .from('due_diligence_processes')
      .select('*, dd_red_flags(*)')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (types && types.length > 0) {
      q = q.in('target_type', types)
    }

    const { data, error } = await q
    if (error) throw error
    return data || []
  },

  async createProcess(payload: any) {
    const { data, error } = await supabase
      .from('due_diligence_processes')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getDeclarations(tenantId: string) {
    const { data, error } = await supabase
      .from('dd_conflict_declarations')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async createDeclaration(payload: any) {
    const { data, error } = await supabase
      .from('dd_conflict_declarations')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },
}
