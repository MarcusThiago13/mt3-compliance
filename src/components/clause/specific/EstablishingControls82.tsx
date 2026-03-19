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
import { Download, FileText, ArrowRightLeft, Cpu } from 'lucide-react'

const procedures = [
  {
    id: 'PROC-01',
    title: 'Due Diligence Terceiros',
    version: 'v3.0',
    valid: '2024',
    status: 'Vigente',
  },
  {
    id: 'PROC-02',
    title: 'Alçadas de Aprovação Financeira',
    version: 'v1.2',
    valid: '2023',
    status: 'Em Revisão',
  },
]

const sodMatrix = [
  {
    r1: 'Comprador (Suprimentos)',
    r2: 'Aprovador de Pagamento',
    conflict: 'Fraude Financeira',
    mitigation: 'Aprovação Sistêmica e Auditoria',
  },
  {
    r1: 'Cadastrador de Fornecedor',
    r2: 'Comprador (Suprimentos)',
    conflict: 'Favorecimento',
    mitigation: 'Workflow Segregado no ERP',
  },
]

const logs = [
  {
    id: 'AUT-881',
    trigger: 'Cadastro Fornecedor Crítico',
    system: 'ERP Cloud',
    status: 'Bloqueado (Falta DD)',
    date: '15/10/2023 14:30',
  },
  {
    id: 'AUT-882',
    trigger: 'Pagamento > R$50k',
    system: 'ERP Cloud',
    status: 'Escalonado (Diretoria)',
    date: '15/10/2023 10:15',
  },
]

export function EstablishingControls82() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">8.2 Estabelecendo Controles e Procedimentos</h3>
          <p className="text-sm text-muted-foreground">
            Documentação procedural, matriz SoD e logs de automação.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exportar Matriz SoD
          </Button>
        </div>
      </div>

      <Tabs defaultValue="procs">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="procs" className="py-2">
            Procedimentos
          </TabsTrigger>
          <TabsTrigger value="sod" className="py-2">
            Segregação de Funções (SoD)
          </TabsTrigger>
          <TabsTrigger value="logs" className="py-2">
            Logs de Automação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="procs">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref.</TableHead>
                  <TableHead>Procedimento Operacional</TableHead>
                  <TableHead>Versão Atual</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procedures.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {p.id}
                    </TableCell>
                    <TableCell className="font-medium text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" /> {p.title}
                    </TableCell>
                    <TableCell className="text-sm">{p.version}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.valid}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          p.status === 'Vigente'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                        }
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="sod">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Função 1</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Função 2 (Incompatível)</TableHead>
                  <TableHead>Risco de Conflito</TableHead>
                  <TableHead>Controle Mitigatório Aplicado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sodMatrix.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm text-slate-700">{s.r1}</TableCell>
                    <TableCell>
                      <ArrowRightLeft className="h-4 w-4 text-muted-foreground mx-auto" />
                    </TableCell>
                    <TableCell className="font-medium text-sm text-slate-700">{s.r2}</TableCell>
                    <TableCell className="text-sm text-destructive font-semibold">
                      {s.conflict}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.mitigation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Log ID</TableHead>
                  <TableHead>Regra / Gatilho Automatizado</TableHead>
                  <TableHead>Sistema Fonte</TableHead>
                  <TableHead>Data / Hora</TableHead>
                  <TableHead>Ação Sistêmica</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {l.id}
                    </TableCell>
                    <TableCell className="font-medium text-sm flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-primary" /> {l.trigger}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{l.system}</TableCell>
                    <TableCell className="text-sm">{l.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          l.status.includes('Bloqueado')
                            ? 'bg-destructive/10 text-destructive border-destructive/20'
                            : 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                        }
                      >
                        {l.status}
                      </Badge>
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
