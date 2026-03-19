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
import {
  Download,
  Plus,
  Activity,
  MessageSquare,
  Target,
  FileText,
  Archive,
  Eye,
} from 'lucide-react'
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const feedbacks = [
  {
    id: 'FB-01',
    source: 'Órgão Regulador',
    cat: 'Interação Oficial',
    sev: 'Média',
    impact: 'Real',
    date: '12/10/2023',
    status: 'Analisado',
  },
  {
    id: 'FB-02',
    source: 'Pesquisa Clima',
    cat: 'Cultura / Pessoal',
    sev: 'Baixa',
    impact: 'Potencial',
    date: '05/10/2023',
    status: 'Em Análise',
  },
]

const kpis = [
  {
    id: 'KPI-01',
    title: 'Treinamentos Concluídos',
    class: 'Predictive (Leading)',
    target: '95%',
    current: '88%',
    trend: 'up',
  },
  {
    id: 'KPI-02',
    title: 'Tempo de Resposta Canal',
    class: 'Reactive (Lagging)',
    target: '< 5d',
    current: '4d',
    trend: 'stable',
  },
]

const reports = [
  {
    id: 'REP-01',
    title: 'Relatório Executivo Trimestral',
    type: 'Periódico',
    author: 'Compliance Officer',
    date: '01/10/2023',
    status: 'Aprovado',
  },
  {
    id: 'REP-02',
    title: 'Relatório Extraordinário (Vazamento)',
    type: 'Extraordinário',
    author: 'DPO',
    date: '15/10/2023',
    status: 'Em Revisão',
  },
]

const chartData = [
  { month: 'Mai', kpi01: 75, kpi02: 8 },
  { month: 'Jun', kpi01: 80, kpi02: 7 },
  { month: 'Jul', kpi01: 82, kpi02: 6 },
  { month: 'Ago', kpi01: 85, kpi02: 5 },
  { month: 'Set', kpi01: 88, kpi02: 4 },
]

export function MonitoringEvaluation91() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">9.1 Monitoramento, Medição e Análise</h3>
          <p className="text-sm text-muted-foreground">
            Ingestão de feedback, motor de KPIs, relatórios de compliance e manutenção de registros.
          </p>
        </div>
      </div>

      <Tabs defaultValue="feedback">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="feedback" className="py-2 text-xs sm:text-sm">
            9.1.2 Feedbacks
          </TabsTrigger>
          <TabsTrigger value="kpis" className="py-2 text-xs sm:text-sm">
            9.1.3 KPIs
          </TabsTrigger>
          <TabsTrigger value="reports" className="py-2 text-xs sm:text-sm">
            9.1.4 Relatórios
          </TabsTrigger>
          <TabsTrigger value="records" className="py-2 text-xs sm:text-sm">
            9.1.5 Registros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" /> Fontes de Feedback
            </h4>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Novo Feedback
            </Button>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref.</TableHead>
                  <TableHead>Origem / Fonte</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Gravidade</TableHead>
                  <TableHead>Impacto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((fb) => (
                  <TableRow key={fb.id}>
                    <TableCell className="font-mono text-xs">{fb.id}</TableCell>
                    <TableCell className="font-medium text-sm">{fb.source}</TableCell>
                    <TableCell className="text-sm">{fb.cat}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          fb.sev === 'Alta'
                            ? 'text-destructive border-destructive/50'
                            : 'text-amber-600 border-amber-500/50'
                        }
                      >
                        {fb.sev}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{fb.impact}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{fb.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="kpis">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Motor de Indicadores
            </h4>
            <Button size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" /> Exportar KPIs
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-3 rounded-md border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicador</TableHead>
                    <TableHead>Classificação</TableHead>
                    <TableHead>Meta</TableHead>
                    <TableHead>Atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpis.map((k) => (
                    <TableRow key={k.id}>
                      <TableCell className="font-medium text-sm">{k.title}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{k.class}</TableCell>
                      <TableCell className="text-sm font-semibold">{k.target}</TableCell>
                      <TableCell className="text-sm text-primary font-bold">{k.current}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Card className="md:col-span-2">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <h5 className="text-xs font-semibold mb-2 text-center text-muted-foreground">
                  Evolução Histórica
                </h5>
                <ChartContainer
                  config={{
                    kpi01: { label: 'Treinamentos', color: 'hsl(var(--primary))' },
                    kpi02: { label: 'Tempo Resposta', color: 'hsl(var(--accent))' },
                  }}
                  className="h-[150px] w-full"
                >
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="kpi01"
                      stroke="var(--color-kpi01)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="kpi02"
                      stroke="var(--color-kpi02)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Relatórios de Compliance
            </h4>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Gerar Relatório
            </Button>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título do Relatório</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status (Workflow)</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-sm">{r.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.author}</TableCell>
                    <TableCell className="text-sm">{r.date}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          r.status === 'Aprovado' ? 'bg-success hover:bg-success' : 'bg-blue-500'
                        }
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="records">
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Archive className="h-10 w-10 mx-auto mb-3 text-slate-400" />
              <h4 className="font-semibold text-foreground">Manutenção de Registros Seguros</h4>
              <p className="text-sm mt-1 max-w-lg mx-auto">
                Todos os relatórios aprovados e medições de KPIs são salvos como "Read-Only" e
                mantidos conforme a política de retenção definida no Módulo 7.5. Possuem trilha
                completa de auditoria (Audit Trail).
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
