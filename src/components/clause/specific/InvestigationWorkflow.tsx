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
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Clock, Target, Gavel, FileSignature, Sparkles } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { ActionMotor5W2HModal } from '@/components/shared/ActionMotor5W2HModal'

const investigations = [
  {
    id: 'INV-2023-042',
    origin: 'TKT-23-087',
    foundation: 'Suspeita de favorecimento em licitação',
    team: 'Comitê Ética',
    status: 'Em Análise',
    acts: 4,
    days: 12,
  },
  {
    id: 'INV-2023-045',
    origin: 'TKT-23-088',
    foundation: 'Relato de assédio moral continuado',
    team: 'RH Especializado',
    status: 'Instaurada',
    acts: 0,
    days: 2,
  },
  {
    id: 'INV-2023-038',
    origin: 'Auditoria Int.',
    foundation: 'Inconsistência contábil na Filial Sul',
    team: 'Auditoria',
    status: 'Concluída',
    acts: 12,
    days: 45,
  },
]

export function InvestigationWorkflow() {
  const [is5W2HOpen, setIs5W2HOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const open5W2H = (inv: any) => {
    setSelectedItem(inv)
    setIs5W2HOpen(true)
  }

  const handleSave5W2H = (plan: any) => {
    toast({
      title: 'Plano de Investigação',
      description: 'Metodologia e passos investigativos estruturados via 5W2H.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">8.4 Processo de Investigação</h3>
          <p className="text-sm text-muted-foreground">
            Workflow completo desde a instauração, análise de causa-raiz até sanções e aprendizado.
          </p>
        </div>
      </div>

      <Tabs defaultValue="cases">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="cases" className="py-2">
            Casos (Painel Geral)
          </TabsTrigger>
          <TabsTrigger value="analysis" className="py-2">
            Causa-Raiz e Vulnerabilidades
          </TabsTrigger>
          <TabsTrigger value="response" className="py-2">
            Respostas e Sanções
          </TabsTrigger>
          <TabsTrigger value="learning" className="py-2">
            Reporte e Lições
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocolo / Origem</TableHead>
                  <TableHead>Fundamentação (Escopo)</TableHead>
                  <TableHead>Equipe / Investigador</TableHead>
                  <TableHead className="text-center">Atos Registrados</TableHead>
                  <TableHead>Status / SLA</TableHead>
                  <TableHead className="text-right">Gerenciar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investigations.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <div className="font-mono text-xs font-semibold">{inv.id}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Ref: {inv.origin}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{inv.foundation}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inv.team}</TableCell>
                    <TableCell className="text-center font-mono text-sm">{inv.acts}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            inv.status === 'Concluída'
                              ? 'bg-slate-100'
                              : 'bg-amber-50 text-amber-700'
                          }
                        >
                          {inv.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {inv.days}d
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right flex flex-col gap-1 items-end">
                      <Button variant="secondary" size="sm" className="w-full">
                        Abrir Autos
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => open5W2H(inv)}
                        className="w-full h-7 text-[10px] px-2 text-purple-700 border-purple-200 hover:bg-purple-50"
                      >
                        <Sparkles className="mr-1 h-2.5 w-2.5" /> Plano IA
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Target className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Selecione um caso ativo no painel geral para documentar a análise de causa-raiz,
                extensão da não-conformidade e níveis hierárquicos envolvidos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response">
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Gavel className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Área para registro de medidas disciplinares aplicadas, planos de remediação imediata
                e aprovação de encerramento do comitê.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              <FileSignature className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Histórico de reportes regulatórios (autodeclaração) e banco de lições aprendidas
                para atualizar as políticas e matriz de risco (Feedback Loop para o Módulo 4).
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ActionMotor5W2HModal
        isOpen={is5W2HOpen}
        onOpenChange={setIs5W2HOpen}
        title={`Plano de Investigação: ${selectedItem?.id}`}
        promptContext={`Investigação de Denúncia\nFundamentação: ${selectedItem?.foundation}\nOrigem: ${selectedItem?.origin}\nCrie um plano metodológico de investigação 5W2H estrito, incluindo coleta de evidências, entrevistas e preservação de cadeia de custódia.`}
        onSave={handleSave5W2H}
      />
    </div>
  )
}
