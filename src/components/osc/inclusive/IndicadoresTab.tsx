import { LineChart, Users, FileCheck, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function IndicadoresTab({ tenantId }: { tenantId?: string }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Estudos de Caso Ativos</p>
              <h3 className="text-3xl font-bold text-slate-800">42</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-emerald-100 rounded-full">
              <FileCheck className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Cobertura de PAEE/PEI</p>
              <h3 className="text-3xl font-bold text-slate-800">88%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-amber-200 bg-amber-50/30">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-amber-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-amber-800 font-medium">Planos Pendentes de Revisão</p>
              <h3 className="text-3xl font-bold text-amber-900">5</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-blue-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-600" /> Evolução de Atendimentos Especializados
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center border-t bg-slate-50">
          <p className="text-muted-foreground text-sm">
            O gráfico de evolução será carregado assim que houver histórico trimestral suficiente.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
