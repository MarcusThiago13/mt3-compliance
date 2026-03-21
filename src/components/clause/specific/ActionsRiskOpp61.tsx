import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
import { Progress } from '@/components/ui/progress'
import {
  Download,
  Plus,
  AlertTriangle,
  Target,
  CheckCircle2,
  ArrowRightLeft,
  Sparkles,
  Bell,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { ActionMotor5W2HModal } from '@/components/shared/ActionMotor5W2HModal'
import { SendAlertModal } from '@/components/shared/SendAlertModal'

const actions = [
  {
    id: 'ACT-001',
    origin: 'Risco: R01 (Fraude)',
    title: 'Implementar aprovação dupla no ERP',
    type: 'Preventiva',
    priority: 'Alta',
    owner: 'TI / Financeiro',
    deadline: '30/11/2023',
    status: 'Em Andamento',
    progress: 60,
  },
  {
    id: 'ACT-002',
    origin: 'Req: LGPD',
    title: 'Revisão de contratos com operadores',
    type: 'Corretiva',
    priority: 'Crítica',
    owner: 'Jurídico',
    deadline: '15/10/2023',
    status: 'Concluído',
    progress: 100,
  },
  {
    id: 'ACT-003',
    origin: 'Oportunidade: LMS',
    title: 'Contratar plataforma LMS para EAD',
    type: 'Melhoria',
    priority: 'Média',
    owner: 'RH',
    deadline: '10/01/2024',
    status: 'Não Iniciado',
    progress: 0,
  },
]

const integrations = [
  {
    actionId: 'ACT-001',
    process: 'Contas a Pagar',
    impact: 'Alteração no fluxo de aprovação com nova alçada',
    resources: 'R$ 15.000 (Licença ERP) + 20h Desenvolvimento',
    communication: 'Treinamento para equipe financeira',
  },
  {
    actionId: 'ACT-002',
    process: 'Gestão de Terceiros',
    impact: 'Inclusão de cláusulas padrão de privacidade',
    resources: 'Recursos Internos (Jurídico)',
    communication: 'Comunicado aos fornecedores',
  },
]

const efficacy = [
  {
    actionId: 'ACT-002',
    criteria: 'Zero incidentes de vazamento de dados reportados nos contratos revisados',
    method: 'Auditoria trimestral de contratos por amostragem',
    reviewDate: '15/01/2024',
    result: 'Eficaz',
  },
]

export function ActionsRiskOpp61() {
  const [is5W2HOpen, setIs5W2HOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertItem, setAlertItem] = useState<any>(null)

  const handleImport = () => {
    toast({
      title: 'Integração Automática',
      description: 'Riscos críticos e altos importados do Módulo 4.6 com sucesso.',
    })
  }

  const handleExport = (doc: string) => {
    toast({ title: 'Documento Gerado', description: `${doc} exportado com sucesso.` })
  }

  const open5W2H = (act: any) => {
    setSelectedItem(act)
    setIs5W2HOpen(true)
  }

  const openAlert = (act: any) => {
    setAlertItem(act)
    setIsAlertOpen(true)
  }

  const handleSave5W2H = (plan: any) => {
    toast({
      title: 'Ação Desdobrada',
      description: 'O plano 5W2H foi integrado à ação com sucesso.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">6.1 Ações para Abordar Riscos e Oportunidades</h3>
          <p className="text-sm text-muted-foreground">
            Conversão de riscos em ações estruturadas, integrações e avaliação de eficácia.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('Plano de Ações para Abordar Riscos')}
          >
            <Download className="mr-2 h-4 w-4" /> Relatório de Ações
          </Button>
          <Button onClick={handleImport}>
            <AlertTriangle className="mr-2 h-4 w-4" /> Importar Riscos (4.6)
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full shrink-0">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Ações</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-full shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ações Críticas</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full shrink-0">
              <ArrowRightLeft className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-full shrink-0">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Concluídas</p>
              <p className="text-2xl font-bold">4</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="actions">
        <TabsList className="grid w-full grid-cols-3 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="actions" className="text-xs sm:text-sm py-2">
            Planos de Ação
          </TabsTrigger>
          <TabsTrigger value="integration" className="text-xs sm:text-sm py-2">
            Integração ao Negócio
          </TabsTrigger>
          <TabsTrigger value="efficacy" className="text-xs sm:text-sm py-2">
            Avaliação de Eficácia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="actions">
          <div className="flex justify-end mb-4">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Nova Ação
            </Button>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID / Origem</TableHead>
                  <TableHead>Ação Planejada</TableHead>
                  <TableHead>Resp. / Prazo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Progresso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((act) => (
                  <TableRow key={act.id}>
                    <TableCell>
                      <div className="font-mono text-xs font-semibold">{act.id}</div>
                      <Badge variant="outline" className="mt-1 text-[10px] bg-muted/50">
                        {act.origin}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{act.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px]">
                          {act.type}
                        </Badge>
                        <span
                          className={`text-xs font-semibold ${act.priority === 'Crítica' ? 'text-destructive' : act.priority === 'Alta' ? 'text-orange-500' : 'text-muted-foreground'}`}
                        >
                          Prio: {act.priority}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => open5W2H(act)}
                          className="h-5 text-[10px] px-2 text-purple-700 border-purple-200 hover:bg-purple-50 ml-2"
                        >
                          <Sparkles className="mr-1 h-2.5 w-2.5" /> IA
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAlert(act)}
                          className="h-5 text-[10px] px-2 text-amber-700 border-amber-200 hover:bg-amber-50"
                        >
                          <Bell className="mr-1 h-2.5 w-2.5" /> Alerta
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{act.owner}</div>
                      <div className="text-muted-foreground text-xs">{act.deadline}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          act.status === 'Concluído'
                            ? 'bg-success/10 text-success border-success/20'
                            : act.status === 'Em Andamento'
                              ? 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                              : 'bg-slate-100 text-slate-700'
                        }
                      >
                        {act.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={act.progress} className="h-2 flex-1" />
                        <span className="text-xs font-medium text-muted-foreground w-8">
                          {act.progress}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="integration">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref. Ação</TableHead>
                  <TableHead>Processo Impactado</TableHead>
                  <TableHead>Impacto Operacional</TableHead>
                  <TableHead>Recursos (Fin./Hum./Tec.)</TableHead>
                  <TableHead>Comunicação Necessária</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {integrations.map((int, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {int.actionId}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{int.process}</TableCell>
                    <TableCell className="text-sm">{int.impact}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{int.resources}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {int.communication}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="efficacy">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref. Ação</TableHead>
                  <TableHead>Critério de Êxito</TableHead>
                  <TableHead>Método de Verificação</TableHead>
                  <TableHead>Data Revisão</TableHead>
                  <TableHead>Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {efficacy.map((eff, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {eff.actionId}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{eff.criteria}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{eff.method}</TableCell>
                    <TableCell className="text-sm">{eff.reviewDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={eff.result === 'Eficaz' ? 'bg-success hover:bg-success/90' : ''}
                      >
                        {eff.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <ActionMotor5W2HModal
        isOpen={is5W2HOpen}
        onOpenChange={setIs5W2HOpen}
        title={`5W2H: Ação ${selectedItem?.id}`}
        promptContext={`Ação a ser executada: ${selectedItem?.title}\nOrigem: ${selectedItem?.origin}\nObjetivo: Detalhar a execução desta ação de forma tática para integração ao negócio.`}
        onSave={handleSave5W2H}
      />

      <SendAlertModal
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        actionId={alertItem?.id}
        actionTitle={alertItem?.title}
        actionDeadline={alertItem?.deadline}
      />
    </div>
  )
}
