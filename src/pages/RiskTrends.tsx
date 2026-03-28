import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TrendingUp, BrainCircuit, Activity, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, ComposedChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

interface TrendData {
  projected_scores: { month: string; score: number }[]
  alerts: { title: string; description: string; severity: string; related_risk: string }[]
  summary: string
}

const chartConfig = {
  historical: {
    label: 'Histórico',
    color: 'hsl(var(--primary))',
  },
  projected: {
    label: 'Projetado (IA)',
    color: 'hsl(var(--destructive))',
  },
}

export default function RiskTrends() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [trendData, setTrendData] = useState<TrendData | null>(null)
  const [chartData, setChartData] = useState<any[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: history } = await supabase
        .from('compliance_history')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: true })

      const baseData =
        history && history.length > 0
          ? history.map((h) => ({ month: h.month, historical: h.conformity_score }))
          : [
              { month: 'Jan', historical: 85 },
              { month: 'Fev', historical: 82 },
              { month: 'Mar', historical: 78 },
              { month: 'Abr', historical: 75 },
            ]

      setChartData(baseData)
    } catch (e: any) {
      toast({
        title: 'Erro de sincronização',
        description: 'Falha ao carregar dados históricos.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tenantId) fetchData()
  }, [tenantId])

  const runAnalysis = async () => {
    setAnalyzing(true)
    try {
      const { data, error } = await supabase.functions.invoke('analyze-trends', {
        body: { tenantId, historicalData: chartData },
      })
      if (error) throw new Error(error.message)

      setTrendData(data)

      const lastHistorical = chartData[chartData.length - 1]
      const newChartData = [...chartData]

      newChartData[newChartData.length - 1] = {
        ...lastHistorical,
        projected: lastHistorical.historical,
      }

      if (data.projected_scores) {
        data.projected_scores.forEach((p: any) => {
          newChartData.push({
            month: p.month,
            projected: p.score,
          })
        })
      }

      setChartData(newChartData)
      toast({
        title: 'Análise Concluída',
        description: 'As projeções preditivas foram atualizadas com sucesso.',
      })
    } catch (e: any) {
      toast({ title: 'Erro na Geração IA', description: e.message, variant: 'destructive' })
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading)
    return (
      <div className="p-8">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <TrendingUp className="h-8 w-8" /> Trend Analysis & Predição
          </h2>
          <p className="text-muted-foreground mt-1">
            Motor de inteligência algorítmica para projeção de riscos residuais e antecipação de
            falhas.
          </p>
        </div>
        <Button
          onClick={runAnalysis}
          disabled={analyzing}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 shadow-md"
        >
          {analyzing ? (
            <>
              <Activity className="mr-2 h-5 w-5 animate-spin" /> Inferindo Dados...
            </>
          ) : (
            <>
              <BrainCircuit className="mr-2 h-5 w-5" /> Gerar Projeção de IA
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Trajetória de Conformidade e Riscos</CardTitle>
            <CardDescription>
              Histórico consolidado vs. Projeção Preditiva (Horizonte: 3 meses)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="historical"
                  fill="var(--color-historical)"
                  fillOpacity={0.15}
                  stroke="none"
                />
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="var(--color-historical)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="var(--color-projected)"
                  strokeWidth={3}
                  strokeDasharray="6 6"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="h-full border-t-4 border-t-purple-500 shadow-md flex flex-col">
            <CardHeader className="bg-purple-50/30 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                <BrainCircuit className="h-5 w-5" /> Síntese Executiva
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm leading-relaxed text-slate-700 flex-1 flex flex-col justify-center">
              {trendData?.summary ? (
                <p className="font-medium animate-fade-in">{trendData.summary}</p>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground opacity-60">
                  <Activity className="h-10 w-10 mb-3" />
                  <p>
                    Inicie o processamento da IA para receber o sumário executivo da evolução
                    projetada.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {trendData?.alerts && trendData.alerts.length > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-xl font-bold flex items-center gap-2 mt-8 text-slate-800 border-b pb-2">
            <ShieldAlert className="h-6 w-6 text-amber-500" /> Relatórios de Desvios Preditivos
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2">
            {trendData.alerts.map((alert, idx) => (
              <Card
                key={idx}
                className={`border-l-4 transition-transform hover:-translate-y-1 ${alert.severity === 'Alta' ? 'border-l-red-500 bg-red-50/20' : alert.severity === 'Média' ? 'border-l-amber-500 bg-amber-50/20' : 'border-l-blue-500 bg-blue-50/20'}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant={
                        alert.severity === 'Alta'
                          ? 'destructive'
                          : alert.severity === 'Média'
                            ? 'default'
                            : 'secondary'
                      }
                      className={
                        alert.severity === 'Média' ? 'bg-amber-500 hover:bg-amber-600' : ''
                      }
                    >
                      Severidade: {alert.severity}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold mt-3 leading-tight">
                    {alert.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{alert.description}</p>
                  <div className="text-xs font-semibold text-slate-500 bg-white border p-2 rounded-md truncate">
                    Risco Correlacionado:{' '}
                    <span className="text-slate-800">{alert.related_risk}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
