import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Download,
  Plus,
  AlertTriangle,
  Search,
  Activity,
  Workflow,
  ShieldAlert,
  Sparkles,
  Bell,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { complianceService } from '@/services/compliance'
import { ActionMotor5W2HModal } from '@/components/shared/ActionMotor5W2HModal'
import { SendAlertModal } from '@/components/shared/SendAlertModal'

const initialNonconformities = [
  {
    id: 'NC-2023-01',
    event: 'Pagamento sem aprovação dupla',
    origin: 'Auditoria Interna',
    date: '15/10/2023',
    severity: 'Alta',
    status: 'Causa-Raiz',
  },
  {
    id: 'NC-2023-02',
    event: 'Atraso em Treinamento Regulatório',
    origin: 'Monitoramento (KPI)',
    date: '10/10/2023',
    severity: 'Baixa',
    status: 'Verificação',
  },
]

export function Nonconformity102() {
  const location = useLocation()
  const prefillGap = location.state?.prefillGap
  const { user } = useAuth()

  const [events, setEvents] = useState(initialNonconformities)
  const [activeTab, setActiveTab] = useState('events')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({ description: '', rule: '', severity: 'Média' })

  const [is5W2HOpen, setIs5W2HOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertItem, setAlertItem] = useState<any>(null)

  useEffect(() => {
    if (prefillGap && events.length === initialNonconformities.length) {
      setFormData({
        description: prefillGap.description || '',
        rule: prefillGap.rule || '',
        severity: prefillGap.severity || 'Média',
      })
      setActiveTab('events')
      setIsFormOpen(true)
      window.history.replaceState({}, document.title)
    }
  }, [prefillGap, events.length])

  const handleSavePlan = async () => {
    const newEvent = {
      id: `NC-NEW-${Math.floor(Math.random() * 10000)}`,
      event: formData.description,
      origin: `Análise de Gaps (AI) - ${formData.rule}`,
      date: new Date().toLocaleDateString(),
      severity: formData.severity,
      status: 'Análise Inicial',
    }
    setEvents([newEvent, ...events])
    setIsFormOpen(false)

    await complianceService.addAuditLog(
      '10.2',
      `Não Conformidade criada a partir de gap: ${formData.rule}`,
      user?.email || 'Sistema',
    )

    toast({
      title: 'Não Conformidade Registrada',
      description: 'O evento foi registrado com sucesso.',
    })
  }

  const handleTrigger = () => {
    toast({
      title: 'Módulo Atualizado',
      description: 'Ação corretiva sincronizada com o Módulo 6.',
    })
  }

  const open5W2H = (nc: any) => {
    setSelectedItem(nc)
    setIs5W2HOpen(true)
  }

  const openAlert = (nc: any) => {
    setAlertItem(nc)
    setIsAlertOpen(true)
  }

  const handleSave5W2H = async (plan: any) => {
    await complianceService.addAuditLog(
      '10.2',
      `Ação Corretiva Gerada (5W2H) para o evento: ${selectedItem?.event}`,
      user?.email || 'Sistema',
    )
    toast({
      title: 'Ação Corretiva Gerada',
      description:
        'O plano de ação foi integrado para tratar a causa-raiz. Trilha de auditoria atualizada.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">10.2 Não Conformidade e Ação Corretiva</h3>
          <p className="text-sm text-muted-foreground">
            Tratamento de desvios, contenção, análise de causa-raiz e planos de remediação.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Relatório de Eventos
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Registrar Não Conformidade
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="events" className="py-2 text-xs sm:text-sm">
            Registro de Eventos
          </TabsTrigger>
          <TabsTrigger value="analysis" className="py-2 text-xs sm:text-sm">
            Análise de Causa-Raiz
          </TabsTrigger>
          <TabsTrigger value="actions" className="py-2 text-xs sm:text-sm">
            Ações e Remediação
          </TabsTrigger>
          <TabsTrigger value="efficacy" className="py-2 text-xs sm:text-sm">
            Eficácia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref.</TableHead>
                  <TableHead>Evento Identificado</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Gravidade</TableHead>
                  <TableHead>Status Atual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((nc) => (
                  <TableRow key={nc.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {nc.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" /> {nc.event}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => open5W2H(nc)}
                        className="h-5 text-[10px] px-2 text-purple-700 border-purple-200 hover:bg-purple-50 mt-1"
                      >
                        <Sparkles className="mr-1 h-2.5 w-2.5" /> IA Corretiva
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAlert(nc)}
                        className="h-5 text-[10px] px-2 text-amber-700 border-amber-200 hover:bg-amber-50 ml-1"
                      >
                        <Bell className="mr-1 h-2.5 w-2.5" /> Alerta
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm">{nc.origin}</TableCell>
                    <TableCell className="text-sm">{nc.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          nc.severity === 'Crítica'
                            ? 'text-destructive border-destructive'
                            : nc.severity === 'Alta'
                              ? 'text-orange-500 border-orange-500'
                              : 'text-amber-500'
                        }
                      >
                        {nc.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{nc.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="border-dashed bg-muted/30">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Área de análise de causa raiz 5 Porquês / Ishikawa.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full shrink-0">
                  <Workflow className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    Definição de Ações Corretivas e Integração Transversal
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    As ações definidas para eliminar as causas-raiz da não conformidade são
                    automaticamente integradas aos motores transversais de risco e melhoria contínua{' '}
                    <strong>(ISO 37301 - 6.1 / 10.2)</strong>. O registro em <i>audit_logs</i> é
                    imutável.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={handleTrigger} className="text-xs">
                      <Activity className="mr-2 h-3 w-3" /> Atualizar Matriz de Risco (4.6)
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleTrigger} className="text-xs">
                      <ShieldAlert className="mr-2 h-3 w-3" /> Revisar Controles Operacionais (8.1)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficacy">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-900 flex gap-3">
            <Activity className="h-5 w-5 shrink-0 text-blue-700" />
            <p>O status só pode ser alterado para "Encerrada" após a Verificação de Eficácia.</p>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Não Conformidade</DialogTitle>
            <DialogDescription>
              Verifique os dados e preencha a descrição do desvio identificado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Descrição do Desvio / Evento</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Regra Referência (ISO/Legislação)</Label>
                <Input
                  value={formData.rule}
                  onChange={(e) => setFormData({ ...formData, rule: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Gravidade</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(val) => setFormData({ ...formData, severity: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Crítica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePlan}>Salvar Registro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ActionMotor5W2HModal
        isOpen={is5W2HOpen}
        onOpenChange={setIs5W2HOpen}
        title={`Ação Corretiva: ${selectedItem?.id}`}
        promptContext={`Evento/Desvio: ${selectedItem?.event}\nOrigem: ${selectedItem?.origin}\nCrie um plano de ação corretiva 5W2H focando na eliminação da causa-raiz e prevenção de reincidência.`}
        onSave={handleSave5W2H}
      />

      <SendAlertModal
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        actionId={alertItem?.id}
        actionTitle={`Corrigir: ${alertItem?.event}`}
        actionDeadline={alertItem?.date}
      />
    </div>
  )
}
