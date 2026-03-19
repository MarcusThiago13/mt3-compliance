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
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { complianceService } from '@/services/compliance'

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

  useEffect(() => {
    if (prefillGap && events.length === initialNonconformities.length) {
      setFormData({
        description: prefillGap.description || '',
        rule: prefillGap.rule || '',
        severity: prefillGap.severity || 'Média',
      })
      setActiveTab('events')
      setIsFormOpen(true)
      // Clear location state to prevent re-opening on mount
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
      `Plano de Ação criado a partir de gap: ${formData.rule}`,
      user?.email || 'Sistema',
    )

    toast({
      title: 'Plano de Ação Salvo',
      description: 'O plano de ação foi registrado com sucesso.',
    })
  }

  const handleTrigger = () => {
    toast({
      title: 'Módulo Atualizado',
      description: 'Ação corretiva sincronizada com o Módulo 6.',
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
                    <TableCell className="font-medium text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" /> {nc.event}
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
                    Definição de Ações Corretivas e Sincronização Sistêmica
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    As ações definidas para eliminar as causas-raiz da não conformidade são
                    automaticamente integradas ao{' '}
                    <strong>Módulo 6.1 (Ações para Abordar Riscos)</strong>.
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
            <DialogTitle>Criar Plano de Ação</DialogTitle>
            <DialogDescription>
              Verifique os dados importados do Gap e ajuste se necessário antes de salvar a ação
              corretiva.
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
            <Button onClick={handleSavePlan}>Salvar Plano de Ação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
