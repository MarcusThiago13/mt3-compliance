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
  Target,
  TrendingUp,
  AlertTriangle,
  BarChart,
  FileText,
  Activity,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const objectives = [
  {
    id: 'OBJ-01',
    title: 'Garantir 100% de adesão ao Código de Conduta',
    category: 'Cultura',
    foundation: 'Obrigação: Código de Ética',
    unit: 'Geral',
    deadline: '31/12/2023',
    progress: 85,
  },
  {
    id: 'OBJ-02',
    title: 'Reduzir SLA de Resposta do Canal de Denúncias',
    category: 'Operacional',
    foundation: 'Risco: R03 (Trabalhista)',
    unit: 'Compliance',
    deadline: '30/10/2023',
    progress: 100,
  },
]

const plannings = [
  {
    objId: 'OBJ-01',
    what: 'Campanha de Comunicação Interna',
    who: 'Endomarketing',
    when: 'Nov/2023',
    resources: 'Orçamento de R$ 5k para brindes',
  },
  {
    objId: 'OBJ-02',
    what: 'Contratação de Triagem Externa',
    who: 'Compliance',
    when: 'Set/2023',
    resources: 'Contrato de BPO',
  },
]

const metrics = [
  {
    objId: 'OBJ-01',
    kpi: 'Taxa de Aceite de Políticas',
    formula: '(Aceites Registrados / Total Colab) * 100',
    baseline: '60%',
    target: '100%',
    source: 'LMS / Portal RH',
    current: '85%',
  },
  {
    objId: 'OBJ-02',
    kpi: 'SLA Médio de Resposta (Dias)',
    formula: 'Soma(Dias para Resposta) / Total de Relatos',
    baseline: '15 dias',
    target: '< 5 dias',
    source: 'Sistema Integrado de Denúncias',
    current: '4 dias',
  },
]

export function ComplianceObjectives62() {
  const handleExport = (doc: string) => {
    toast({ title: 'Documento Gerado', description: `${doc} exportado com sucesso.` })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">6.2 Objetivos de Compliance e Planejamento</h3>
          <p className="text-sm text-muted-foreground">
            Definição de objetivos SMART, planejamento de ações e metrologia (KPIs).
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('Cadastro Consolidado de Objetivos')}
          >
            <Download className="mr-2 h-4 w-4" /> Relatório de Metas
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Objetivo
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
              <p className="text-sm text-muted-foreground">Objetivos Ativos</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-full shrink-0">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dentro da Meta</p>
              <p className="text-2xl font-bold">6</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-full shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Atenção Crítica</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full shrink-0">
              <BarChart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avanço Médio</p>
              <p className="text-2xl font-bold">75%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="objectives">
        <TabsList className="grid w-full grid-cols-3 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="objectives" className="text-xs sm:text-sm py-2">
            Objetivos e Metas
          </TabsTrigger>
          <TabsTrigger value="planning" className="text-xs sm:text-sm py-2">
            Planejamento (5W2H)
          </TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs sm:text-sm py-2">
            Metrologia e KPIs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="objectives">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Objetivo de Compliance</TableHead>
                  <TableHead>Fundamentação</TableHead>
                  <TableHead>Unidade / Prazo</TableHead>
                  <TableHead className="w-[200px]">Evolução</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {objectives.map((obj) => (
                  <TableRow key={obj.id}>
                    <TableCell className="font-mono text-xs font-semibold">{obj.id}</TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{obj.title}</div>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        Cat: {obj.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {obj.foundation}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{obj.unit}</div>
                      <div className="text-muted-foreground text-xs">{obj.deadline}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={obj.progress} className="h-2 flex-1" />
                        <span className="text-xs font-bold w-9">{obj.progress}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="planning">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref. Obj.</TableHead>
                  <TableHead>O que será feito? (What)</TableHead>
                  <TableHead>Quem? (Who)</TableHead>
                  <TableHead>Quando? (When)</TableHead>
                  <TableHead>Recursos Necessários</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plannings.map((plan, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {plan.objId}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{plan.what}</TableCell>
                    <TableCell className="text-sm">{plan.who}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{plan.when}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {plan.resources}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref. Obj.</TableHead>
                  <TableHead>Indicador (KPI) e Fórmula</TableHead>
                  <TableHead>Base</TableHead>
                  <TableHead>Meta</TableHead>
                  <TableHead>Fonte de Verificação</TableHead>
                  <TableHead className="text-right">Apurado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {m.objId}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm flex items-center gap-1">
                        <Activity className="h-3 w-3 text-primary" /> {m.kpi}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-1">
                        {m.formula}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.baseline}</TableCell>
                    <TableCell className="text-sm font-semibold">{m.target}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.source}</TableCell>
                    <TableCell className="text-right font-bold text-primary text-sm">
                      {m.current}
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
