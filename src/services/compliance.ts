import { supabase } from '@/lib/supabase/client'

export const complianceService = {
  async getComplianceHistory() {
    const { data } = await supabase
      .from('compliance_history')
      .select('*')
      .order('created_at', { ascending: true })
    return data || []
  },
  async getGaps() {
    const { data } = await supabase
      .from('gaps')
      .select('*')
      .order('created_at', { ascending: false })
    return data || []
  },
  async getEvidence(clauseId: string) {
    const { data } = await supabase
      .from('evidence_metadata')
      .select('*')
      .eq('clause_id', clauseId)
      .order('created_at', { ascending: false })
    return data || []
  },
  async addEvidence(payload: any) {
    const { data } = await supabase.from('evidence_metadata').insert([payload]).select().single()
    return data
  },
  async getAuditLogs(clauseId: string) {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('clause_id', clauseId)
      .order('created_at', { ascending: false })
    return data || []
  },
  async addAuditLog(clauseId: string, action: string, userEmail: string) {
    await supabase
      .from('audit_logs')
      .insert([{ clause_id: clauseId, action, user_email: userEmail }])
  },
  async getPendingAssessments() {
    const { data } = await supabase
      .from('assessment_schedules')
      .select('*')
      .order('next_review_date', { ascending: true })
    return data || []
  },
  async addAssessmentSchedule(clauseId: string, nextReviewDate: string) {
    await supabase
      .from('assessment_schedules')
      .insert([{ clause_id: clauseId, next_review_date: nextReviewDate }])
  },
  async generateDossier(clauseId: string) {
    const { data, error } = await supabase.functions.invoke('generate-dossier', {
      body: { clauseId },
    })
    if (error) throw new Error(error.message)
    return data
  },
  async getRisks() {
    const { data } = await supabase
      .from('risks')
      .select('*')
      .order('created_at', { ascending: true })
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
