import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle, Plus } from 'lucide-react'

export function Governance513() {
  const conflicts = [
    {
      id: 1,
      person: 'Carlos Souza (Diretor)',
      type: 'Sociedade em Fornecedor',
      mitigation: 'Afastado de aprovações de compras',
      status: 'Monitorado',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Mapeamento da Estrutura de Governança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 py-6 bg-muted/20 rounded-lg border overflow-x-auto">
            <div className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md shadow-sm">
              Órgão de Governança (Conselho)
            </div>
            <div className="h-6 w-px bg-border"></div>
            <div className="px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-md shadow-sm border">
              Alta Direção (CEO)
            </div>
            <div className="flex w-full min-w-[320px] max-w-md justify-around items-start pt-4 relative">
              <div className="absolute top-0 left-1/2 w-1/2 h-px bg-border -translate-x-1/2"></div>
              <div className="absolute top-0 left-1/4 h-4 w-px bg-border"></div>
              <div className="absolute top-0 right-1/4 h-4 w-px bg-border"></div>

              <div className="flex flex-col items-center mt-4">
                <div className="px-3 py-1.5 bg-accent/10 text-accent-foreground text-sm font-medium rounded-md border border-accent/20 shadow-sm flex items-center gap-2">
                  Função de Compliance
                  <Badge className="bg-success hover:bg-success text-[10px] h-4">
                    Independente
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-center mt-4">
                <div className="px-3 py-1.5 bg-card text-card-foreground text-sm font-medium rounded-md border shadow-sm">
                  Demais Diretorias
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md">Acesso e Reporte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div>
                <Label className="text-sm font-semibold">Acesso Direto ao Conselho</Label>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px]">
                  A Função de Compliance possui linha de reporte independente?
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Avaliação de Independência</Label>
              <Textarea
                className="text-sm min-h-[80px]"
                defaultValue="A função de compliance está livre de conflitos operacionais e tem autonomia para investigar qualquer nível hierárquico."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-md flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" /> Conflitos de Interesse
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pessoa</TableHead>
                    <TableHead>Mitigação</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conflicts.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-xs font-medium whitespace-nowrap">
                        {c.person}
                      </TableCell>
                      <TableCell className="text-xs min-w-[150px]">{c.mitigation}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {c.status}
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
    </div>
  )
}
