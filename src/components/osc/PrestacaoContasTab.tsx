import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import {
  Loader2,
  FileCheck,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Landmark,
  FileSpreadsheet,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function PrestacaoContasTab({ partnership }: any) {
  const [accountability, setAccountability] = useState<any>(null)
  const [execution, setExecution] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)

    const { data: accData } = await supabase
      .from('osc_partnership_accountability' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .maybeSingle()

    if (accData) setAccountability(accData)

    const { data: execData } = await supabase
      .from('osc_partnership_execution' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .maybeSingle()

    setExecution(execData)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [partnership.id])

  const renderRiskMotor = () => {
    if (!execution) return null

    const physical = execution.physical_progress || 0
    const financial = execution.financial_progress || 0
    const discrepancy = financial - physical

    const risks = []

    if (discrepancy > 20) {
      risks.push({
        level: 'Alto',
        title: 'Descompasso Físico-Financeiro Grave',
        desc: `Execução financeira (${financial}%) está muito acima da execução física (${physical}%). Risco iminente de glosa e rejeição de contas.`,
      })
    } else if (discrepancy > 10) {
      risks.push({
        level: 'Médio',
        title: 'Descompasso Físico-Financeiro Moderado',
        desc: `Atenção: A utilização de recursos (${financial}%) está acima das metas atingidas (${physical}%). Necessário justificar desvios na prestação de contas.`,
      })
    }

    if (risks.length === 0) {
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-900">Nenhum Risco Estrutural Detectado</h4>
            <p className="text-sm text-emerald-700">
              A relação entre execução física ({physical}%) e financeira ({financial}%) está
              equilibrada no motor de conformidade.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-800 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          Motor de Nexo Causal (Físico x Financeiro)
        </h4>
        {risks.map((r, i) => (
          <div
            key={i}
            className={`border rounded-lg p-4 flex items-start gap-3 ${r.level === 'Alto' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}
          >
            <AlertTriangle
              className={`h-5 w-5 mt-0.5 ${r.level === 'Alto' ? 'text-red-600' : 'text-amber-600'}`}
            />
            <div>
              <h4 className={`font-bold ${r.level === 'Alto' ? 'text-red-900' : 'text-amber-900'}`}>
                {r.title}
              </h4>
              <p
                className={`text-sm mt-1 ${r.level === 'Alto' ? 'text-red-800' : 'text-amber-800'}`}
              >
                {r.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-amber-50/50 p-4 rounded-lg border border-amber-100">
        <div>
          <h3 className="font-semibold text-amber-900 flex items-center">
            <FileCheck className="h-5 w-5 mr-2 text-amber-600" />
            Integração com Prestação de Contas
          </h3>
          <p className="text-sm text-amber-800 mt-1 max-w-2xl">
            Este painel consolida o status geral da prestação de contas desta parceria. O
            detalhamento financeiro, conciliação e relatórios encontram-se no módulo específico.
          </p>
        </div>
        <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 shadow-sm">
          <Link to={`/${partnership.tenant_id}/osc/prestacao-contas/${partnership.id}`}>
            Acessar Módulo Financeiro <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {renderRiskMotor()}

          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Status Geral da Prestação</CardTitle>
              <CardDescription>Resumo dos prazos e envio ao ente parceiro.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md border">
                <span className="text-sm font-medium text-slate-700">Status Atual:</span>
                <Badge
                  variant="outline"
                  className={
                    accountability?.status === 'Aprovada'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }
                >
                  {accountability?.status || 'Não Iniciada'}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md border">
                <span className="text-sm font-medium text-slate-700">Prazo Legal (Envio):</span>
                <span className="text-sm font-semibold text-slate-900">
                  {accountability?.deadline
                    ? new Date(accountability.deadline).toLocaleDateString('pt-BR')
                    : 'Não definido'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md border">
                <span className="text-sm font-medium text-slate-700">Tipo de Relatório:</span>
                <span className="text-sm font-semibold text-slate-900">
                  {accountability?.report_type || '-'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200 bg-slate-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Landmark className="h-5 w-5 mr-2 text-blue-600" />
                Dados Estruturais (Exportados)
              </CardTitle>
              <CardDescription>
                Informações desta Gestão de Parcerias que alimentam a Prestação de Contas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FileCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Plano de Trabalho, Metas e Indicadores (B3) vinculados.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FileCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Instrumento e Cronograma de Desembolso integrados.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FileCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Relatórios de Execução do Objeto (B4) sincronizados.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-100 shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm flex items-center mb-1">
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-amber-600" />
                  Operação Detalhada
                </h4>
                <p className="text-xs text-muted-foreground">
                  Conciliação bancária, extratos e demonstrativos financeiros residem no módulo
                  próprio.
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 ml-4">
                <Link to={`/${partnership.tenant_id}/osc/prestacao-contas/${partnership.id}`}>
                  Abrir
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
