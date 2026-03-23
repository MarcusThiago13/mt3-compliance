import { BookA, Plus, FileSignature } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const mockPlans = [
  {
    student: 'A. M. Silva (TEA)',
    type: 'PAEE',
    status: 'Aprovado',
    version: 'v2.1',
    nextReview: '10/06/2026',
  },
  {
    student: 'A. M. Silva (TEA)',
    type: 'PEI',
    status: 'Aprovado',
    version: 'v1.0',
    nextReview: '10/06/2026',
  },
  {
    student: 'J. P. Santos (TDAH)',
    type: 'PAEE',
    status: 'Em Elaboração',
    version: 'v1.0',
    nextReview: '-',
  },
]

export function PlanosTab({ tenantId }: { tenantId?: string }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h4 className="text-lg font-semibold flex items-center gap-2 text-blue-900">
          <BookA className="h-5 w-5 text-blue-600" /> Planos Educacionais (PAEE e PEI)
        </h4>
        <div className="flex gap-2">
          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Plus className="mr-2 h-4 w-4" /> Novo PAEE
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Novo PEI
          </Button>
        </div>
      </div>

      <Card className="border-blue-100 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Estudante</TableHead>
                <TableHead>Instrumento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead>Próxima Revisão</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPlans.map((p, i) => (
                <TableRow key={i} className="hover:bg-blue-50/50">
                  <TableCell className="font-medium">{p.student}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        p.type === 'PEI'
                          ? 'border-purple-200 text-purple-700 bg-purple-50'
                          : 'border-blue-200 text-blue-700 bg-blue-50'
                      }
                    >
                      {p.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.status === 'Aprovado' ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-200">
                        Aprovado
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 border-none hover:bg-amber-200"
                      >
                        Em Elaboração
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.version}
                  </TableCell>
                  <TableCell className="text-sm">{p.nextReview}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileSignature className="h-4 w-4 mr-2" /> Editar
                    </Button>
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
