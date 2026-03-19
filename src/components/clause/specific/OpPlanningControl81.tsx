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
import { Download, Plus, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react'

const controls = [
  {
    id: 'OPC-01',
    name: 'Aprovação Dupla',
    risk: 'R01 (Fraude)',
    freq: 'Contínua',
    executor: 'Sistema ERP',
    status: 'Ativo',
  },
  {
    id: 'OPC-02',
    name: 'Background Check',
    risk: 'R02 (Corrupção)',
    freq: 'Sob Demanda',
    executor: 'RH',
    status: 'Ativo',
  },
  {
    id: 'OPC-03',
    name: 'Revisão de SLA',
    risk: 'R04 (Dados)',
    freq: 'Trimestral',
    executor: 'TI',
    status: 'Em Observação',
  },
]

const thirdParties = [
  {
    id: 'FRN-120',
    name: 'Tech Solutions SA',
    type: 'Tecnologia',
    ddStatus: 'Aprovado',
    sla: 'Vigente',
    monitoring: 'Contínuo',
  },
  {
    id: 'FRN-145',
    name: 'Logística Express',
    type: 'Transporte',
    ddStatus: 'Em Análise',
    sla: 'Pendente',
    monitoring: 'Alerta',
  },
]

const failures = [
  {
    date: '12/10/2023',
    control: 'OPC-01',
    effect: 'Aprovação unificada em lote 450',
    action: 'Estorno manual e correção de bug no ERP',
  },
  {
    date: '05/09/2023',
    control: 'OPC-03',
    effect: 'SLA não aferido no Trimestre 3',
    action: 'Notificação à área de TI',
  },
]

export function OpPlanningControl81() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">8.1 Planejamento e Controle Operacional</h3>
          <p className="text-sm text-muted-foreground">
            Gestão de controles, código de conduta e terceiros.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Relatório Operacional
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Controle
          </Button>
        </div>
      </div>

      <Tabs defaultValue="controls">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="controls" className="py-2">
            Controles Operacionais
          </TabsTrigger>
          <TabsTrigger value="third" className="py-2">
            Gestão de Terceiros
          </TabsTrigger>
          <TabsTrigger value="failures" className="py-2">
            Falhas de Controle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="controls">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref.</TableHead>
                  <TableHead>Nome do Controle</TableHead>
                  <TableHead>Risco / Obrigação Relacionada</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Executor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controls.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {c.id}
                    </TableCell>
                    <TableCell className="font-medium text-sm flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" /> {c.name}
                    </TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="secondary" className="text-[10px]">
                        {c.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.freq}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.executor}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          c.status === 'Ativo'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="third">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Terceiro</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Due Diligence</TableHead>
                  <TableHead>Contrato/SLA</TableHead>
                  <TableHead>Monitoramento Contínuo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {thirdParties.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-sm">{t.name}</TableCell>
                    <TableCell className="text-sm">{t.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          t.ddStatus === 'Aprovado'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                        }
                      >
                        {t.ddStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{t.sla}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold flex items-center gap-1 ${t.monitoring === 'Alerta' ? 'text-destructive' : 'text-success'}`}
                      >
                        {t.monitoring === 'Alerta' ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <ShieldCheck className="h-3 w-3" />
                        )}
                        {t.monitoring}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="failures">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Controle Afetado</TableHead>
                  <TableHead>Efeito Indesejado</TableHead>
                  <TableHead>Ação Imediata (Mitigação)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {failures.map((f, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{f.date}</TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="outline" className="font-mono">
                        {f.control}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{f.effect}</TableCell>
                    <TableCell className="text-sm">{f.action}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Investigar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
