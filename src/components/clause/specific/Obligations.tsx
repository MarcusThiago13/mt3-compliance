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
import { Download, Plus } from 'lucide-react'

const obsData = [
  {
    id: 'OBL-01',
    type: 'Mandatória',
    source: 'Lei Anticorrupção (12.846/13)',
    area: 'Jurídico',
    date: 'Contínuo',
    status: 'Conforme',
  },
  {
    id: 'OBL-02',
    type: 'Mandatória',
    source: 'LGPD (13.709/18)',
    area: 'TI / DPO',
    date: 'Contínuo',
    status: 'Conforme',
  },
  {
    id: 'OBL-03',
    type: 'Voluntária',
    source: 'Pacto Global da ONU',
    area: 'Sustentabilidade',
    date: 'Anual',
    status: 'Em Observação',
  },
  {
    id: 'OBL-04',
    type: 'Voluntária',
    source: 'Código de Ética Interno',
    area: 'Compliance',
    date: 'Contínuo',
    status: 'Conforme',
  },
]

export function Obligations() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Obrigações de Compliance</h3>
          <p className="text-sm text-muted-foreground">
            Inventário de leis, regulações e normas voluntárias aplicáveis.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Matriz
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Obrigação
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="mandatory">Mandatórias (Leis/Reg)</TabsTrigger>
          <TabsTrigger value="voluntary">Voluntárias (Normas)</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="m-0">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Fonte / Norma</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Área Responsável</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Status SGC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {obsData.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {o.id}
                    </TableCell>
                    <TableCell className="font-medium">{o.source}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          o.type === 'Mandatória'
                            ? 'border-red-200 text-red-700 bg-red-50'
                            : 'border-blue-200 text-blue-700 bg-blue-50'
                        }
                      >
                        {o.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{o.area}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{o.date}</TableCell>
                    <TableCell>
                      <Badge className={o.status === 'Conforme' ? 'bg-success' : 'bg-amber-500'}>
                        {o.status}
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
