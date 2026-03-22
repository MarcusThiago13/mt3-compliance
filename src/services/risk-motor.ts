import { supabase } from '@/lib/supabase/client'

export const riskMotorService = {
  async getRisks(tenantId: string) {
    try {
      const { data, error } = await supabase
        .from('risk_register' as any)
        .select('*, assessments:risk_assessments(*), treatments:risk_treatments(*)')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })

      if (error || !data) return []
      return data
    } catch (e) {
      return []
    }
  },

  async getTreatments(tenantId: string) {
    try {
      const risks = await this.getRisks(tenantId)
      const treatments: any[] = []
      risks.forEach((r: any) => {
        if (r.treatments && r.treatments.length > 0) {
          r.treatments.forEach((t: any) => {
            treatments.push({
              risk_code: r.code,
              risk_title: r.title,
              ...t,
            })
          })
        }
      })
      return treatments
    } catch (e) {
      return []
    }
  },
}
