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
import { Download, Plus, Target, Layers, ArrowRightCircle, CheckCircle2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const improvements = [
  {
    id: 'MEL-001',
    title: 'Automação do Due Diligence',
    origin: 'Auditoria (9.2)',
    type: 'Ajuste Sistêmico',
    status: 'Em Implementação',
    progress: 60,
  },
  {
    id: 'MEL-002',
    title: 'Revisão da Política de Brindes',
    origin: 'Revisão da Direção (9.3)',
    type: 'Ajuste de Política',
    status: 'Em Análise',
    progress: 10,
  },
  {
    id: 'MEL-003',
    title: 'Dashboard de Indicadores em Tempo Real',
    origin: 'Feedback (9.1)',
    type: 'Melhoria Contínua',
    status: 'Validada',
    progress: 100,
  },
]

const impacts = [
  {
    id: 'MEL-001',
    affected: ['R02 (Corrupção)', 'Procedimento Due Diligence v3', 'Controles 8.1'],
    impact: 'Redução do Risco Residual, Alteração de Fluxo',
  },
  {
    id: 'MEL-002',
    affected: ['Política de Compliance (5.2)', 'Treinamento (7.2)'],
    impact: 'Necessidade de Retreinamento, Alteração Documental',
  },
]

export function ContinualImprovement101() {
  const handleExport = () => {
    toast({
      title: 'Relatório Gerado',
      description: 'Registro de Oportunidades de Melhoria exportado.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">10.1 Melhoria Contínua</h3>
          <p className="text-sm text-muted-foreground">
            Gestão de oportunidades de evolução do SGC baseadas em dados e feedback.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Relatório de Melhorias
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Oportunidade
          </Button>
        </div>
      </div>

      <Tabs defaultValue="opportunities">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="opportunities" className="py-2 text-xs sm:text-sm">
            Oportunidades de Melhoria
          </TabsTrigger>
          <TabsTrigger value="impact" className="py-2 text-xs sm:text-sm">
            Análise de Impacto Sistêmico
          </TabsTrigger>
          <TabsTrigger value="tracking" className="py-2 text-xs sm:text-sm">
            Acompanhamento (Workflow)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref.</TableHead>
                  <TableHead>Título / Descrição</TableHead>
                  <TableHead>Origem (Gatilho)</TableHead>
                  <TableHead>Tipo de Mudança</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {improvements.map((imp) => (
                  <TableRow key={imp.id}>
                    <TableCell className="font-mono text-xs">{imp.id}</TableCell>
                    <TableCell className="font-medium text-sm flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" /> {imp.title}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{imp.origin}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {imp.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          imp.status === 'Validada'
                            ? 'bg-success/10 text-success'
                            : 'bg-blue-50 text-blue-700'
                        }
                      >
                        {imp.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="impact">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref. Melhoria</TableHead>
                  <TableHead>Elementos do SGC Afetados</TableHead>
                  <TableHead>Impacto Sistêmico Esperado</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {impacts.map((imp, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">{imp.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {imp.affected.map((aff, j) => (
                          <Badge key={j} variant="outline" className="text-[10px] bg-slate-50">
                            {aff}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{imp.impact}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Atualizar Módulos
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="tracking">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref.</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Progresso de Implementação</TableHead>
                  <TableHead>Validação Final</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {improvements.map((imp) => (
                  <TableRow key={imp.id}>
                    <TableCell className="font-mono text-xs">{imp.id}</TableCell>
                    <TableCell className="font-medium text-sm">{imp.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={imp.progress} className="h-2 flex-1" />
                        <span className="text-xs font-mono">{imp.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {imp.progress === 100 ? (
                        <span className="flex items-center gap-1 text-xs text-success font-semibold">
                          <CheckCircle2 className="h-4 w-4" /> Eficaz
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Layers className="h-4 w-4" /> Pendente
                        </span>
                      )}
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
