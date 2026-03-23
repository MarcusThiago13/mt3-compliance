import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Lock, AlertTriangle, CheckCircle2, SearchX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function FechamentoMensalTab({ partnership, accountability }: any) {
  const [lines, setLines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('osc_bank_statement_lines')
      .select('*')
      .eq('partnership_id', partnership.id)

    if (data) setLines(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [partnership.id])

  const pendingLines = lines.filter((l) => l.status === 'Importada')
  const restitutionPending = lines.filter((l) => l.status === 'Aguardando Restituição')
  const reconciledLines = lines.filter((l) => l.status === 'Conciliada')

  const hasExtrato = lines.length > 0
  const canClose = pendingLines.length === 0 && restitutionPending.length === 0 && hasExtrato
  const isClosed = accountability?.status === 'Enviada' || accountability?.status === 'Aprovada'

  const handleCloseMonth = async () => {
    if (!canClose) {
      toast({
        title: 'Bloqueio de Fechamento',
        description: 'Existem pendências financeiras ou de restituição no extrato.',
        variant: 'destructive',
      })
      return
    }

    setIsClosing(true)
    const { error } = await supabase
      .from('osc_partnership_accountability')
      .update({ status: 'Enviada', updated_at: new Date().toISOString() })
      .eq('id', accountability.id)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({
        title: 'Mês Encerrado',
        description:
          'O período foi consolidado com sucesso e os dados foram travados para auditoria.',
      })
      // Trigger a reload or state update in parent ideally, but for now we reload window or just assume it updates via prop eventually
      window.location.reload()
    }
    setIsClosing(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-lg border border-dashed">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Lock className="h-5 w-5 mr-2 text-slate-600" />
            Fechamento de Competência e Travamento
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Validação automatizada das obrigações extrato-cêntricas. O fechamento só é permitido sem
            pendências na conciliação.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Checklist de Conformidade Financeira</CardTitle>
            <CardDescription>Critérios bloqueantes para submissão do relatório.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50">
              <div className="flex items-center gap-2">
                {hasExtrato ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                <span className="text-sm font-medium">Extrato Bancário Importado</span>
              </div>
              <Badge
                variant={hasExtrato ? 'default' : 'secondary'}
                className={hasExtrato ? 'bg-emerald-100 text-emerald-800' : ''}
              >
                {hasExtrato ? `${lines.length} linhas` : 'Pendente'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50">
              <div className="flex items-center gap-2">
                {pendingLines.length === 0 && hasExtrato ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <SearchX className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm font-medium">Classificação de Movimentações</span>
              </div>
              <Badge
                variant="outline"
                className={
                  pendingLines.length > 0
                    ? 'text-red-700 bg-red-50 border-red-200'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }
              >
                {pendingLines.length} pendentes
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50">
              <div className="flex items-center gap-2">
                {restitutionPending.length === 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                <span className="text-sm font-medium">
                  Saneamento e Restituições (Recursos Próprios)
                </span>
              </div>
              <Badge
                variant="outline"
                className={
                  restitutionPending.length > 0
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }
              >
                {restitutionPending.length} exigem devolução
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`shadow-sm border-2 ${canClose && !isClosed ? 'border-emerald-400 bg-emerald-50/20' : isClosed ? 'border-slate-300 bg-slate-50' : 'border-red-200 bg-red-50/20'}`}
        >
          <CardHeader>
            <CardTitle className="text-lg">Ação de Fechamento</CardTitle>
            <CardDescription>Encerrar a competência e gerar Snapshot Auditável.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4 py-8">
            {isClosed ? (
              <>
                <Lock className="h-12 w-12 text-slate-400" />
                <div>
                  <h3 className="font-bold text-slate-700">Período Fechado</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    A prestação de contas foi submetida ou aprovada. Alterações estão bloqueadas.
                  </p>
                </div>
              </>
            ) : canClose ? (
              <>
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <div>
                  <h3 className="font-bold text-emerald-800">Pronto para Fechamento</h3>
                  <p className="text-sm text-emerald-700 mt-1">
                    Todas as {reconciledLines.length} linhas do extrato foram tratadas.
                  </p>
                </div>
                <Button
                  onClick={handleCloseMonth}
                  disabled={isClosing}
                  className="bg-emerald-600 hover:bg-emerald-700 w-full max-w-xs mt-4"
                >
                  {isClosing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  Consolidar e Fechar Mês
                </Button>
              </>
            ) : (
              <>
                <AlertTriangle className="h-12 w-12 text-red-400" />
                <div>
                  <h3 className="font-bold text-red-800">Fechamento Bloqueado</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Resolva todas as pendências no checklist lateral antes de encerrar o mês.
                  </p>
                </div>
                <Button disabled className="w-full max-w-xs mt-4 opacity-50">
                  <Lock className="mr-2 h-4 w-4" /> Consolidar e Fechar Mês
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
