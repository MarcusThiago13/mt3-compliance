import { FileText, Plus, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

const mockCases = [
  {
    id: 'CASO-001',
    student: 'A. M. Silva (TEA)',
    status: 'Ativo',
    lastReview: '10/03/2026',
    responsible: 'Ana Paula (Psicóloga)',
  },
  {
    id: 'CASO-002',
    student: 'J. P. Santos (TDAH)',
    status: 'Em Revisão',
    lastReview: '15/03/2026',
    responsible: 'Carlos (Coord. Pedagógica)',
  },
  {
    id: 'CASO-003',
    student: 'M. L. Costa (Baixa Visão)',
    status: 'Ativo',
    lastReview: '05/02/2026',
    responsible: 'Julia (Prof. AEE)',
  },
]

export function EstudosCasoTab({ tenantId }: { tenantId?: string }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h4 className="text-lg font-semibold flex items-center gap-2 text-blue-900">
          <FileText className="h-5 w-5 text-blue-600" /> Registro de Estudos de Caso
        </h4>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Novo Estudo
        </Button>
      </div>

      <Card className="border-blue-100 shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-base">Casos Acompanhados</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar estudante..."
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-md"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Protocolo</TableHead>
                <TableHead>Estudante / Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Revisão</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCases.map((c) => (
                <TableRow key={c.id} className="hover:bg-blue-50/50">
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.student}</TableCell>
                  <TableCell>
                    <Badge
                      variant={c.status === 'Ativo' ? 'default' : 'secondary'}
                      className={
                        c.status === 'Ativo'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none'
                          : ''
                      }
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{c.lastReview}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.responsible}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      Abrir Prontuário
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
