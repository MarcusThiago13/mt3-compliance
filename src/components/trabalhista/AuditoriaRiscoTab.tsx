import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Target, Activity, AlertCircle, FileSearch } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function AuditoriaRiscoTab({ tenant }: any) {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-red-50/50 border-red-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-red-600 shadow-sm">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-900">1</p>
              <p className="text-sm font-medium text-red-700">Riscos Laborais Críticos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-amber-600 shadow-sm">
              <FileSearch className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">2</p>
              <p className="text-sm font-medium text-amber-700">Não Conformidades (CAPA)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-900">94%</p>
              <p className="text-sm font-medium text-emerald-700">Índice de Conformidade</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-primary" /> Matriz de Riscos Trabalhistas
          </CardTitle>
          <CardDescription>
            Riscos específicos decorrentes de relações de trabalho, terceirização e SST mapeados na
            matriz principal.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg gap-4 bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="destructive" className="border-none">
                    Risco Alto
                  </Badge>
                  <span className="text-sm font-semibold text-slate-800">
                    Passivo Trabalhista por Horas Extras Não Pagas
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Falta de controle efetivo sobre jornadas em campo e ausência de regras claras de
                  banco de horas em filiais remotas.
                </p>
              </div>
              <div className="shrink-0 text-sm text-right">
                <p className="font-semibold text-slate-700">Impacto: 4 | Prob: 4</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Controle: Política v2.1 em revisão
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg gap-4 bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">
                    Risco Médio
                  </Badge>
                  <span className="text-sm font-semibold text-slate-800">
                    Responsabilização Subsidiária - Empresa Terceirizada Limpeza
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Prestador "Limpeza & Conservação Ltda" com histórico de atraso na entrega de CND e
                  SEFIP.
                </p>
              </div>
              <div className="shrink-0 text-sm text-right">
                <p className="font-semibold text-slate-700">Impacto: 3 | Prob: 3</p>
                <p className="text-xs text-muted-foreground mt-1">Controle: Retenção de Fatura</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
