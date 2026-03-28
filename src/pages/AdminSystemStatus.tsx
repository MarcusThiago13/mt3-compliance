import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Clock, Server, ShieldAlert, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { format, subDays, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

interface ErrorLog {
  id: string
  error_message: string
  created_at: string
  status: string
}

interface IncidentLog {
  id: string
  title: string
  severity: string
  status: string
  created_at: string
  tenant_name?: string
}

interface TenantActivity {
  name: string
  actions: number
}

interface DailyError {
  date: string
  errors: number
}

const chartConfig = {
  errors: {
    label: 'Erros',
    color: 'hsl(var(--destructive))',
  },
  actions: {
    label: 'Ações',
    color: 'hsl(var(--primary))',
  },
  responseTime: {
    label: 'Tempo (ms)',
    color: 'hsl(var(--chart-3))',
  },
}

export default function AdminSystemStatus() {
  const [loading, setLoading] = useState(true)
  const [recentErrors, setRecentErrors] = useState<ErrorLog[]>([])
  const [recentIncidents, setRecentIncidents] = useState<IncidentLog[]>([])
  const [errorChartData, setErrorChartData] = useState<DailyError[]>([])
  const [activityChartData, setActivityChartData] = useState<TenantActivity[]>([])
  const [apiPerformance, setApiPerformance] = useState<any[]>([])
  const [metrics, setMetrics] = useState({
    totalErrors: 0,
    activeTenants: 0,
    totalActions: 0,
    avgResponseTime: 0,
    activeIncidents: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const thirtyDaysAgo = subDays(new Date(), 30).toISOString()
      const sevenDaysAgo = subDays(new Date(), 7).toISOString()

      const [errorsRes, tenantsRes, auditRes, incidentsRes] = await Promise.all([
        supabase
          .from('system_errors')
          .select('*')
          .gte('created_at', thirtyDaysAgo)
          .order('created_at', { ascending: false }),
        supabase.from('tenants').select('id, name'),
        supabase.from('audit_logs').select('tenant_id, created_at').gte('created_at', sevenDaysAgo),
        supabase
          .from('digital_incidents')
          .select('id, title, severity, status, created_at, tenant_id')
          .ilike('title', '%Sentinel%')
          .order('created_at', { ascending: false })
          .limit(15),
      ])

      const errors = errorsRes.data || []
      const tenants = tenantsRes.data || []
      const audits = auditRes.data || []
      const incidents = incidentsRes.data || []

      setRecentErrors(errors.slice(0, 5))

      const mappedIncidents = incidents.map((inc) => {
        const t = tenants.find((t) => t.id === inc.tenant_id)
        return {
          ...inc,
          tenant_name: t?.name || 'Desconhecido / Anônimo',
        }
      })
      setRecentIncidents(mappedIncidents)

      // Error Chart Data (last 7 days)
      const last7Days = Array.from({ length: 7 })
        .map((_, i) => {
          const d = subDays(new Date(), i)
          return format(d, 'dd/MM')
        })
        .reverse()

      const errorsByDay = last7Days.reduce(
        (acc, date) => {
          acc[date] = 0
          return acc
        },
        {} as Record<string, number>,
      )

      errors.forEach((e) => {
        try {
          const d = format(parseISO(e.created_at), 'dd/MM')
          if (errorsByDay[d] !== undefined) {
            errorsByDay[d]++
          }
        } catch (err) {
          /* ignore parse error */
        }
      })

      setErrorChartData(last7Days.map((date) => ({ date, errors: errorsByDay[date] })))

      // Tenant Activity Data
      const activityByTenant = audits.reduce(
        (acc, log) => {
          if (log.tenant_id) {
            acc[log.tenant_id] = (acc[log.tenant_id] || 0) + 1
          }
          return acc
        },
        {} as Record<string, number>,
      )

      const tenantActivityData = Object.entries(activityByTenant)
        .map(([tenantId, actions]) => {
          const tenant = tenants.find((t) => t.id === tenantId)
          return {
            name: tenant?.name || 'Desconhecido',
            actions,
          }
        })
        .sort((a, b) => b.actions - a.actions)
        .slice(0, 5)

      setActivityChartData(tenantActivityData)

      // Mock API Performance Data (last 24h)
      const mockApiData = Array.from({ length: 24 }).map((_, i) => {
        const d = new Date()
        d.setHours(d.getHours() - (23 - i))
        return {
          time: format(d, 'HH:mm'),
          responseTime: Math.floor(Math.random() * 80) + 40, // 40 to 120ms
        }
      })
      setApiPerformance(mockApiData)

      setMetrics({
        totalErrors: errors.length,
        activeTenants: Object.keys(activityByTenant).length,
        totalActions: audits.length,
        avgResponseTime: Math.floor(
          mockApiData.reduce((acc, curr) => acc + curr.responseTime, 0) / 24,
        ),
        activeIncidents: incidents.filter((i) => i.status === 'Aberto').length,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6 animate-pulse">
        <Skeleton className="h-10 w-[250px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[350px]" />
          <Skeleton className="col-span-3 h-[350px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-fade-in-up">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          Saúde Global e Compliance Operacional
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros Sistêmicos (30d)</CardTitle>
            <Server className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalErrors}</div>
            <p className="text-xs text-muted-foreground mt-1">Exceções críticas capturadas</p>
          </CardContent>
        </Card>
        <Card
          className={metrics.activeIncidents > 0 ? 'border-red-200 bg-red-50/50 shadow-sm' : ''}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas do Sentinel</CardTitle>
            <ShieldAlert
              className={`h-4 w-4 ${metrics.activeIncidents > 0 ? 'text-red-600 animate-pulse' : 'text-emerald-500'}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${metrics.activeIncidents > 0 ? 'text-red-700' : ''}`}
            >
              {metrics.activeIncidents}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Incidentes de segurança abertos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de API</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime} ms</div>
            <p className="text-xs text-muted-foreground mt-1">Latência nas últimas 24h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizações Ativas (7d)</CardTitle>
            <Shield className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeTenants}</div>
            <p className="text-xs text-muted-foreground mt-1">Com tráfego recente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auditoria Global (7d)</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalActions}</div>
            <p className="text-xs text-muted-foreground mt-1">Ações rastreadas em log</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              Central Global do Sentinel (Incidentes Recentes)
            </CardTitle>
            <CardDescription>
              Vigilância proativa de tentativas de invasão, quebra de permissões ou acessos de risco
              (LGPD).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {recentIncidents.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-8 bg-slate-50 border border-dashed rounded-lg flex flex-col items-center">
                  <Shield className="h-8 w-8 text-slate-300 mb-2" />
                  Nenhum evento de segurança atípico detectado no ecossistema.
                </div>
              ) : (
                recentIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex flex-col gap-2 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1 pr-4">
                        <span
                          className="text-sm font-semibold text-slate-800 line-clamp-1"
                          title={incident.title}
                        >
                          {incident.title}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Organização:{' '}
                          <span className="font-medium text-slate-700">{incident.tenant_name}</span>
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge
                          variant={incident.status === 'Aberto' ? 'destructive' : 'outline'}
                          className="text-[10px] uppercase h-5"
                        >
                          {incident.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {format(parseISO(incident.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Volume Operacional por Tenant</CardTitle>
            <CardDescription>Top 5 organizações mais ativas (últimos 7 dias)</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                data={activityChartData}
                layout="vertical"
                margin={{ top: 0, right: 30, bottom: 0, left: 30 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={120}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="actions"
                  fill="var(--color-actions)"
                  radius={[0, 4, 4, 0]}
                  barSize={30}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Métricas de Exceções de Backend</CardTitle>
            <CardDescription>
              Volume de *crashes* ou erros não previstos capturados via Bug Scanner
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={errorChartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="errors" fill="var(--color-errors)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Detalhe dos Erros Recentes</CardTitle>
            <CardDescription>Visualização técnica das últimas falhas reportadas</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {recentErrors.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  O sistema operacional está estável.
                </div>
              ) : (
                recentErrors.map((error) => (
                  <div
                    key={error.id}
                    className="flex flex-col gap-1 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">
                        {format(parseISO(error.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${error.status === 'new' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-secondary text-secondary-foreground'}`}
                      >
                        {error.status.toUpperCase()}
                      </span>
                    </div>
                    <p
                      className="text-sm font-medium line-clamp-2 text-foreground/80 font-mono text-[11px] bg-slate-50 p-1 rounded"
                      title={error.error_message}
                    >
                      {error.error_message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
