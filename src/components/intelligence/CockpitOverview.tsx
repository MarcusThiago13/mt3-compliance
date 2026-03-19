import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Target, ShieldCheck, AlertTriangle, FileCheck2, Scale, BarChart } from 'lucide-react'

export function CockpitOverview() {
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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Target className="h-5 w-5 text-muted-foreground" /> Progresso por Pilares ISO 37301
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Módulo 4: Contexto', val: 100 },
              { label: 'Módulo 5: Liderança', val: 100 },
              { label: 'Módulo 6: Planejamento', val: 70 },
              { label: 'Módulo 7: Apoio', val: 85 },
              { label: 'Módulo 8: Operação', val: 80 },
              { label: 'Módulo 9: Avaliação', val: 90 },
              { label: 'Módulo 10: Melhoria', val: 100 },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.val}%</span>
                </div>
                <Progress value={item.val} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <BarChart className="h-5 w-5 text-muted-foreground" /> Eixos do Decreto 11.129/22
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Comprometimento e Governança (I, IX)', val: 100 },
              { label: 'Políticas e Treinamentos (II, III, IV)', val: 80 },
              { label: 'Gestão de Riscos (V, XIV)', val: 95 },
              { label: 'Controles e Registros (VI, VII, VIII)', val: 90 },
              { label: 'Canal, Investigação e Sanção (X, XI, XII)', val: 100 },
              { label: 'Terceiros (Due Diligence) (XIII)', val: 70 },
              { label: 'Monitoramento (XV)', val: 100 },
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

            <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
              O programa possui aderência sólida à norma brasileira. A maior vulnerabilidade atual
              encontra-se no eixo de <strong>Terceiros (Due Diligence)</strong>, devido ao atraso
              nas avaliações de fornecedores críticos.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
