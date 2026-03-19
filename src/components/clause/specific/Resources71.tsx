import { Card, CardContent } from '@/components/ui/card'
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
import { Download, Plus, DollarSign, Users, Monitor, Book } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const resources = [
  {
    id: 'REC-01',
    type: 'Financeiro',
    desc: 'Orçamento Anual Compliance',
    purpose: 'Custeio de softwares, auditorias e equipe',
    unit: 'Compliance',
    availability: '100%',
    sufficiency: 'Suficiente',
    link: 'Obj: OBJ-01',
    icon: DollarSign,
  },
  {
    id: 'REC-02',
    type: 'Humano',
    desc: 'Analista de Compliance Sênior',
    purpose: 'Gestão do Canal de Denúncias',
    unit: 'RH / Compliance',
    availability: 'Pendente',
    sufficiency: 'Insuficiente',
    link: 'Risco: R03',
    icon: Users,
  },
  {
    id: 'REC-03',
    type: 'Tecnológico',
    desc: 'Sistema de GED (ISO 37301)',
    purpose: 'Controle de Informação Documentada',
    unit: 'TI',
    availability: 'Operacional',
    sufficiency: 'Suficiente',
    link: 'Req: 7.5',
    icon: Monitor,
  },
  {
    id: 'REC-04',
    type: 'Materiais',
    desc: 'Cartilhas Físicas de Integridade',
    purpose: 'Conscientização em filiais operacionais',
    unit: 'Comunicação',
    availability: 'Limitada',
    sufficiency: 'Em Avaliação',
    link: 'Req: 7.3',
    icon: Book,
  },
]

export function Resources71() {
  const handleExport = () => {
    toast({
      title: 'Relatório Gerado',
      description: 'Relatório de Suficiência de Recursos exportado com sucesso.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">7.1 Recursos</h3>
          <p className="text-sm text-muted-foreground">
            Planejamento e monitoramento de recursos financeiros, humanos, técnicos e tecnológicos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Suficiência de Recursos
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Recurso
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-6">
        {[
          { label: 'Recursos Totais', value: 12, icon: Book, color: 'text-primary' },
          { label: 'Suficientes', value: 8, icon: DollarSign, color: 'text-success' },
          { label: 'Em Avaliação', value: 3, icon: Monitor, color: 'text-amber-500' },
          { label: 'Insuficientes', value: 1, icon: Users, color: 'text-destructive' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-full shrink-0 bg-muted`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ref.</TableHead>
              <TableHead>Descrição do Recurso</TableHead>
              <TableHead>Propósito</TableHead>
              <TableHead>Unidade Responsável</TableHead>
              <TableHead>Disponibilidade</TableHead>
              <TableHead>Suficiência</TableHead>
              <TableHead>Vinculação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((res) => {
              const Icon = res.icon
              return (
                <TableRow key={res.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {res.id}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" /> {res.desc}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Tipo: {res.type}</div>
                  </TableCell>
                  <TableCell className="text-sm">{res.purpose}</TableCell>
                  <TableCell className="text-sm">{res.unit}</TableCell>
                  <TableCell className="text-sm">{res.availability}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        res.sufficiency === 'Suficiente'
                          ? 'bg-success/10 text-success border-success/20'
                          : res.sufficiency === 'Insuficiente'
                            ? 'bg-destructive/10 text-destructive border-destructive/20'
                            : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                      }
                    >
                      {res.sufficiency}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {res.link}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
