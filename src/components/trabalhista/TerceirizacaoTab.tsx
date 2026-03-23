import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Briefcase, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function TerceirizacaoTab({ tenant }: any) {
  return (
    <Card className="animate-in fade-in shadow-sm border-slate-200">
      <CardHeader className="border-b bg-slate-50/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Briefcase className="w-5 h-5 text-primary" /> Fiscalização de Terceirizados e Contratos
        </CardTitle>
        <CardDescription>
          Mitigação do risco de responsabilização subsidiária/solidária através da auditoria de
          documentos trabalhistas e previdenciários dos prestadores.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center p-5 border rounded-xl bg-slate-50 shadow-sm gap-4">
            <div>
              <p className="font-bold text-slate-800 text-base">Limpeza & Conservação Ltda</p>
              <p className="text-xs text-muted-foreground mt-1">
                CNPJ: 11.222.333/0001-44 • Contrato Nº 012/2025
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline" className="text-[10px] bg-white">
                  GFIP / SEFIP
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-white">
                  Folha Pgto
                </Badge>
              </div>
            </div>
            <div className="sm:text-right flex flex-col items-start sm:items-end">
              <Badge
                variant="outline"
                className="border-amber-300 text-amber-800 bg-amber-100 mb-1 px-3 py-1"
              >
                <AlertTriangle className="w-3 h-3 mr-1.5" /> Pendência: CND INSS
              </Badge>
              <p className="text-xs font-semibold text-muted-foreground mt-1">
                Competência Exigida: 02/2026
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center p-5 border rounded-xl bg-slate-50 shadow-sm gap-4 border-emerald-100">
            <div>
              <p className="font-bold text-slate-800 text-base">Segurança Armada Brasil S.A.</p>
              <p className="text-xs text-muted-foreground mt-1">
                CNPJ: 55.666.777/0001-88 • Contrato Nº 045/2024
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline" className="text-[10px] bg-white">
                  GFIP / SEFIP
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-white">
                  Folha Pgto
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-white">
                  FGTS
                </Badge>
              </div>
            </div>
            <div className="sm:text-right flex flex-col items-start sm:items-end">
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none mb-1 px-3 py-1">
                <CheckCircle2 className="w-3 h-3 mr-1.5" /> Documentação Validada
              </Badge>
              <p className="text-xs font-semibold text-muted-foreground mt-1">
                Competência: 02/2026
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
