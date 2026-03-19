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
  Download,
  Plus,
  AlertTriangle,
  Search,
  Activity,
  Workflow,
  ShieldAlert,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const nonconformities = [
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

const analysis = [
  {
    id: 'NC-2023-01',
    rootCause: 'Falta de trava sistêmica no ERP (bypass manual possível)',
    failures: ['Controle Operacional (8.1)', 'Procedimento Sistêmico'],
  },
  {
    id: 'NC-2023-02',
    rootCause: 'Ausência de notificação automática de vencimento aos gestores',
    failures: ['Recursos Tecnológicos (7.1)', 'Comunicação (7.4)'],
  },
]

export function Nonconformity102() {
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
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Registrar Não Conformidade
          </Button>
        </div>
      </div>

      <Tabs defaultValue="events">
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
                {nonconformities.map((nc) => (
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
                          nc.severity === 'Alta'
                            ? 'text-destructive border-destructive'
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
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref. Evento</TableHead>
                  <TableHead>Causa-Raiz Determinada (5 Porquês / Ishikawa)</TableHead>
                  <TableHead>Falhas Sistêmicas Identificadas</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.map((an) => (
                  <TableRow key={an.id}>
                    <TableCell className="font-mono text-xs">{an.id}</TableCell>
                    <TableCell className="text-sm">{an.rootCause}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {an.failures.map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-muted px-2 py-0.5 rounded-md inline-block w-fit"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Search className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
                    <strong>Módulo 6.1 (Ações para Abordar Riscos)</strong>. Dependendo da natureza
                    da falha, é necessário engatilhar atualizações em outros módulos.
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
            <p>
              O status de uma Não Conformidade só pode ser alterado para "Encerrada" após a{' '}
              <strong>Verificação de Eficácia</strong> da ação corretiva, garantindo que o problema
              original não voltou a ocorrer após o período de maturação.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
