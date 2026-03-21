import { supabase } from '@/lib/supabase/client'

export const whistleblowingService = {
  async submitReport(payload: any) {
    const { data, error } = await supabase
      .from('whistleblower_reports' as any)
      .insert([payload])
      .select('id, protocol_number')
      .single()
    if (error) throw error
    return data
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
    const { data, error } = await supabase
      .from('whistleblower_reports' as any)
      .select('id, protocol_number, status, created_at, category')
      .eq('id', reportId)
      .single()
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
