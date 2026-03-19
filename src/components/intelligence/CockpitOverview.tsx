import { useEffect, useState } from 'react'
import { complianceService } from '@/services/compliance'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Target,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Scale,
  BarChart as BarChartIcon,
  TrendingUp,
  Calendar,
} from 'lucide-react'

export function CockpitOverview() {
  const [history, setHistory] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])

  useEffect(() => {
    complianceService.getComplianceHistory().then(setHistory)
    complianceService.getPendingAssessments().then(setAssessments)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full shrink-0">
              <ShieldCheck className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">ISO 37301:2021</p>
              <p className="text-2xl font-bold text-blue-900">85%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full shrink-0">
              <Scale className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Decreto 11.129</p>
              <p className="text-2xl font-bold text-emerald-900">92%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Gaps Abertos</p>
              <p className="text-2xl font-bold text-amber-900">3</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full shrink-0">
              <FileCheck2 className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Prontidão (Audit)</p>
              <p className="text-2xl font-bold text-purple-900">Alta</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" /> Evolução Histórica (AI Score)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <ChartContainer
                config={{ score: { label: 'Conformidade (%)', color: 'hsl(var(--primary))' } }}
                className="h-[250px] w-full"
              >
                <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="conformity_score"
                    stroke="var(--color-score)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Carregando dados...
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" /> Auto-Avaliações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assessments.map((a) => {
              const isPast = new Date(a.next_review_date) < new Date()
              return (
                <div
                  key={a.id}
                  className="flex justify-between items-center text-sm border-b pb-2 last:border-0"
                >
                  <span className="font-medium">Item {a.clause_id}</span>
                  <span
                    className={isPast ? 'text-destructive font-semibold' : 'text-muted-foreground'}
                  >
                    {new Date(a.next_review_date).toLocaleDateString()}
                  </span>
                </div>
              )
            })}
            {assessments.length === 0 && (
              <div className="text-center p-4 text-muted-foreground">Nenhuma revisão agendada.</div>
            )}

            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <BarChartIcon className="h-4 w-4 text-muted-foreground" /> Eixos do Decreto
                11.129/22
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Gestão de Riscos (V, XIV)', val: 95 },
                  { label: 'Terceiros (Due Diligence) (XIII)', val: 70 },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-muted-foreground">{item.val}%</span>
                    </div>
                    <Progress
                      value={item.val}
                      className="h-2 [&>div]:bg-emerald-500 bg-emerald-100/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
