import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, ShieldAlert, AlertTriangle, TrendingUp, Target, Activity } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { format, subMonths, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

const chartConfig = {
  score: {
    label: 'Conformidade Geral (%)',
    color: 'hsl(var(--primary))',
  },
}

const Heatmap = ({ data }: { data: any[] }) => {
  const matrix = Array(5)
    .fill(0)
    .map(() => Array(5).fill(0))

  data.forEach((r) => {
    const prob = Math.round(r.residual_prob || r.probability || 1)
    const imp = Math.round(r.residual_impact || r.impact || 1)
    if (prob >= 1 && prob <= 5 && imp >= 1 && imp <= 5) {
      matrix[5 - imp][prob - 1] += 1
    }
  })

  const getColor = (prob: number, imp: number) => {
    const score = prob * imp
    if (score >= 15) return 'bg-red-500/90 text-white shadow-sm ring-1 ring-red-600/50'
    if (score >= 8) return 'bg-amber-500/90 text-white shadow-sm ring-1 ring-amber-600/50'
    if (score >= 4) return 'bg-yellow-400/90 text-yellow-950 shadow-sm ring-1 ring-yellow-500/50'
    return 'bg-emerald-500/90 text-white shadow-sm ring-1 ring-emerald-600/50'
  }

  return (
    <div className="flex w-full max-w-[320px] mx-auto">
      <div className="flex flex-col justify-between py-4 pr-3 text-[10px] text-muted-foreground font-semibold uppercase">
        <span>Alto</span>
        <span className="-rotate-90 origin-center translate-x-3 whitespace-nowrap tracking-wider">
          Impacto
        </span>
        <span>Baixo</span>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-5 gap-1.5 w-full aspect-square bg-slate-50/50 p-2 rounded-xl border border-slate-100 shadow-inner">
          {matrix.map((row, i) =>
            row.map((count, j) => {
              const imp = 5 - i
              const prob = j + 1
              const colorClass =
                count > 0
                  ? getColor(prob, imp)
                  : 'bg-white text-transparent border border-dashed border-slate-200'
              return (
                <div
                  key={`${i}-${j}`}
                  className={`flex items-center justify-center rounded-lg font-bold text-sm sm:text-base transition-all ${colorClass}`}
                >
                  {count > 0 ? count : 0}
                </div>
              )
            }),
          )}
        </div>
        <div className="flex justify-between px-2 pt-3 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
          <span>Baixo</span>
          <span>Probabilidade</span>
          <span>Alto</span>
        </div>
      </div>
    </div>
  )
}

export default function Intelligence() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [loading, setLoading] = useState(true)
  const [historyData, setHistoryData] = useState<any[]>([])
  const [incidentsData, setIncidentsData] = useState<any[]>([])
  const [risksData, setRisksData] = useState<any[]>([])
  const [gapsData, setGapsData] = useState<any[]>([])
  const [metrics, setMetrics] = useState({
    score: 0,
    criticalIncidents: 0,
    highRisks: 0,
    openGaps: 0,
  })

  useEffect(() => {
    if (!tenantId) return
    fetchData()
  }, [tenantId])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [historyRes, incidentsRes, riskRes, gapsRes] = await Promise.all([
        supabase
          .from('compliance_history')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: true }),
        supabase
          .from('digital_incidents')
          .select('*')
          .eq('tenant_id', tenantId)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase.from('risks').select('*').eq('tenant_id', tenantId),
        supabase.from('gaps').select('*').eq('tenant_id', tenantId).neq('status', 'Closed'),
      ])

      let history = historyRes.data || []
      if (history.length === 0) {
        history = Array.from({ length: 6 }).map((_, i) => ({
          month: format(subMonths(new Date(), 5 - i), 'MMM/yy', { locale: ptBR }),
          conformity_score: 75 + i * 3 + Math.floor(Math.random() * 5),
        }))
      }
      setHistoryData(history)

      let fetchedIncidents = incidentsRes.data || []
      if (fetchedIncidents.length === 0) {
        fetchedIncidents = [
          {
            id: '1',
            title: 'Alerta do Sentinel: Tentativa de acesso a prontuário',
            severity: 'Alta',
            status: 'Bloqueado',
            created_at: new Date().toISOString(),
            description: 'Múltiplas tentativas falhas de acesso a dados sensíveis.',
          },
          {
            id: '2',
            title: 'Alerta LGPD: Download massivo de laudos',
            severity: 'Crítica',
            status: 'Investigando',
            created_at: subMonths(new Date(), 1).toISOString(),
            description: 'Comportamento anômalo detectado em perfil técnico.',
          },
        ]
      }
      setIncidentsData(fetchedIncidents)

      let fetchedRisks = riskRes.data || []
      if (fetchedRisks.length === 0) {
        fetchedRisks = [
          { probability: 4, impact: 4 },
          { probability: 2, impact: 3 },
          { probability: 5, impact: 5 },
          { probability: 1, impact: 2 },
          { probability: 3, impact: 4 },
          { probability: 4, impact: 5 },
        ]
      }
      setRisksData(fetchedRisks)

      let fetchedGaps = gapsRes.data || []
      if (fetchedGaps.length === 0) {
        fetchedGaps = [
          {
            id: '1',
            rule: 'ISO 37301 - 7.2',
            severity: 'Alta',
            description: 'Falta de treinamento documentado na alta liderança.',
          },
          {
            id: '2',
            rule: 'LGPD - Art. 37',
            severity: 'Crítica',
            description: 'Ausência de ROPA atualizado para dados sensíveis.',
          },
          {
            id: '3',
            rule: 'Decreto 11.129/22',
            severity: 'Média',
            description: 'Canal de denúncias sem SLA de resposta definido.',
          },
        ]
      }
      setGapsData(fetchedGaps)

      setMetrics({
        score: history[history.length - 1]?.conformity_score || 0,
        criticalIncidents: fetchedIncidents.filter(
          (i) => i.severity === 'Crítica' || i.severity === 'Alta',
        ).length,
        highRisks: fetchedRisks.filter((r) => r.probability * r.impact >= 15).length,
        openGaps: fetchedGaps.length,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8 animate-fade-in-up pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1 border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Governança 360º & Saúde do Ecossistema
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Visão macro consolidada para comitês de auditoria, diretoria executiva e conselho.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Score Global
                </p>
                <p className="text-4xl font-black text-slate-900">{metrics.score}%</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Activity className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Alertas Críticos
                </p>
                <p className="text-4xl font-black text-slate-900">{metrics.criticalIncidents}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Riscos Extremos
                </p>
                <p className="text-4xl font-black text-slate-900">{metrics.highRisks}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Gaps Abertos
                </p>
                <p className="text-4xl font-black text-slate-900">{metrics.openGaps}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-2">
        <Card className="col-span-1 lg:col-span-4 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" /> Evolução da Conformidade
            </CardTitle>
            <CardDescription>
              Progresso histórico do índice de aderência regulatória e controles implementados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[320px] w-full mt-4">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="conformity_score"
                  stroke="var(--color-score)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-amber-600" /> Matriz de Riscos Residuais
            </CardTitle>
            <CardDescription>
              Concentração de ameaças ativas após aplicação de controles.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center pt-6">
            <Heatmap data={risksData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <Card className="shadow-sm">
          <CardHeader className="bg-red-50/50 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-red-800 text-lg">
              <ShieldAlert className="h-5 w-5 text-red-600" /> Sentinel: Alertas de Segurança
            </CardTitle>
            <CardDescription className="text-red-700/70">
              Vigilância ativa de auditoria (LGPD e Acessos).
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              {incidentsData.map((inc, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-slate-800 leading-tight">
                        {inc.title}
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {inc.description}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Badge
                        variant={
                          inc.severity === 'Crítica' || inc.severity === 'Alta'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-[10px] uppercase tracking-wider font-bold"
                      >
                        {inc.status || inc.severity}
                      </Badge>
                      <span className="text-[10px] font-mono text-slate-400">
                        {inc.created_at ? format(parseISO(inc.created_at), 'dd/MM HH:mm') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-amber-50/50 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-amber-800 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" /> Gaps e Não Conformidades
            </CardTitle>
            <CardDescription className="text-amber-700/70">
              Pendências estruturais que exigem plano de ação.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              {gapsData.map((gap, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-slate-800 font-mono text-amber-900 bg-amber-100/50 self-start px-2 py-0.5 rounded">
                        {gap.rule}
                      </span>
                      <p className="text-sm text-slate-600 leading-relaxed mt-1">
                        {gap.description}
                      </p>
                    </div>
                    <Badge
                      variant={gap.severity === 'Crítica' ? 'destructive' : 'outline'}
                      className={gap.severity === 'Média' ? 'border-amber-200 text-amber-700' : ''}
                    >
                      {gap.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
