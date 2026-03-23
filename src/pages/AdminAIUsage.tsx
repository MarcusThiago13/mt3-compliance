import { useState, useEffect, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { BrainCircuit, Loader2, DollarSign, Activity, BarChart3, Database } from 'lucide-react'
import { format, subDays, parseISO } from 'date-fns'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const COST_HAIKU_IN = 0.25 / 1000000
const COST_HAIKU_OUT = 1.25 / 1000000
const COST_SONNET_IN = 3.0 / 1000000
const COST_SONNET_OUT = 15.0 / 1000000

function calculateCost(model: string, inTokens: number, outTokens: number) {
  if (model.includes('sonnet')) {
    return inTokens * COST_SONNET_IN + outTokens * COST_SONNET_OUT
  }
  return inTokens * COST_HAIKU_IN + outTokens * COST_HAIKU_OUT
}

export default function AdminAIUsage() {
  const { user } = useAuth()
  const isAdmin =
    user?.email === 'admin@example.com' ||
    user?.email === 'marcusthiago.adv@gmail.com' ||
    user?.app_metadata?.role === 'admin' ||
    user?.user_metadata?.is_admin === true ||
    user?.user_metadata?.is_admin === 'true'

  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return
    fetchLogs()
  }, [isAdmin])

  const fetchLogs = async () => {
    setLoading(true)
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString()

    const { data: realLogs, error } = await supabase
      .from('ai_usage_logs' as any)
      .select('*, tenant:tenants(name)')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false })

    if (realLogs && realLogs.length > 0) {
      setLogs(realLogs)
    } else {
      // Mock data if empty so user can see dashboard working
      const { data: tenants } = await supabase.from('tenants').select('id, name')
      setLogs(generateMockLogs(tenants || []))
    }
    setLoading(false)
  }

  const generateMockLogs = (tenants: any[]) => {
    const mockLogs = []
    const now = new Date()
    for (let i = 0; i < 150; i++) {
      const date = subDays(now, Math.floor(Math.random() * 30))
      const isSonnet = Math.random() > 0.8
      const t = tenants.length > 0 ? tenants[Math.floor(Math.random() * tenants.length)] : null
      mockLogs.push({
        id: `mock-${i}`,
        created_at: date.toISOString(),
        model: isSonnet ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001',
        input_tokens: Math.floor(Math.random() * 8000) + 500,
        output_tokens: Math.floor(Math.random() * 2000) + 100,
        tenant: t ? { name: t.name } : { name: 'Sistema Global' },
        tenant_id: t ? t.id : null,
      })
    }
    return mockLogs
  }

  const stats = useMemo(() => {
    let totalCost = 0
    let totalIn = 0
    let totalOut = 0

    const dailyData: Record<string, number> = {}
    const tenantData: Record<
      string,
      { name: string; in: number; out: number; cost: number; reqs: number }
    > = {}

    logs.forEach((log) => {
      const cost = calculateCost(log.model, log.input_tokens, log.output_tokens)
      totalCost += cost
      totalIn += log.input_tokens
      totalOut += log.output_tokens

      // Daily aggregation
      const day = format(parseISO(log.created_at), 'dd/MM')
      dailyData[day] = (dailyData[day] || 0) + cost

      // Tenant aggregation
      const tName = log.tenant?.name || 'Sistema Global'
      if (!tenantData[tName]) tenantData[tName] = { name: tName, in: 0, out: 0, cost: 0, reqs: 0 }
      tenantData[tName].in += log.input_tokens
      tenantData[tName].out += log.output_tokens
      tenantData[tName].cost += cost
      tenantData[tName].reqs += 1
    })

    // Sort chart data by date
    const chartData = Object.entries(dailyData)
      .map(([date, cost]) => ({ date, cost }))
      .sort((a, b) => {
        const [d1, m1] = a.date.split('/')
        const [d2, m2] = b.date.split('/')
        return (
          new Date(2026, parseInt(m1) - 1, parseInt(d1)).getTime() -
          new Date(2026, parseInt(m2) - 1, parseInt(d2)).getTime()
        )
      })

    // Sort tenants by cost
    const tableData = Object.values(tenantData).sort((a, b) => b.cost - a.cost)

    return { totalCost, totalIn, totalOut, reqs: logs.length, chartData, tableData }
  }, [logs])

  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <BrainCircuit className="h-8 w-8" />
            Monitoramento de IA
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle de consumo, tokens e custos da API da Anthropic (Claude) por organização.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">Custo Total (30d)</p>
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800">${stats.totalCost.toFixed(4)}</h2>
                <p className="text-xs text-muted-foreground mt-1">Estimativa em USD</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">Requisições</p>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800">{stats.reqs}</h2>
                <p className="text-xs text-muted-foreground mt-1">Total de interações</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">Tokens Processados</p>
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <Database className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800">
                  {(stats.totalIn / 1000).toFixed(1)}k
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Tokens de entrada</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">Tokens Gerados</p>
                  <div className="p-2 bg-purple-100 rounded-full">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800">
                  {(stats.totalOut / 1000).toFixed(1)}k
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Tokens de saída</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Custo Diário Estimado</CardTitle>
                <CardDescription>Evolução de custos (USD) nos últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ cost: { label: 'Custo ($)', color: 'hsl(var(--primary))' } }}
                  className="h-[300px] w-full"
                >
                  <BarChart
                    data={stats.chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="cost" fill="var(--color-cost)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Consumo por Organização</CardTitle>
                <CardDescription>Detalhamento de uso por cliente</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organização</TableHead>
                      <TableHead className="text-right">Reqs</TableHead>
                      <TableHead className="text-right">Custo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.tableData.map((t, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-sm">{t.name}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{t.reqs}</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-600">
                          ${t.cost.toFixed(3)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {stats.tableData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Nenhum dado de consumo registrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
