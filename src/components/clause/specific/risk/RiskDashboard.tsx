import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { riskMotorService } from '@/services/risk-motor'
import { RiskHeatmap } from './RiskHeatmap'
import { Loader2, ShieldAlert, Target, Activity, TrendingDown } from 'lucide-react'

export function RiskDashboard() {
  const { tenantId } = useParams()
  const [risks, setRisks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tenantId) {
      riskMotorService.getRisks(tenantId).then((data) => {
        setRisks(data)
        setLoading(false)
      })
    }
  }, [tenantId])

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    )

  const total = risks.length
  const critical = risks.filter((r) => r.assessments?.[0]?.residual_score >= 16).length
  const treated = risks.filter((r) =>
    r.treatments?.some((t: any) => t.status === 'Em Andamento' || t.status === 'Concluído'),
  ).length
  const effective = risks.filter((r) =>
    r.treatments?.some((t: any) => t.status === 'Concluído'),
  ).length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full shrink-0">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                Total Identificados
              </p>
              <h4 className="text-xl sm:text-2xl font-bold">{total}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-destructive/10 p-3 rounded-full shrink-0">
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                Riscos Críticos
              </p>
              <h4 className="text-xl sm:text-2xl font-bold">{critical}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-full shrink-0">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                Em Tratamento
              </p>
              <h4 className="text-xl sm:text-2xl font-bold">{treated}</h4>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-full shrink-0">
              <TrendingDown className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                Mitigados (Efetivos)
              </p>
              <h4 className="text-xl sm:text-2xl font-bold">{effective}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Mapa de Calor Executivo (Residual)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RiskHeatmap risks={risks} type="residual" />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Top Riscos em Foco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {risks
                .filter((r) => r.assessments?.[0]?.residual_score >= 12)
                .map((r) => (
                  <div
                    key={r.id}
                    className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {r.code} - {r.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Dono: {r.owner} | Cat: {r.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-md ${r.assessments?.[0]?.residual_score >= 16 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}
                      >
                        Score: {r.assessments?.[0]?.residual_score}
                      </span>
                    </div>
                  </div>
                ))}
              {risks.filter((r) => r.assessments?.[0]?.residual_score >= 12).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum risco crítico no momento. Bom trabalho!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
