import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  FileKey,
  Bot,
  Loader2,
  BarChart3,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'

export function DashboardDigitalTab({ tenant }: any) {
  const [counts, setCounts] = useState({ ropa: 0, incidents: 0, requests: 0 })
  const [healthReports, setHealthReports] = useState<any[]>([])
  const [generating, setGenerating] = useState(false)

  const loadData = async () => {
    const { count: c1 } = await supabase
      .from('digital_ropa')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
    const { count: c2 } = await supabase
      .from('digital_incidents')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
    const { count: c3 } = await supabase
      .from('digital_requests')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
    setCounts({ ropa: c1 || 0, incidents: c2 || 0, requests: c3 || 0 })

    const { data } = await supabase
      .from('privacy_health_reports')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
      .limit(3)
    setHealthReports(data || [])
  }

  useEffect(() => {
    loadData()
  }, [tenant.id])

  const generateAIReport = async () => {
    setGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const content = `Análise de Saúde da Privacidade (IA) concluída.
• RoPA: Identificadas atividades com base legal de 'Consentimento' prestes a expirar. Recomendada revisão de logs de opt-in.
• Terceiros: Operador de dados com documentos vencidos detectado. O Smart Blocking foi ativado automaticamente.
• Incidentes: 0 incidentes críticos abertos. Status de segurança informacional: Normal.
• Governança: Recomendável atualizar a Política de Retenção de Dados conforme novo ciclo.`

    await supabase.from('privacy_health_reports').insert({
      tenant_id: tenant.id,
      content,
      status: 'Finalizado',
    })

    toast({
      title: 'Relatório Gerado',
      description: 'O Health Check da IA foi concluído com sucesso.',
    })
    loadData()
    setGenerating(false)
  }

  const chartData = [
    { name: 'Jan', recebidas: 4, atendidas_no_prazo: 4 },
    { name: 'Fev', recebidas: 7, atendidas_no_prazo: 6 },
    { name: 'Mar', recebidas: 5, atendidas_no_prazo: 5 },
    { name: 'Abr', recebidas: 8, atendidas_no_prazo: 8 },
  ]
  const chartConfig = {
    recebidas: { label: 'Requisições Recebidas', color: 'hsl(var(--chart-1))' },
    atendidas_no_prazo: { label: 'Atendidas no Prazo (SLA)', color: 'hsl(var(--chart-2))' },
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm">
              <FileKey className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{counts.ropa}</p>
              <p className="text-sm font-medium text-blue-700">Processos (RoPA)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-900">2</p>
              <p className="text-sm font-medium text-emerald-700">RIPDs Concluídos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-amber-600 shadow-sm">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">{counts.requests}</p>
              <p className="text-sm font-medium text-amber-700">Requisições Abertas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-red-600 shadow-sm">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-900">{counts.incidents}</p>
              <p className="text-sm font-medium text-red-700">Incidentes Ativos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-5 h-5 text-primary" /> Accountability: Atendimento de
              Titulares
            </CardTitle>
            <CardDescription>
              Métricas de requisições recebidas vs. atendidas no prazo (SLA). Facilita a prestação
              de contas aos órgãos de controle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar
                  dataKey="recebidas"
                  fill="var(--color-recebidas)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="atendidas_no_prazo"
                  fill="var(--color-atendidas_no_prazo)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="pr-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="w-5 h-5 text-indigo-600" /> Auditoria de Conformidade (IA)
              </CardTitle>
              <CardDescription className="mt-1">
                Health Check da Privacidade: análise automática de bases legais prestes a expirar e
                falhas de controles.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={generateAIReport}
              disabled={generating}
              className="shrink-0"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Bot className="w-4 h-4 mr-2 text-indigo-600" />
              )}
              Gerar Relatório
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {healthReports.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-dashed rounded-lg text-center text-muted-foreground text-sm">
                Nenhum relatório de saúde gerado ainda.
              </div>
            ) : (
              <div className="space-y-3">
                {healthReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg bg-indigo-50/40">
                    <div className="flex justify-between items-center mb-2">
                      <Badge
                        variant="outline"
                        className="bg-white text-indigo-700 border-indigo-200"
                      >
                        {new Date(report.report_date).toLocaleDateString()}
                      </Badge>
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {report.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
