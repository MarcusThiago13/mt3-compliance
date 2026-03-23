import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShieldPlus, FileText, CalendarRange } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function SSTTab({ tenant }: any) {
  return (
    <Card className="animate-in fade-in shadow-sm border-slate-200">
      <CardHeader className="border-b bg-slate-50/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldPlus className="w-5 h-5 text-primary" /> Saúde e Segurança do Trabalho (SST) &
          eSocial
        </CardTitle>
        <CardDescription>
          Gestão de riscos ocupacionais, documentação técnica (PGR, PCMSO) e integração de eventos
          (S-2210, S-2220, S-2240).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <h4 className="font-semibold text-slate-800 mb-4 border-b pb-2">Programas Base de SST</h4>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center p-4 border border-emerald-200 bg-emerald-50 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-md shadow-sm">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-emerald-900 text-sm">
                  PGR - Programa de Gerenciamento de Riscos
                </p>
                <p className="text-xs text-emerald-700 flex items-center mt-1">
                  <CalendarRange className="w-3 h-3 mr-1" /> Válido até 12/2026
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-600">Vigente</Badge>
          </div>

          <div className="flex justify-between items-center p-4 border border-emerald-200 bg-emerald-50 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-md shadow-sm">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-emerald-900 text-sm">
                  PCMSO - Programa de Controle Médico
                </p>
                <p className="text-xs text-emerald-700 flex items-center mt-1">
                  <CalendarRange className="w-3 h-3 mr-1" /> Válido até 10/2026
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-600">Vigente</Badge>
          </div>
        </div>

        <h4 className="font-semibold text-slate-800 mb-4 border-b pb-2">
          Transmissão eSocial (Últimos Eventos)
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 border rounded bg-slate-50 text-sm">
            <span className="font-medium text-slate-700">
              S-2220 - Monitoramento da Saúde do Trabalhador (ASOs)
            </span>
            <Badge className="bg-blue-100 text-blue-800 border-none">Processado com Sucesso</Badge>
          </div>
          <div className="flex justify-between items-center p-3 border rounded bg-slate-50 text-sm">
            <span className="font-medium text-slate-700">
              S-2240 - Condições Ambientais do Trabalho (Fatores de Risco)
            </span>
            <Badge className="bg-blue-100 text-blue-800 border-none">Processado com Sucesso</Badge>
          </div>
          <div className="flex justify-between items-center p-3 border border-red-200 bg-red-50 rounded text-sm">
            <span className="font-medium text-red-800">
              S-2210 - Comunicação de Acidente de Trabalho (CAT)
            </span>
            <Badge variant="destructive" className="border-none">
              Erro de Validação
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
