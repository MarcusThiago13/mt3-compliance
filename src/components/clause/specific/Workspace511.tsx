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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Download, MessageSquare } from 'lucide-react'

export function Workspace511() {
  const deliberations = [
    {
      id: 'D-01',
      date: '10/10/2023',
      agenda: 'Aprovação da Política de Brindes',
      decision: 'Aprovada com ressalvas',
      status: 'Concluído',
    },
    {
      id: 'D-02',
      date: '15/11/2023',
      agenda: 'Revisão do Orçamento de Compliance',
      decision: 'Aumento de 15% aprovado',
      status: 'Concluído',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md">Recursos e Suporte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Orçamento Anual (R$)</Label>
                <Input defaultValue="250.000,00" />
              </div>
              <div className="space-y-2">
                <Label>Tamanho da Equipe (FTE)</Label>
                <Input type="number" defaultValue="3" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sistemas e Ferramentas</Label>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">Canal de Denúncias Terceirizado</Badge>
                <Badge variant="secondary">Software de Due Diligence</Badge>
                <Badge variant="outline" className="border-dashed cursor-pointer hover:bg-muted">
                  <Plus className="h-3 w-3 mr-1" /> Adicionar
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-md">Comunicação Institucional</CardTitle>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Mensagem do CEO - Dia da Integridade</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Público: Todos os Colaboradores | 09/12/2023
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Reforço da Política Anti-Retaliação</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Público: Gestores | 15/01/2024
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-md">Registro de Deliberações do Conselho</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Relatório
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Pauta</TableHead>
                <TableHead>Decisão</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliberations.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="text-sm">{d.date}</TableCell>
                  <TableCell className="text-sm font-medium">{d.agenda}</TableCell>
                  <TableCell className="text-sm">{d.decision}</TableCell>
                  <TableCell>
                    <Badge className="bg-success hover:bg-success/90">{d.status}</Badge>
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
