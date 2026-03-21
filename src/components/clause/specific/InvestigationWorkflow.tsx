import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Target, Gavel, FileSignature, Sparkles, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { whistleblowingService } from '@/services/whistleblowing'
import { ActionMotor5W2HModal } from '@/components/shared/ActionMotor5W2HModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function InvestigationWorkflow() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [is5W2HOpen, setIs5W2HOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const fetchReports = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      const data = await whistleblowingService.getTenantReports(tenantId)
      setReports(data)
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao buscar casos.', variant: 'destructive' })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReports()
  }, [tenantId])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await whistleblowingService.updateReport(id, { status: newStatus })
      toast({ title: 'Sucesso', description: 'Fase da investigação atualizada.' })
      fetchReports()
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao atualizar.', variant: 'destructive' })
    }
  }

  const open5W2H = (inv: any) => {
    setSelectedItem(inv)
    setIs5W2HOpen(true)
  }

  const activeCases = reports.filter((r) =>
    [
      'em_investigacao',
      'aguardando_decisao',
      'encerrada_procedente',
      'encerrada_improcedente',
    ].includes(r.status),
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">8.4 Processo de Investigação</h3>
          <p className="text-sm text-muted-foreground">
            Workflow completo da investigação de casos admitidos.
          </p>
        </div>
      </div>

      <Tabs defaultValue="cases">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="cases" className="py-2">
            Casos Ativos
          </TabsTrigger>
          <TabsTrigger value="analysis" className="py-2">
            Causa-Raiz
          </TabsTrigger>
          <TabsTrigger value="response" className="py-2">
            Sanções
          </TabsTrigger>
          <TabsTrigger value="learning" className="py-2">
            Lições
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases">
          <div className="rounded-md border bg-card overflow-x-auto">
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="animate-spin h-6 w-6 text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Categoria (Escopo)</TableHead>
                    <TableHead>Data Início</TableHead>
                    <TableHead>Fase Atual</TableHead>
                    <TableHead className="text-right">Investigação IA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhuma investigação ativa.
                      </TableCell>
                    </TableRow>
                  )}
                  {activeCases.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {inv.protocol_number}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{inv.category}</TableCell>
                      <TableCell className="text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" />{' '}
                        {new Date(inv.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={inv.status}
                          onValueChange={(v) => handleStatusChange(inv.id, v)}
                        >
                          <SelectTrigger className="h-8 text-xs w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="em_investigacao">Em Investigação</SelectItem>
                            <SelectItem value="aguardando_decisao">Aguardando Decisão</SelectItem>
                            <SelectItem value="encerrada_procedente">
                              Concluída (Procedente)
                            </SelectItem>
                            <SelectItem value="encerrada_improcedente">
                              Concluída (Improcedente)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => open5W2H(inv)}
                          className="h-7 text-[10px] text-purple-700 border-purple-200 hover:bg-purple-50"
                        >
                          <Sparkles className="mr-1 h-2.5 w-2.5" /> Plano Tático
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Target className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Selecione um caso ativo no painel geral para documentar a análise de causa-raiz.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="response">
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Gavel className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Área para registro de medidas disciplinares aplicadas e planos de remediação.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="learning">
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              <FileSignature className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Banco de lições aprendidas para atualizar as políticas e matriz de risco.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ActionMotor5W2HModal
        isOpen={is5W2HOpen}
        onOpenChange={setIs5W2HOpen}
        title={`Plano Investigativo: ${selectedItem?.protocol_number}`}
        promptContext={`Investigação SGC\nCategoria: ${selectedItem?.category}\nRelato: ${selectedItem?.description}\nCrie um plano metodológico de investigação 5W2H estrito e imparcial.`}
        onSave={() =>
          toast({ title: 'Plano Salvo', description: 'Metodologia anexada aos autos.' })
        }
      />
    </div>
  )
}
