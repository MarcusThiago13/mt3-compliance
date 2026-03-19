import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Target, BarChart, TrendingUp, Plus } from 'lucide-react'

export function Culture512() {
  const actions = [
    { id: 1, name: 'Semana do Compliance', target: 'Geral', date: 'Out/2023', impact: 'Alto' },
    {
      id: 2,
      name: 'Treinamento de Liderança Ética',
      target: 'Gestores',
      date: 'Jan/2024',
      impact: 'Médio',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <BarChart className="h-4 w-4 text-primary" /> Pesquisa de Percepção de Cultura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>A Alta Direção lidera pelo exemplo?</span>
                <span className="font-bold text-success">85%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Sinto segurança para relatar desvios?</span>
                <span className="font-bold text-amber-500">65%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>As regras são aplicadas igualmente a todos?</span>
                <span className="font-bold text-success">78%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: '78%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Planos de Fortalecimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-md border-amber-200 bg-amber-50">
              <h4 className="font-semibold text-sm text-amber-800">
                Aumentar Segurança Psicológica
              </h4>
              <p className="text-xs text-amber-700 mt-1">
                Meta: Subir indicador de 65% para 80% até Q4.
              </p>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline" className="bg-white">
                  Em andamento
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Novo Plano de Ação
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-md flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Ações Promotoras de Cultura
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" /> Nova Ação
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ação</TableHead>
                <TableHead>Público-Alvo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Impacto Estimado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium text-sm">{a.name}</TableCell>
                  <TableCell className="text-sm">{a.target}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{a.impact}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
