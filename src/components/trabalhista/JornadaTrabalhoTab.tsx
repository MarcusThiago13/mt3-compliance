import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Clock, AlertCircle, BarChart3 } from 'lucide-react'

export function JornadaTrabalhoTab({ tenant }: any) {
  return (
    <Card className="animate-in fade-in shadow-sm border-slate-200">
      <CardHeader className="border-b bg-slate-50/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-primary" /> Governança de Jornada e Ponto
        </CardTitle>
        <CardDescription>
          Auditoria sobre escalas, compensações, banco de horas e controle de exceções para evitar
          passivos trabalhistas.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4 bg-red-50 border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-800">Alerta: Interjornada não respeitada</p>
              <p className="text-xs text-red-700 mt-1">
                Foram detectadas 12 ocorrências de descanso entre jornadas menor que 11 horas no
                último período.
              </p>
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-amber-50 border-amber-100 flex items-start gap-3">
            <BarChart3 className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-800">Acúmulo Crítico de Banco de Horas</p>
              <p className="text-xs text-amber-700 mt-1">
                3 colaboradores ultrapassaram o limite de 40h positivas e precisam de plano de
                compensação.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50">
          <Clock className="w-12 h-12 mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-700 mb-1">
            Integração de Ponto Eletrônico (REP)
          </h3>
          <p className="text-sm max-w-md">
            Conecte seu sistema de ponto via API para que o mt3 monitore automaticamente as exceções
            e consolide as evidências probatórias de jornada.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
