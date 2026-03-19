import { useState } from 'react'
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
import { RiskMatrix } from '../../shared/RiskMatrix'
import { Download, Plus } from 'lucide-react'

const risksData = [
  {
    id: 'R01',
    cat: 'Fraude',
    event: 'Pagamento indevido',
    controls: 'Aprovação dupla',
    i: 4,
    p: 3,
    ri: 2,
    rp: 2,
    treat: 'Mitigar',
  },
  {
    id: 'R02',
    cat: 'Corrupção',
    event: 'Propina a agente',
    controls: 'Due Diligence',
    i: 5,
    p: 2,
    ri: 5,
    rp: 4,
    treat: 'Evitar',
  },
  {
    id: 'R03',
    cat: 'Trabalhista',
    event: 'Assédio moral',
    controls: 'Treinamento, Canal',
    i: 3,
    p: 4,
    ri: 2,
    rp: 2,
    treat: 'Mitigar',
  },
]

export function RiskAssessment() {
  const [view, setView] = useState('inherent')

  const matrixPoints = risksData.map((r) => ({
    id: r.id,
    i: view === 'inherent' ? r.i : r.ri,
    p: view === 'inherent' ? r.p : r.rp,
  }))

  const hasCritical = risksData.some((r) => r.ri >= 4 && r.rp >= 4)
  const aiSuggestion = hasCritical
    ? 'AI Risk Agent: Detectamos alta probabilidade de R02 (Corrupção) em operações recentes. Sugerimos elevar controles (8.1) e rever Impacto Residual.'
    : undefined

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Avaliação de Riscos de Compliance</h3>
          <p className="text-sm text-muted-foreground">
            Matriz de calor, análise inerente vs residual e tratamento.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Matriz de Risco
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Risco
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead>Evento / Causa</TableHead>
                  <TableHead className="text-center">Inerente</TableHead>
                  <TableHead className="text-center">Residual</TableHead>
                  <TableHead>Tratamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risksData.map((r) => {
                  const scoreInerente = r.i * r.p
                  const scoreResidual = r.ri * r.rp
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {r.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{r.event}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Cat: {r.cat}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            scoreInerente > 10
                              ? 'bg-red-50 text-red-700'
                              : 'bg-orange-50 text-orange-700'
                          }
                        >
                          {scoreInerente} ({r.p}x{r.i})
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            scoreResidual <= 4
                              ? 'bg-green-50 text-green-700'
                              : scoreResidual >= 16
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-yellow-50 text-yellow-700'
                          }
                        >
                          {scoreResidual} ({r.rp}x{r.ri})
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md">
                          {r.treat}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-muted/20 p-4 rounded-lg border">
          <Tabs value={view} onValueChange={setView} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="inherent">Inerente</TabsTrigger>
              <TabsTrigger value="residual">Residual</TabsTrigger>
            </TabsList>
            <div className="bg-white p-2 rounded border shadow-sm">
              <RiskMatrix points={matrixPoints} aiSuggestion={aiSuggestion} />
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
