import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MessageSquareWarning,
  FileSearch,
  Activity,
  ArrowRight,
} from 'lucide-react'

const subItems = [
  {
    id: '8.1',
    title: 'Planejamento e Controle',
    status: 'Conforme',
    metric: '12 Controles Ativos',
  },
  {
    id: '8.2',
    title: 'Controles e Procedimentos',
    status: 'Atenção',
    metric: '2 Exceções Abertas',
  },
  {
    id: '8.3',
    title: 'Levantamento de Preocupações',
    status: 'Conforme',
    metric: '3 Casos em Triagem',
  },
  {
    id: '8.4',
    title: 'Processo de Investigação',
    status: 'Conforme',
    metric: '2 Investigações Ativas',
  },
]

const remediations = [
  { id: 'REM-01', risk: 'R01 - Fraude', progress: 80, deadline: '30/11/2023', status: 'No Prazo' },
  { id: 'REM-02', risk: 'R03 - Assédio', progress: 40, deadline: '15/10/2023', status: 'Atrasado' },
]

export function Module8Overview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Visão Geral: Módulo 8 (Operação)</h3>
          <p className="text-sm text-muted-foreground">
            Painel consolidado de controles operacionais, canal de denúncias e investigações.
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full shrink-0">
              <ShieldCheck className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Controles Críticos</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Exceções Abertas</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full shrink-0">
              <MessageSquareWarning className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Casos na Triagem</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full shrink-0">
              <FileSearch className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Investigações Ativas</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" /> Status de Conformidade
              Operacional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border"
                >
                  <div>
                    <div className="font-semibold text-sm">
                      <span className="text-primary mr-1">{item.id}</span>
                      {item.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{item.metric}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      item.status === 'Conforme'
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" /> Prazos e Remediações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plano / Risco</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Prazo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {remediations.map((rem) => (
                  <TableRow key={rem.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{rem.id}</div>
                      <div className="text-xs text-muted-foreground">{rem.risk}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={rem.progress} className="h-2 w-16" />
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {rem.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{rem.deadline}</span>
                        {rem.status === 'Atrasado' && (
                          <ShieldAlert className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
