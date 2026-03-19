import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Activity, ClipboardCheck, TrendingUp, AlertTriangle, LineChart } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const complianceTrend = [
  { month: 'Jan', conformity: 82, deviations: 18 },
  { month: 'Fev', conformity: 85, deviations: 15 },
  { month: 'Mar', conformity: 84, deviations: 16 },
  { month: 'Abr', conformity: 89, deviations: 11 },
  { month: 'Mai', conformity: 92, deviations: 8 },
  { month: 'Jun', conformity: 95, deviations: 5 },
]

const subItems = [
  {
    id: '9.1',
    title: 'Monitoramento, medição e análise',
    status: 'Conforme',
    metric: '15 KPIs Ativos',
  },
  { id: '9.2', title: 'Auditoria Interna', status: 'Atenção', metric: '2 Achados Pendentes' },
  { id: '9.3', title: 'Revisão pela Direção', status: 'Conforme', metric: 'Realizada em 10/Out' },
]

export function Module9Overview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Visão Geral: Módulo 9 (Avaliação de Desempenho)</h3>
          <p className="text-sm text-muted-foreground">
            Painel consolidado de KPIs, desempenho do SGC, auditorias e análise crítica da direção.
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full shrink-0">
              <TrendingUp className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Índice Global</p>
              <p className="text-2xl font-bold">95%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full shrink-0">
              <LineChart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">KPIs Monitorados</p>
              <p className="text-2xl font-bold">15</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full shrink-0">
              <ClipboardCheck className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Auditorias</p>
              <p className="text-2xl font-bold">3/Ano</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Não Conformidades</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" /> Status de Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border"
                >
                  <div>
                    <div className="font-semibold text-sm">
                      <span className="text-primary mr-1">{item.id}</span>
                      {item.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{item.metric}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      item.status === 'Conforme'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md">Tendência de Conformidade (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                conformity: { label: 'Conformidade', color: 'hsl(var(--success))' },
                deviations: { label: 'Desvios', color: 'hsl(var(--destructive))' },
              }}
              className="h-[200px] w-full"
            >
              <BarChart
                data={complianceTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="conformity"
                  stackId="a"
                  fill="var(--color-conformity)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="deviations"
                  stackId="a"
                  fill="var(--color-deviations)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
