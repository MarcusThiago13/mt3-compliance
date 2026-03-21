import { supabase } from '@/lib/supabase/client'

const MOCK_RISKS = [
  {
    id: 'risk-1',
    code: 'R01',
    title: 'Fraude em Pagamentos (Terceiros)',
    category: 'Fraude Financeira',
    owner: 'Suprimentos',
    status: 'Em Tratamento',
    assessments: [
      {
        inherent_prob: 4,
        inherent_impact: 5,
        inherent_score: 20,
        residual_prob: 3,
        residual_impact: 4,
        residual_score: 12,
      },
    ],
    treatments: [
      {
        response_type: 'Mitigar',
        description: 'Dupla aprovação no ERP para pagamentos',
        owner: 'TI',
        deadline: '30/11/2024',
        status: 'Em Andamento',
      },
    ],
  },
  {
    id: 'risk-2',
    code: 'R02',
    title: 'Assédio Moral no Ambiente de Trabalho',
    category: 'Conduta e Trabalhista',
    owner: 'Recursos Humanos',
    status: 'Monitoramento',
    assessments: [
      {
        inherent_prob: 3,
        inherent_impact: 4,
        inherent_score: 12,
        residual_prob: 2,
        residual_impact: 2,
        residual_score: 4,
      },
    ],
    treatments: [
      {
        response_type: 'Mitigar',
        description: 'Treinamento anual e reforço do Canal',
        owner: 'Compliance',
        deadline: '15/05/2024',
        status: 'Concluído',
      },
    ],
  },
  {
    id: 'risk-3',
    code: 'R03',
    title: 'Vazamento de Dados Pessoais (LGPD)',
    category: 'Proteção de Dados',
    owner: 'TI / DPO',
    status: 'Aprovado',
    assessments: [
      {
        inherent_prob: 3,
        inherent_impact: 5,
        inherent_score: 15,
        residual_prob: 3,
        residual_impact: 5,
        residual_score: 15,
      },
    ],
    treatments: [],
  },
  {
    id: 'risk-4',
    code: 'R04',
    title: 'Corrupção em Licitações Públicas',
    category: 'Interações Públicas',
    owner: 'Comercial',
    status: 'Aprovado',
    assessments: [
      {
        inherent_prob: 5,
        inherent_impact: 5,
        inherent_score: 25,
        residual_prob: 4,
        residual_impact: 5,
        residual_score: 20,
      },
    ],
    treatments: [
      {
        response_type: 'Evitar',
        description: 'Suspensão de editais de alto risco',
        owner: 'Diretoria',
        deadline: 'Imediato',
        status: 'Concluído',
      },
    ],
  },
]

export const riskMotorService = {
  async getRisks(tenantId: string) {
    try {
      const { data, error } = await supabase
        .from('risk_register' as any)
        .select('*, assessments:risk_assessments(*), treatments:risk_treatments(*)')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) return MOCK_RISKS
      return data
    } catch (e) {
      return MOCK_RISKS
    }
  },

  async getTreatments(tenantId: string) {
    try {
      const risks = await this.getRisks(tenantId)
      const treatments: any[] = []
      risks.forEach((r) => {
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
