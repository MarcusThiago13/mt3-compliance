import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart3, TrendingUp } from 'lucide-react'

export default function IndicadoresTab({ tenantId }: { tenantId: string }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-lg font-bold text-slate-800 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-blue-600" /> Indicadores de Qualidade e Conformidade
      </h3>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="shadow-sm border-emerald-100 bg-emerald-50/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm font-semibold text-emerald-800 uppercase mb-2">
              Cobertura de PEI
            </p>
            <h3 className="text-4xl font-bold text-emerald-700">100%</h3>
            <p className="text-xs text-emerald-600 mt-2 flex items-center justify-center">
              <TrendingUp className="h-3 w-3 mr-1" /> Dentro da meta MEC
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-100 bg-blue-50/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm font-semibold text-blue-800 uppercase mb-2">
              Profissionais Habilitados
            </p>
            <h3 className="text-4xl font-bold text-blue-700">2/2</h3>
            <p className="text-xs text-blue-600 mt-2">100% Adequação</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6 text-center">
            <p className="text-sm font-semibold text-slate-600 uppercase mb-2">
              Casos Ativos (PAEE)
            </p>
            <h3 className="text-4xl font-bold text-slate-800">14</h3>
            <p className="text-xs text-slate-500 mt-2">Mapeados no Censo</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>
            O dashboard detalhado de métricas de acessibilidade e proficiência está sendo compilado
            com base nos Planos Individuais ativos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
