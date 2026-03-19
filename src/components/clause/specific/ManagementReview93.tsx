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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Plus, Users, LayoutList, Share2 } from 'lucide-react'

const meetings = [
  {
    id: 'REV-2023-S2',
    date: '10/10/2023',
    type: 'Semestral',
    status: 'Realizada',
    participants: 'Diretoria, Compliance Officer',
  },
  {
    id: 'REV-2024-S1',
    date: '10/04/2024',
    type: 'Semestral',
    status: 'Agendada',
    participants: 'A Definir',
  },
]

const outputs = [
  {
    id: 'OUT-01',
    meeting: 'REV-2023-S2',
    decision: 'Aprovar orçamento adicional para Treinamentos EAD',
    domain: 'Recursos',
    status: 'Aprovada',
  },
  {
    id: 'OUT-02',
    meeting: 'REV-2023-S2',
    decision: 'Revisão da matriz de risco focando no novo produto',
    domain: 'Estrutura SGC',
    status: 'Pendente Ação',
  },
]

export function ManagementReview93() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">9.3 Revisão pela Direção</h3>
          <p className="text-sm text-muted-foreground">
            Gestão das reuniões de alta direção, análise crítica de dados de desempenho e
            formalização de saídas.
          </p>
        </div>
      </div>

      <Tabs defaultValue="meetings">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="meetings" className="py-2 text-xs sm:text-sm">
            Reuniões e Pautas
          </TabsTrigger>
          <TabsTrigger value="outputs" className="py-2 text-xs sm:text-sm">
            Decisões e Saídas
          </TabsTrigger>
          <TabsTrigger value="governance" className="py-2 text-xs sm:text-sm">
            Reporte de Governança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meetings">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Workspace de Reuniões
            </h4>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Nova Reunião
            </Button>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref.</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ata/Pauta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-xs">{m.id}</TableCell>
                    <TableCell className="text-sm font-semibold">{m.date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.type}</TableCell>
                    <TableCell className="text-sm">{m.participants}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          m.status === 'Realizada' ? 'bg-success/10 text-success' : 'bg-slate-100'
                        }
                      >
                        {m.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver Documentos
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="outputs">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <LayoutList className="h-4 w-4 text-primary" /> Decisões (Saídas da Revisão)
            </h4>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref. Decisão</TableHead>
                  <TableHead>Reunião Origem</TableHead>
                  <TableHead>Decisão / Recomendação</TableHead>
                  <TableHead>Domínio Impactado</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outputs.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{o.meeting}</TableCell>
                    <TableCell className="font-medium text-sm">{o.decision}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{o.domain}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          o.status === 'Aprovada'
                            ? 'border-success text-success'
                            : 'border-amber-500 text-amber-600'
                        }
                      >
                        {o.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="governance">
          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full shrink-0">
                  <Share2 className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">
                    Distribuição ao Órgão de Governança
                  </h4>
                  <p className="text-sm text-blue-800 mt-1 mb-4 max-w-2xl">
                    Os resultados da Análise Crítica da Direção e relatórios de compliance devem ser
                    formalmente reportados ao Órgão de Governança (ex: Conselho de Administração)
                    para assegurar o dever de supervisão.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Share2 className="mr-2 h-4 w-4" /> Gerar Pacote de Reporte
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
