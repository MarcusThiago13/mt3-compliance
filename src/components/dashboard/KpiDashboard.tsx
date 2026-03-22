import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { History } from 'lucide-react'

export function KpiDashboard() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [activities, setActivities] = useState<any[]>([])
  const [maturityScore, setMaturityScore] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tenantId) return

    const fetchDashboardData = async () => {
      setLoading(true)
      const { data: logs } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (logs) setActivities(logs)

      const { data: history } = await supabase
        .from('compliance_history')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (history) {
        setMaturityScore(history.conformity_score)
      } else {
        setMaturityScore(0)
      }
      setLoading(false)
    }

    fetchDashboardData()
  }, [tenantId])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return (
      date.toLocaleDateString('pt-BR') +
      ' ' +
      date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    )
  }

  const getLevelName = (score: number) => {
    if (score === 0) return 'Não Avaliado'
    if (score < 2) return 'Inicial'
    if (score < 3) return 'Básico'
    if (score < 4) return 'Gerenciado'
    return 'Otimizado'
  }

  const scoreBase5 = maturityScore > 0 ? maturityScore / 20 : 0
  const scoreDisplay = maturityScore > 0 ? scoreBase5.toFixed(1) : '0.0'

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Maturidade do Compliance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          {loading ? (
            <div className="text-muted-foreground text-sm">Carregando métricas...</div>
          ) : (
            <div
              className="relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-1000"
              style={{
                background: `conic-gradient(hsl(var(--primary)) ${(scoreBase5 / 5) * 100}%, hsl(var(--muted)) 0)`,
              }}
            >
              <div className="absolute inset-[16px] bg-card rounded-full"></div>
              <div className="relative z-10 text-center">
                <div className="text-4xl font-bold text-primary">{scoreDisplay}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
                  {getLevelName(scoreBase5)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-muted-foreground text-sm py-4">Carregando atividades...</div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <History className="h-8 w-8 mb-3 opacity-40" />
                <p className="text-sm text-center">Nenhuma atividade recente registrada.</p>
                <p className="text-xs text-center mt-1">O histórico operacional aparecerá aqui.</p>
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="flex flex-col gap-1 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{act.action}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(act.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {act.user_email || 'Sistema'}
                    </span>
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 whitespace-nowrap">
                      {act.clause_id}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
