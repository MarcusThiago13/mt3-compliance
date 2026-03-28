import { supabase } from '@/lib/supabase/client'

const getCurrentTenantId = () => {
  const parts = window.location.pathname.split('/')
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i
  if (parts[1] && uuidRegex.test(parts[1])) return parts[1]
  return null
}

export const complianceService = {
  async getComplianceHistory() {
    const tid = getCurrentTenantId()
    let q = supabase.from('compliance_history').select('*').order('created_at', { ascending: true })
    if (tid) q = q.eq('tenant_id', tid)
    const { data } = await q
    return data || []
  },
  async getProfileReports(tenantId?: string) {
    const tid = tenantId || getCurrentTenantId()
    let q = supabase.from('profile_reports').select('*').order('created_at', { ascending: false })
    if (tid) q = q.eq('tenant_id', tid)
    const { data } = await q
    return data || []
  },
  async getGaps() {
    const tid = getCurrentTenantId()
    let q = supabase.from('gaps').select('*').order('created_at', { ascending: false })
    if (tid) q = q.eq('tenant_id', tid)
    const { data } = await q
    return data || []
  },
  async getEvidence(clauseId: string, tenantId?: string) {
    const tid = tenantId || getCurrentTenantId()
    let q = supabase
      .from('evidence_metadata')
      .select('*')
      .eq('clause_id', clauseId)
      .order('created_at', { ascending: false })
    if (tid) q = q.eq('tenant_id', tid)
    const { data } = await q
    return data || []
  },
  async addEvidence(payload: any) {
    const tid = payload.tenant_id || getCurrentTenantId()
    const dataToInsert = tid ? { ...payload, tenant_id: tid } : payload
    const { data } = await supabase
      .from('evidence_metadata')
      .insert([dataToInsert])
      .select()
      .single()
    return data
  },
  async getAuditLogs(clauseId: string) {
    const tid = getCurrentTenantId()
    let q = supabase
      .from('audit_logs')
      .select('*')
      .eq('clause_id', clauseId)
      .order('created_at', { ascending: false })
    if (tid) q = q.eq('tenant_id', tid)
    const { data } = await q
    return data || []
  },
  async addAuditLog(clauseId: string, action: string, userEmail: string, metadata?: any) {
    const tid = getCurrentTenantId()
    const payload: any = {
      clause_id: clauseId,
      action,
      user_email: userEmail,
      metadata: metadata || {},
    }
    if (tid) payload.tenant_id = tid
    await supabase.from('audit_logs').insert([payload])
  },
  async getPendingAssessments() {
    const tid = getCurrentTenantId()
    let q = supabase
      .from('assessment_schedules')
      .select('*')
      .order('next_review_date', { ascending: true })
    if (tid) q = q.eq('tenant_id', tid)
    const { data } = await q
    return data || []
  },
  async addAssessmentSchedule(clauseId: string, nextReviewDate: string) {
    const tid = getCurrentTenantId()
    const payload: any = { clause_id: clauseId, next_review_date: nextReviewDate }
    if (tid) payload.tenant_id = tid
    await supabase.from('assessment_schedules').insert([payload])
  },
  async generateDossier(tenantId: string, options?: any) {
    const { data, error } = await supabase.functions.invoke('generate-dossier', {
      body: { tenantId, options },
    })
    if (error) throw new Error(error.message)
    return data
  },
  async getRisks() {
    const tid = getCurrentTenantId()
    let q = supabase.from('risks').select('*').order('created_at', { ascending: true })
    if (tid) q = q.eq('tenant_id', tid)
    const { data } = await q
    return data || []
  },
  async updateRisk(id: string, impact: number, probability: number) {
    const { data } = await supabase
      .from('risks')
      .update({ impact, probability })
      .eq('id', id)
      .select()
      .single()
    return data
  },
}
