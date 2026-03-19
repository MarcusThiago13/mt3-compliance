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
import { Download, Plus, Send, Landmark, Mail } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const communications = [
  {
    id: 'COM-001',
    audience: 'Público Interno',
    topic: 'Revisão do Código de Conduta',
    channel: 'Intranet / Email',
    date: '01/10/2023',
    owner: 'Comunicação Interna',
    status: 'Enviado',
  },
  {
    id: 'COM-002',
    audience: 'Fornecedores',
    topic: 'Cláusulas de Conformidade',
    channel: 'Portal de Compras',
    date: 'Contínuo',
    owner: 'Suprimentos',
    status: 'Ativo',
  },
]

const regulatoryLogs = [
  {
    id: 'REG-01',
    body: 'CVM',
    interaction: 'Envio de Relatório de Conformidade Anual',
    date: '15/01/2023',
    responsible: 'Jurídico',
    outcome: 'Recebido com Sucesso',
    evidence: 'Recibo_CVM_2023.pdf',
  },
  {
    id: 'REG-02',
    body: 'Ministério Público',
    interaction: 'Resposta a Ofício #123/2023',
    date: '10/05/2023',
    responsible: 'Compliance Officer',
    outcome: 'Arquivado (Sem Ressalvas)',
    evidence: 'Oficio_Resposta.pdf',
  },
]

export function Communication74() {
  const handleExport = () => {
    toast({
      title: 'Exportação Concluída',
      description: 'Registro de Interações Regulatórias exportado.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">7.4 Comunicação</h3>
          <p className="text-sm text-muted-foreground">
            Planos de comunicação interna e externa e registro de interações com autoridades.
          </p>
        </div>
      </div>

      <Tabs defaultValue="plan">
        <TabsList className="grid w-full grid-cols-2 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="plan" className="text-xs sm:text-sm py-2">
            Plano de Comunicação (Geral)
          </TabsTrigger>
          <TabsTrigger value="regulatory" className="text-xs sm:text-sm py-2">
            Interações Regulatórias (Logs)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan">
          <div className="flex justify-end mb-4">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Planejar Comunicação
            </Button>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Público-Alvo</TableHead>
                  <TableHead>O que comunicar (Tópico)</TableHead>
                  <TableHead>Como comunicar (Canal)</TableHead>
                  <TableHead>Quando (Prazo)</TableHead>
                  <TableHead>Quem comunica (Resp.)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communications.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-sm flex items-center gap-2">
                      <Send className="h-4 w-4 text-primary" /> {c.audience}
                    </TableCell>
                    <TableCell className="text-sm">{c.topic}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.channel}</TableCell>
                    <TableCell className="text-sm font-semibold">{c.date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.owner}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          c.status === 'Enviado'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="regulatory">
          <div className="flex justify-end mb-4 gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Exportar Logs
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Registrar Interação
            </Button>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Órgão / Autoridade</TableHead>
                  <TableHead>Descrição da Interação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Responsável (Interno)</TableHead>
                  <TableHead>Desfecho</TableHead>
                  <TableHead>Evidência (GED)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regulatoryLogs.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-sm flex items-center gap-2">
                      <Landmark className="h-4 w-4 text-amber-600" /> {r.body}
                    </TableCell>
                    <TableCell className="text-sm">{r.interaction}</TableCell>
                    <TableCell className="text-sm">{r.date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.responsible}</TableCell>
                    <TableCell className="text-sm">{r.outcome}</TableCell>
                    <TableCell>
                      <span className="text-xs text-blue-600 underline cursor-pointer">
                        {r.evidence}
                      </span>
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
