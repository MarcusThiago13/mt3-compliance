import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function Roles533() {
  const managers = [
    { area: 'Vendas', name: 'Roberto Lima', kpi: 'Treinamentos 100%', status: 'Atualizado' },
    { area: 'Suprimentos', name: 'Carla Dias', kpi: 'Due Diligence 100%', status: 'Atualizado' },
    {
      area: 'Financeiro',
      name: 'João Alves',
      kpi: 'Conciliação em D+1',
      status: 'Pendente Revisão',
    },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Desdobramento para Gestores (Middle Management)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground mb-4 border">
            A média gerência é responsável por garantir que as políticas sejam implementadas na
            prática, engajando sua equipe e garantindo que os riscos locais sejam mitigados.
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Área / Departamento</TableHead>
                  <TableHead>Gestor Responsável</TableHead>
                  <TableHead>KPI Específico (Compliance)</TableHead>
                  <TableHead>Status JD (Job Description)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((m) => (
                  <TableRow key={m.area}>
                    <TableCell className="font-medium text-sm whitespace-nowrap">
                      {m.area}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{m.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.kpi}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          m.status === 'Atualizado'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }
                      >
                        {m.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
