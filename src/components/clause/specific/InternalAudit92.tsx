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
import { Download, Plus, Calendar, ShieldCheck, Search, ActivitySquare, Sparkles } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { ActionMotor5W2HModal } from '@/components/shared/ActionMotor5W2HModal'

const audits = [
  {
    id: 'AUD-2023-01',
    scope: 'Processos Financeiros e Suprimentos',
    criteria: 'ISO 37301 & Lei Anticorrupção',
    date: '01/11/2023',
    status: 'Planejada',
  },
  {
    id: 'AUD-2023-02',
    scope: 'RH e Canal de Denúncias',
    criteria: 'Políticas Internas',
    date: '15/06/2023',
    status: 'Concluída',
  },
]

const auditors = [
  {
    name: 'Roberto Almeida',
    role: 'Auditor Líder',
    indep: 'Assinada',
    conflict: 'Nenhum Identificado',
  },
  {
    name: 'Carla Dias',
    role: 'Auditor Especialista',
    indep: 'Assinada',
    conflict: 'Ex-Gestora de RH (Atenção)',
  },
]

const findings = [
  {
    id: 'ACH-01',
    audit: 'AUD-2023-02',
    desc: 'Falta de evidência de treinamento para 2 gestores',
    class: 'Não Conformidade',
    action: 'Criar Plano no Mód 6',
  },
  {
    id: 'ACH-02',
    audit: 'AUD-2023-02',
    desc: 'SLA de resposta do canal próximo ao limite',
    class: 'Observação',
    action: 'Monitorar',
  },
]

export function InternalAudit92() {
  const [is5W2HOpen, setIs5W2HOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const open5W2H = (audit: any) => {
    setSelectedItem(audit)
    setIs5W2HOpen(true)
  }

  const handleSave5W2H = (plan: any) => {
    toast({ title: 'Plano de Auditoria', description: 'O ciclo de auditoria foi estruturado com a metodologia 5W2H.' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">9.2 Auditoria Interna</h3>
          <p className="text-sm text-muted-foreground">
            Planejamento, independência da equipe, execução e registro de achados.
          </p>
        </div>
      </div>

      <Tabs defaultValue="plan">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="plan" className="py-2 text-xs sm:text-sm">
            Planejamento
          </TabsTrigger>
          <TabsTrigger value="team" className="py-2 text-xs sm:text-sm">
            Independência (Equipe)
          </TabsTrigger>
          <TabsTrigger value="execution" className="py-2 text-xs sm:text-sm">
            Execução & Achados
          </TabsTrigger>
          <TabsTrigger value="followup" className="py-2 text-xs sm:text-sm">
            Acompanhamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Programa de Auditorias
            </h4>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Agendar Auditoria
            </Button>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref.</TableHead>
                  <TableHead>Escopo</TableHead>
                  <TableHead>Critérios Base</TableHead>
                  <TableHead>Data Prevista</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audits.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.id}</TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{a.scope}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => open5W2H(a)}
                        className="h-5 text-[10px] px-2 text-purple-700 border-purple-200 hover:bg-purple-50 mt-1"
                      >
                        <Sparkles className="mr-1 h-2.5 w-2.5" /> IA Plano
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.criteria}</TableCell>
                    <TableCell className="text-sm">{a.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          a.status === 'Concluída'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-blue-50 text-blue-700'
                        }
                      >
                        {a.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Check de Independência
            </h4>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Auditor Designado</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Declaração de Independência</TableHead>
                  <TableHead>Conflito de Interesses Identificado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditors.map((aud, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{aud.name}</TableCell>
                    <TableCell className="text-sm">{aud.role}</TableCell>
                    <TableCell>
                      <Badge className="bg-success hover:bg-success">{aud.indep}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground flex items-center gap-2">
                      {aud.conflict.includes('Atenção') && (
                        <ActivitySquare className="h-4 w-4 text-amber-500" />
                      )}
                      {aud.conflict}
                    </TableCell>
                  </TableRow>
                </))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="execution">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Registro de Achados
            </h4>
            <Button size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" /> Relatório de Auditoria
            </Button>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Achado ID</TableHead>
                  <TableHead>Auditoria Ref.</TableHead>
                  <TableHead>Descrição do Achado</TableHead>
                  <TableHead>Classificação</TableHead>
                  <TableHead>Ação Sistêmica</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {findings.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-mono text-xs">{f.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{f.audit}</TableCell>
                    <TableCell className="font-medium text-sm">{f.desc}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          f.class.includes('Não Conformidade')
                            ? 'border-destructive text-destructive'
                            : 'border-amber-500 text-amber-600'
                        }
                      >
                        {f.class}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" size="sm" className="h-auto p-0 text-blue-600">
                        {f.action}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="followup">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              Os achados classificados como "Não Conformidade" alimentam automaticamente o Módulo 10
              (Melhoria) e Módulo 6 (Ações), gerando planos de ação rastreáveis.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ActionMotor5W2HModal
        isOpen={is5W2HOpen}
        onOpenChange={setIs5W2HOpen}
        title={`Plano de Auditoria: ${selectedItem?.id}`}
        promptContext={`Ciclo de Auditoria Interna\nEscopo: ${selectedItem?.scope}\nCritérios: ${selectedItem?.criteria}\nData: ${selectedItem?.date}\nCrie um plano 5W2H para executar esta auditoria (o que auditar, quem auditará garantindo independência, metodologia de amostragem).`}
        onSave={handleSave5W2H}
      />
    </div>
  )
}

