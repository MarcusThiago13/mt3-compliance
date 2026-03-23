import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  ShieldCheck,
  Handshake,
  Globe,
  Info,
  Ban,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function GovernancaDigitalTab({ tenant }: any) {
  const [operators, setOperators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOperators()
  }, [tenant.id])

  const fetchOperators = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('due_diligence_processes')
      .select('*')
      .eq('tenant_id', tenant.id)
      .in('target_type', ['Operador de Dados', 'Fornecedor de TI', 'Suboperador'])
      .order('created_at', { ascending: false })

    setOperators(data || [])
    setLoading(false)
  }

  const simulateRisk = async () => {
    const { error } = await supabase.from('due_diligence_processes').insert({
      tenant_id: tenant.id,
      target_name: 'DataCloud Hosting Solutions',
      target_type: 'Operador de Dados',
      status: 'Bloqueado',
      expiration_date: '2023-12-01',
      block_payments: true,
      last_incident_date: new Date().toISOString().split('T')[0],
    })
    if (!error) {
      toast({
        title: 'Fornecedor Simulado',
        description: 'Registro inserido com bloqueio de pagamento ativado.',
      })
      fetchOperators()
    }
  }

  const requestReDiligence = async (id: string) => {
    const { error } = await supabase
      .from('due_diligence_processes')
      .update({ status: 'Re-diligência Solicitada', block_payments: false })
      .eq('id', id)
    if (!error) {
      toast({
        title: 'Solicitação Enviada',
        description: 'O fornecedor foi notificado para re-diligência.',
      })
      fetchOperators()
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="w-5 h-5 text-primary" /> Avaliação de Impacto (RIPD)
            </CardTitle>
            <CardDescription>
              Análise de riscos para tratamentos de alta criticidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-50 border rounded-lg text-center text-sm text-muted-foreground">
              2 RIPDs concluídos no último trimestre.
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Handshake className="w-5 h-5 text-primary" /> Gestão de Operadores
            </CardTitle>
            <CardDescription>Auditoria e due diligence de fornecedores de TI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-50 border rounded-lg text-center text-sm text-muted-foreground">
              Integração ativa com o módulo Due Diligence.
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="w-5 h-5 text-primary" /> Transferências Internacionais
            </CardTitle>
            <CardDescription>Mapeamento de fluxos transfronteiriços de dados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-50 border rounded-lg text-center text-sm text-muted-foreground">
              Nenhuma transferência de alto risco registrada.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b bg-slate-50/50 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ban className="w-5 h-5 text-red-600" /> Smart Blocking: Fiscalização de Fornecedores
            </CardTitle>
            <CardDescription className="mt-1 max-w-3xl">
              Alerta automático e bloqueio de pagamentos ou novas contratações para operadores de
              dados com documentação de conformidade expirada ou envolvidos em incidentes de
              segurança recentes.
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={simulateRisk} className="shrink-0 bg-white">
            <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
            Simular Risco em Operador
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : operators.length === 0 ? (
            <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-slate-50">
              <p>Nenhum operador de dados ou fornecedor monitorado no momento.</p>
              <p className="text-sm mt-1">
                Utilize o botão acima para simular um cenário de bloqueio.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operador / Fornecedor</TableHead>
                  <TableHead>Status de Conformidade</TableHead>
                  <TableHead>Último Incidente</TableHead>
                  <TableHead>Ação Automática</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operators.map((op) => (
                  <TableRow key={op.id} className={cn({ 'bg-red-50/30': op.block_payments })}>
                    <TableCell className="font-medium text-slate-800">
                      {op.target_name}
                      <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                        {op.target_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {op.block_payments ? (
                        <Badge
                          variant="destructive"
                          className="border-none flex w-fit items-center gap-1"
                        >
                          <Ban className="w-3 h-3" /> Conformidade Expirada
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none flex w-fit items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Regular
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {op.last_incident_date ? (
                        <span className="text-red-600 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />{' '}
                          {new Date(op.last_incident_date).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {op.block_payments ? (
                        <span className="text-sm font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-md">
                          Pagamento Retido
                        </span>
                      ) : (
                        <span className="text-sm text-slate-500">Nenhuma restrição</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {op.block_payments && op.status !== 'Re-diligência Solicitada' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => requestReDiligence(op.id)}
                        >
                          Exigir Re-diligência
                        </Button>
                      )}
                      {op.status === 'Re-diligência Solicitada' && (
                        <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                          Aguardando Terceiro
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {tenant.org_type === 'poder_publico' && (
        <Card className="bg-blue-50/50 border-blue-200 shadow-sm">
          <CardContent className="p-5 flex gap-4 items-start">
            <Info className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900">
                Transparência Ativa x LGPD (Poder Público)
              </h4>
              <p className="text-sm text-blue-800 mt-1">
                O sistema aplica filtros de anonimização automáticos nos relatórios públicos para
                conciliar a Lei de Acesso à Informação (LAI) com a LGPD, preservando os princípios
                de Accountability.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {tenant.org_type === 'osc' && (
        <Card className="bg-purple-50/50 border-purple-200 shadow-sm">
          <CardContent className="p-5 flex gap-4 items-start">
            <Info className="w-6 h-6 text-purple-600 mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-purple-900">Integração MROSC e CEBAS</h4>
              <p className="text-sm text-purple-800 mt-1">
                Os dados sensíveis de beneficiários vinculados aos projetos sociais estão isolados
                com perfis de acesso restritos, gerando evidências de conformidade para prestação de
                contas de forma automatizada e segura.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
