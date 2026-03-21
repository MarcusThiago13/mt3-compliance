import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react'
import { complianceService } from '@/services/compliance'
import { whistleblowingService } from '@/services/whistleblowing'
import { useAppStore } from '@/stores/main'

export function CockpitOverview() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { activeTenant } = useAppStore()

  const [stats, setStats] = useState({
    conformity: 85,
    openGaps: 3,
    criticalRisks: 2,
    trainedUsers: 92,
  })

  const [wbStats, setWbStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
  })

  useEffect(() => {
    if (tenantId) {
      // Fetch compliance basic stats
      complianceService
        .getGaps(tenantId)
        .then((gaps) => {
          setStats((prev) => ({
            ...prev,
            openGaps: gaps.filter((g: any) => g.status === 'Open').length,
          }))
        })
        .catch(console.error)

      complianceService
        .getRisks(tenantId)
        .then((risks) => {
          setStats((prev) => ({
            ...prev,
            criticalRisks: risks.filter((r: any) => r.impact >= 4 && r.probability >= 4).length,
          }))
        })
        .catch(console.error)

      // Fetch Whistleblowing stats
      whistleblowingService
        .getTenantReports(tenantId)
        .then((reports) => {
          const active = reports.filter(
            (r: any) =>
              !['encerrada_procedente', 'encerrada_improcedente', 'arquivada'].includes(r.status),
          ).length
          const resolved = reports.filter((r: any) =>
            ['encerrada_procedente', 'encerrada_improcedente'].includes(r.status),
          ).length
          setWbStats({
            total: reports.length,
            active,
            resolved,
          })
        })
        .catch(console.error)
    }
  }, [tenantId])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-success shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Índice de Conformidade</CardTitle>
            <ShieldCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.conformity}%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-success" /> +2.5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Não Conformidades</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.openGaps}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              Gaps identificados em auditorias (ISO 10.2)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Riscos Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.criticalRisks}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              Matriz de Riscos (ISO 4.6 / 6.1)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Treinamento e Cultura</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.trainedUsers}%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              Cobertura do quadro de efetivo (ISO 7.2 / 7.3)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Atividade Recente do SGC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Revisão da Política de Brindes', time: 'Há 2 horas', type: 'doc' },
                { title: 'Novo Risco Mapeado: Terceiros', time: 'Há 5 horas', type: 'risk' },
                { title: 'Evidência Aprovada: Treinamento LGPD', time: 'Ontem', type: 'evidence' },
                { title: 'Relatório de Admissibilidade Concluído', time: 'Ontem', type: 'wb' },
              ].map((act, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      act.type === 'doc'
                        ? 'bg-blue-100 text-blue-600'
                        : act.type === 'risk'
                          ? 'bg-amber-100 text-amber-600'
                          : act.type === 'evidence'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-purple-100 text-purple-600'
                    }`}
                  >
                    {act.type === 'evidence' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : act.type === 'risk' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : act.type === 'wb' ? (
                      <ShieldAlert className="h-4 w-4" />
                    ) : (
                      <Activity className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{act.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm border-t-4 border-t-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <ShieldAlert className="h-5 w-5" />
              Canal de Denúncias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-end border-b pb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Casos Ativos</p>
                <h3 className="text-3xl font-bold text-purple-600">{wbStats.active}</h3>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                Em Apuração
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Recebido (Ano):</span>
                <span className="font-medium">{wbStats.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Casos Encerrados:</span>
                <span className="font-medium text-emerald-600">{wbStats.resolved}</span>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground text-center">
                Métrica de efetividade ISO 8.3 / Art. 57 (Decreto 11.129/22)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
