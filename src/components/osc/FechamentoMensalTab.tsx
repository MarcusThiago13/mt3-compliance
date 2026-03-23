import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Lock, AlertTriangle, CheckCircle2, SearchX, FileCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function FechamentoMensalTab({ partnership }: any) {
  const [lines, setLines] = useState<any[]>([])
  const [diligences, setDiligences] = useState<any[]>([])
  const [execution, setExecution] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const { data: ln } = await supabase
      .from('osc_bank_statement_lines' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
    if (ln) setLines(ln)

    const { data: dil } = await supabase
      .from('osc_accountability_diligences' as any)
      .select('status')
      .eq('partnership_id', partnership.id)
    if (dil) setDiligences(dil)

    const { data: ex } = await supabase
      .from('osc_partnership_execution' as any)
      .select('physical_progress')
      .eq('partnership_id', partnership.id)
      .maybeSingle()
    setExecution(ex)

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [partnership.id])

  const pendingLines = lines.filter((l) => l.status === 'Importada')
  const restitutionPending = lines.filter((l) => l.status === 'Aguardando Restituição')
  const openDiligences = diligences.filter(
    (d) => d.status === 'Aberta' || d.status === 'Respondida',
  )

  const hasExtrato = lines.length > 0
  const hasPhysicalExecution = execution && execution.physical_progress > 0

  const canClose =
    pendingLines.length === 0 &&
    restitutionPending.length === 0 &&
    openDiligences.length === 0 &&
    hasExtrato &&
    hasPhysicalExecution
  const isClosed = false // In real world, read from DB period status

  const handleCloseMonth = async () => {
    if (!canClose) {
      return toast({
        title: 'Bloqueio',
        description: 'Resolva todas as pendências antes de consolidar.',
        variant: 'destructive',
      })
    }
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      toast({
        title: 'Pacote Consolidado',
        description: 'Prestação de contas formatada para submissão.',
      })
    }, 1500)
  }

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Lock className="h-5 w-5 mr-2 text-slate-600" /> Consolidação e Trava de Auditoria
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Validação automatizada de integridade. O sistema impede a emissão do pacote final de
            prestação se houverem lacunas financeiras, ausência de metas ou glosas sem tratamento.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Checklist Obrigatório</CardTitle>
            <CardDescription>Critérios determinantes para aprovação das contas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50/80">
              <div className="flex items-center gap-2">
                {hasPhysicalExecution ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                <span className="text-sm font-medium">Relatório de Execução Física (B4)</span>
              </div>
              <Badge
                variant="outline"
                className={
                  hasPhysicalExecution
                    ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                    : 'border-amber-200 text-amber-700 bg-amber-50'
                }
              >
                {hasPhysicalExecution ? 'Integrado' : 'Falta Lançar Execução'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50/80">
              <div className="flex items-center gap-2">
                {hasExtrato ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                <span className="text-sm font-medium">Extrato Integral Importado</span>
              </div>
              <Badge
                variant={hasExtrato ? 'default' : 'secondary'}
                className={hasExtrato ? 'bg-emerald-100 text-emerald-800' : ''}
              >
                {hasExtrato ? `${lines.length} Lançamentos` : 'Pendente'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50/80">
              <div className="flex items-center gap-2">
                {pendingLines.length === 0 && hasExtrato ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <SearchX className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm font-medium">Conciliação 100% Tratada</span>
              </div>
              <Badge
                variant="outline"
                className={
                  pendingLines.length > 0
                    ? 'text-red-700 bg-red-50 border-red-200'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }
              >
                {pendingLines.length} Órfãs / Pendentes
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50/80">
              <div className="flex items-center gap-2">
                {restitutionPending.length === 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                <span className="text-sm font-medium">Recomposição de Tarifas Inelegíveis</span>
              </div>
              <Badge
                variant="outline"
                className={
                  restitutionPending.length > 0
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }
              >
                {restitutionPending.length} Restituições Pendentes
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50/80">
              <div className="flex items-center gap-2">
                {openDiligences.length === 0 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm font-medium">Diligências e Glosas Resolvidas</span>
              </div>
              <Badge
                variant="outline"
                className={
                  openDiligences.length > 0
                    ? 'text-red-700 bg-red-50 border-red-200'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }
              >
                {openDiligences.length} Em Aberto
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`shadow-sm border-2 ${canClose && !isClosed ? 'border-emerald-400 bg-emerald-50/20' : isClosed ? 'border-slate-300 bg-slate-50' : 'border-red-200 bg-red-50/20'}`}
        >
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4 py-12 h-full">
            {canClose ? (
              <>
                <FileCheck className="h-14 w-14 text-emerald-500" />
                <div>
                  <h3 className="text-xl font-bold text-emerald-800">Prestação Consistente</h3>
                  <p className="text-sm text-emerald-700 mt-2 max-w-sm mx-auto">
                    A trilha de auditoria atesta que a execução física e financeira estão coerentes
                    e amparadas por lastro documental.
                  </p>
                </div>
                <Button
                  onClick={handleCloseMonth}
                  disabled={isClosing}
                  className="bg-emerald-600 hover:bg-emerald-700 mt-6 shadow-md"
                >
                  {isClosing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  Gerar Pacote Oficial de Prestação
                </Button>
              </>
            ) : (
              <>
                <AlertTriangle className="h-14 w-14 text-red-400 opacity-60" />
                <div>
                  <h3 className="text-xl font-bold text-red-800">Inconsistências Detectadas</h3>
                  <p className="text-sm text-red-700 mt-2 max-w-sm mx-auto">
                    O pacote não pode ser gerado. Resolva os itens pendentes no checklist ao lado
                    para garantir a regularidade perante o Ente Público.
                  </p>
                </div>
                <Button disabled className="mt-6 opacity-50 cursor-not-allowed">
                  <Lock className="mr-2 h-4 w-4" /> Gerar Pacote Oficial de Prestação
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
