import { supabase } from '@/lib/supabase/client'

export const whistleblowingService = {
  async submitReport(payload: any) {
    // Remoção do .select() no final do insert para evitar erro de RLS (PGRST116)
    // para usuários anônimos que têm permissão de INSERT, mas não de SELECT geral.
    const { error } = await supabase.from('whistleblower_reports' as any).insert([payload])

    if (error) throw error
    return { success: true }
  },

  async checkCredentials(tenantId: string, protocol: string, passwordHash: string) {
    const { data, error } = await supabase.rpc('check_report_credentials', {
      p_tenant_id: tenantId,
      p_protocol: protocol,
      p_password: passwordHash,
    })
    if (error) throw error
    return data as string | null
  },

  async getReportForReporter(reportId: string) {
    // Utilizando a nova RPC que ignora o bloqueio do RLS para o denunciante que já tem o ID
    const { data, error } = await supabase.rpc('get_public_report_details', {
      p_report_id: reportId,
    })
    if (error) throw error
    return data
  },

  async getMessages(reportId: string) {
    const { data, error } = await supabase
      .from('report_messages' as any)
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
  },

  async sendMessage(
    reportId: string,
    senderType: 'reporter' | 'investigator' | 'system',
    message: string,
  ) {
    const { data, error } = await supabase
      .from('report_messages' as any)
      .insert([{ report_id: reportId, sender_type: senderType, message }])
    if (error) throw error
    return data
  },

  async getTenantReports(tenantId: string) {
    const { data, error } = await supabase
      .from('whistleblower_reports' as any)
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async updateReport(reportId: string, updates: any) {
    const { data, error } = await supabase
      .from('whistleblower_reports' as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', reportId)
    if (error) throw error
    return data
  },
}
