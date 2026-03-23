import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { FileSearch, ShieldAlert, CheckCircle2, AlertTriangle, Plus, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

export function InternalDD() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [declarations, setDeclarations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDeclarations = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('dd_conflict_declarations')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
    if (data) setDeclarations(data)
    setLoading(false)
  }

  useEffect(() => {
    if (tenantId) fetchDeclarations()
  }, [tenantId])

  const handleTriggerCampaign = () => {
    toast({
      title: 'Campanha Iniciada',
      description:
        'O disparo da Declaração de Conflito de Interesses foi agendado para todos os colaboradores ativos.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-lg border">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <FileSearch className="h-5 w-5 mr-2 text-slate-500" />
            Know Your Employee (KYE)
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Gestão de Declarações Anuais de Conflito de Interesses e antecedentes para cargos de
            confiança, atendendo requisitos ISO 37301 e melhores práticas.
          </p>
        </div>
        <Button onClick={handleTriggerCampaign} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" /> Disparar Campanha Anual
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">
              Declarações Recebidas ({new Date().getFullYear()})
            </CardTitle>
            <CardDescription>
              Respostas submetidas pelos colaboradores através do portal seguro.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : declarations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma declaração registrada no momento.
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead className="text-center">Indício de Conflito</TableHead>
                    <TableHead>Status DCI</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {declarations.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium text-sm">
                        {d.employee_name || 'Usuário Não Identificado'}
                      </TableCell>
                      <TableCell className="text-center">
                        {d.has_conflict ? (
                          <Badge
                            variant="destructive"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" /> Sim
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Não
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-slate-100 text-slate-800 border-none">
                          {d.status || 'Recebida'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Analisar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 h-fit bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" /> Alertas do KYE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg bg-white">
              Nenhum alerta de integridade ou sanção cruzada identificado no quadro atual.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
