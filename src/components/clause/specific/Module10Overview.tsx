import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RefreshCcw, AlertTriangle, TrendingUp, CheckCircle2, ListFilter } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const improvementsData = [
  { month: 'Jun', impl: 2, pend: 1 },
  { month: 'Jul', impl: 4, pend: 2 },
  { month: 'Ago', impl: 3, pend: 0 },
  { month: 'Set', impl: 5, pend: 1 },
  { month: 'Out', impl: 7, pend: 3 },
]

const recentActions = [
  {
    id: 'MEL-04',
    type: 'Melhoria',
    title: 'Automação de Background Check',
    status: 'Implementada',
  },
  { id: 'NC-02', type: 'Não Conf.', title: 'Falha em Treinamento RH', status: 'Atrasada' },
  { id: 'MEL-05', type: 'Melhoria', title: 'Revisão Matriz de Risco', status: 'Em Análise' },
]

export function Module10Overview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Visão Geral: Módulo 10 (Melhoria)</h3>
          <p className="text-sm text-muted-foreground">
            Painel consolidado de oportunidades de melhoria e tratamento de não conformidades.
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full shrink-0">
              <TrendingUp className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Melhorias Ativas</p>
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
              <p className="text-sm text-muted-foreground leading-tight">Não Conformidades</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full shrink-0">
              <RefreshCcw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Ações Pendentes</p>
              <p className="text-2xl font-bold">4</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-full shrink-0">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-tight">Eficácia Validada</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" /> Ciclos de Melhoria (Evolução)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                impl: { label: 'Implementadas', color: 'hsl(var(--success))' },
                pend: { label: 'Pendentes', color: 'hsl(var(--primary))' },
              }}
              className="h-[200px] w-full"
            >
              <BarChart
                data={improvementsData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="impl" stackId="a" fill="var(--color-impl)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="pend" stackId="a" fill="var(--color-pend)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <ListFilter className="h-5 w-5 text-muted-foreground" /> Ações em Destaque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref / Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActions.map((act) => (
                  <TableRow key={act.id}>
                    <TableCell>
                      <div className="font-mono text-xs font-semibold">{act.id}</div>
                      <Badge variant="secondary" className="text-[10px] mt-1">
                        {act.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{act.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          act.status === 'Implementada'
                            ? 'bg-success/10 text-success border-success/20'
                            : act.status === 'Atrasada'
                              ? 'bg-destructive/10 text-destructive border-destructive/20'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                        }
                      >
                        {act.status}
                      </Badge>
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
