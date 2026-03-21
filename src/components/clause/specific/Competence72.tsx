import { useState } from 'react'
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
import { Download, UserCheck, AlertTriangle, BookOpen, RefreshCw, Sparkles } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { ActionMotor5W2HModal } from '@/components/shared/ActionMotor5W2HModal'

const gaps = [
  {
    role: 'Gerente Financeiro',
    comp: 'Legislação Anticorrupção',
    current: 'Básico',
    required: 'Avançado',
    action: 'Plano de Desenvolvimento (EAD)',
    status: 'Pendente',
  },
  {
    role: 'Comprador Pleno',
    comp: 'Due Diligence de Terceiros',
    current: 'Intermediário',
    required: 'Intermediário',
    action: '-',
    status: 'Adequado',
  },
]

const dueDiligence = [
  {
    candidate: 'João Silva',
    role: 'Diretor Comercial',
    type: 'Promoção',
    background: 'Limpo',
    conflict: 'Declarado (Mitigado)',
    status: 'Aprovado',
  },
  {
    candidate: 'Maria Souza',
    role: 'Analista Financeiro',
    type: 'Nova Contratação',
    background: 'Pendente',
    conflict: '-',
    status: 'Em Análise',
  },
]

const retraining = [
  {
    trigger: 'Mudança Regulatória (Nova Lei)',
    audience: 'Vendas, Jurídico',
    deadline: '30/11/2023',
    status: 'Agendado',
  },
  {
    trigger: 'Promoção para Cargo Crítico',
    audience: 'Novos Diretores',
    deadline: 'Imediato',
    status: 'Contínuo',
  },
]

export function Competence72() {
  const [is5W2HOpen, setIs5W2HOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const handleExport = (doc: string) => {
    toast({ title: 'Relatório Gerado', description: `${doc} exportado com sucesso.` })
  }

  const open5W2H = (r: any) => {
    setSelectedItem(r)
    setIs5W2HOpen(true)
  }

  const handleSave5W2H = (plan: any) => {
    toast({
      title: 'Treinamento Planejado',
      description: 'Plano 5W2H do treinamento gerado com sucesso.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">7.2 Competência e Treinamento</h3>
          <p className="text-sm text-muted-foreground">
            Gestão de competências, due diligence em contratações críticas e treinamentos contínuos.
          </p>
        </div>
      </div>

      <Tabs defaultValue="721">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="721" className="text-xs sm:text-sm py-2">
            7.2.1 Geral (Mapa e Lacunas)
          </TabsTrigger>
          <TabsTrigger value="722" className="text-xs sm:text-sm py-2">
            7.2.2 Contratação (Due Diligence)
          </TabsTrigger>
          <TabsTrigger value="723" className="text-xs sm:text-sm py-2">
            7.2.3 Treinamentos e Retreinamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="721">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('Matriz de Competências')}
            >
              <Download className="mr-2 h-4 w-4" /> Exportar Matriz
            </Button>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Função / Cargo</TableHead>
                  <TableHead>Competência Requerida</TableHead>
                  <TableHead>Nível Atual</TableHead>
                  <TableHead>Nível Mínimo</TableHead>
                  <TableHead>Ação Corretiva (Gap)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gaps.map((g, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{g.role}</TableCell>
                    <TableCell className="text-sm">{g.comp}</TableCell>
                    <TableCell className="text-sm">{g.current}</TableCell>
                    <TableCell className="text-sm font-semibold">{g.required}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{g.action}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          g.status === 'Adequado'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                        }
                      >
                        {g.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="722">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato / Colaborador</TableHead>
                  <TableHead>Cargo Alvo (Crítico)</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Background Check</TableHead>
                  <TableHead>Conflito de Interesses</TableHead>
                  <TableHead>Status Parecer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dueDiligence.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-primary" /> {d.candidate}
                    </TableCell>
                    <TableCell className="text-sm">{d.role}</TableCell>
                    <TableCell className="text-sm">{d.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.background}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.conflict}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          d.status === 'Aprovado'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                        }
                      >
                        {d.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="723" className="space-y-6">
          <Card>
            <CardContent className="p-4 flex items-start gap-4">
              <BookOpen className="h-8 w-8 text-primary mt-1" />
              <div>
                <h4 className="font-semibold text-md">Motor de Retreinamentos Automatizados</h4>
                <p className="text-sm text-muted-foreground">
                  Gatilhos configurados para disparar necessidades de treinamento baseadas em
                  alterações organizacionais ou de contexto.
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gatilho de Retreinamento (Trigger)</TableHead>
                  <TableHead>Público-Alvo</TableHead>
                  <TableHead>Prazo Limite</TableHead>
                  <TableHead>Status Execução</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {retraining.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="font-medium text-sm flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-amber-500" /> {r.trigger}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => open5W2H(r)}
                        className="h-5 text-[10px] px-2 text-purple-700 border-purple-200 hover:bg-purple-50 mt-1"
                      >
                        <Sparkles className="mr-1 h-2.5 w-2.5" /> Planejar Treinamento
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm">{r.audience}</TableCell>
                    <TableCell className="text-sm font-semibold">{r.deadline}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <ActionMotor5W2HModal
        isOpen={is5W2HOpen}
        onOpenChange={setIs5W2HOpen}
        title={`Plano de Treinamento`}
        promptContext={`Treinamento de Compliance\nGatilho: ${selectedItem?.trigger}\nPúblico: ${selectedItem?.audience}\nCrie um plano 5W2H estruturado para este treinamento (logística, instrutores, custos e medição de eficácia).`}
        onSave={handleSave5W2H}
      />
    </div>
  )
}
