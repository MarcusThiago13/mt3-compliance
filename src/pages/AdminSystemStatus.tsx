import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Clock, Server, ShieldAlert } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { format, subDays, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface ErrorLog {
  id: string
  error_message: string
  created_at: string
  status: string
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
  const [errorChartData, setErrorChartData] = useState<DailyError[]>([])
  const [activityChartData, setActivityChartData] = useState<TenantActivity[]>([])
  const [apiPerformance, setApiPerformance] = useState<any[]>([])
  const [metrics, setMetrics] = useState({
    totalErrors: 0,
    activeTenants: 0,
    totalActions: 0,
    avgResponseTime: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const thirtyDaysAgo = subDays(new Date(), 30).toISOString()
      const sevenDaysAgo = subDays(new Date(), 7).toISOString()

      const [errorsRes, tenantsRes, auditRes] = await Promise.all([
        supabase
          .from('system_errors')
          .select('*')
          .gte('created_at', thirtyDaysAgo)
          .order('created_at', { ascending: false }),
        supabase.from('tenants').select('id, name'),
        supabase.from('audit_logs').select('tenant_id, created_at').gte('created_at', sevenDaysAgo),
      ])

      const errors = errorsRes.data || []
      const tenants = tenantsRes.data || []
      const audits = auditRes.data || []

      setRecentErrors(errors.slice(0, 5))

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <h2 className="text-3xl font-bold tracking-tight text-primary">Saúde do Sistema</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros Capturados (30d)</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalErrors}</div>
            <p className="text-xs text-muted-foreground mt-1">Exceções no backend</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de API</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime} ms</div>
            <p className="text-xs text-muted-foreground mt-1">Nas últimas 24 horas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizações Ativas (7d)</CardTitle>
            <Server className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeTenants}</div>
            <p className="text-xs text-muted-foreground mt-1">Tenants com interações</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações de Auditoria (7d)</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalActions}</div>
            <p className="text-xs text-muted-foreground mt-1">Eventos registrados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Métricas de Erro (Últimos 7 dias)</CardTitle>
            <CardDescription>
              Volume de incidentes capturados pelo serviço de monitoramento
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
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

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Volume de Acessos por Tenant</CardTitle>
            <CardDescription>Top 5 organizações mais ativas (7 dias)</CardDescription>
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
            <CardTitle>Performance de APIs</CardTitle>
            <CardDescription>Tempo de resposta médio (ms) ao longo das últimas 24h</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={apiPerformance} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  minTickGap={30}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="responseTime"
                  stroke="var(--color-responseTime)"
                  fill="var(--color-responseTime)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Logs de Erro Recentes</CardTitle>
            <CardDescription>Últimas exceções não tratadas</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {recentErrors.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Nenhum erro recente encontrado.
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
                      className="text-sm font-medium line-clamp-2 text-foreground/80"
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
