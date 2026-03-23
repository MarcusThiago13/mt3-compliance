import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Archive, Clock, ShieldCheck, Lock } from 'lucide-react'

export default function ArquivamentoTab({ partnership }: any) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-100 p-4 rounded-lg border border-slate-200">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Archive className="h-5 w-5 mr-2 text-slate-600" />
            Arquivamento e Trilha de Auditoria (Bloco 10)
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Garantia de retenção documental e prova digital do ciclo completo da parceria. O mt3
            preserva todos os extratos, guias, notas e demonstrativos.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-slate-200 text-center py-6">
          <CardContent className="space-y-3">
            <Clock className="h-10 w-10 mx-auto text-blue-500 opacity-80" />
            <h4 className="font-bold text-slate-800">Retenção de 10 Anos</h4>
            <p className="text-xs text-muted-foreground px-4">
              Os dados são mantidos de forma íntegra conforme a exigência de guarda documental
              contada do julgamento das contas.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 text-center py-6">
          <CardContent className="space-y-3">
            <Lock className="h-10 w-10 mx-auto text-emerald-500 opacity-80" />
            <h4 className="font-bold text-slate-800">Imutabilidade Digital</h4>
            <p className="text-xs text-muted-foreground px-4">
              Documentos de despesas elegíveis e movimentações bancárias não podem ser excluídos sem
              registro explícito na trilha de auditoria.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 text-center py-6">
          <CardContent className="space-y-3">
            <ShieldCheck className="h-10 w-10 mx-auto text-purple-500 opacity-80" />
            <h4 className="font-bold text-slate-800">Prova Consolidada</h4>
            <p className="text-xs text-muted-foreground px-4">
              O sistema consolida a relação unívoca entre o documento fiscal, a linha do extrato
              bancário e o relatório final gerado.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200 bg-slate-50/50">
        <CardHeader>
          <CardTitle className="text-lg">Logs Recentes de Auditoria</CardTitle>
          <CardDescription>
            Rastreabilidade de ações críticas dentro desta parceria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-white">
            <p className="text-sm">
              A trilha de auditoria está ativa e registrando eventos operacionais.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
