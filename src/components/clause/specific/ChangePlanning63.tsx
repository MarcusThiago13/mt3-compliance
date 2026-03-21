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
import { Plus, Download, GitPullRequest, Sparkles } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { ActionMotor5W2HModal } from '@/components/shared/ActionMotor5W2HModal'

const changes = [
  {
    id: 'CHG-001',
    description: 'Reestruturação do Comitê de Ética e Conduta',
    purpose: 'Garantir maior independência nas investigações',
    impact: 'Alteração no regimento interno e matriz de responsabilidades',
    status: 'Aprovada',
    date: '01/12/2023',
  },
  {
    id: 'CHG-002',
    description: 'Migração para novo ERP Financeiro',
    purpose: 'Melhor rastreabilidade e controles financeiros',
    impact: 'Integração de novos fluxos de due diligence de terceiros',
    status: 'Em Análise',
    date: '15/02/2024',
  },
]

export function ChangePlanning63() {
  const [is5W2HOpen, setIs5W2HOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const handleExport = () => {
    toast({
      title: 'Registro de Mudanças Exportado',
      description: 'O log de planejamento de mudanças foi gerado.',
    })
  }

  const open5W2H = (chg: any) => {
    setSelectedItem(chg)
    setIs5W2HOpen(true)
  }

  const handleSave5W2H = (plan: any) => {
    toast({
      title: 'Plano de Mudança Criado',
      description: 'O cronograma de mudança foi estruturado.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">6.3 Planejamento de Mudanças</h3>
          <p className="text-sm text-muted-foreground">
            Gestão controlada e documentada de mudanças no Sistema de Gestão de Compliance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Registro de Mudanças
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Mudança
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Ref.</TableHead>
                  <TableHead>Mudança Proposta</TableHead>
                  <TableHead>Propósito / Consequências</TableHead>
                  <TableHead>Impacto no SGC</TableHead>
                  <TableHead>Data Prevista</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changes.map((chg) => (
                  <TableRow key={chg.id}>
                    <TableCell>
                      <div className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                        <GitPullRequest className="h-3 w-3" />
                        {chg.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{chg.description}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => open5W2H(chg)}
                        className="h-5 text-[10px] px-2 text-purple-700 border-purple-200 hover:bg-purple-50 mt-1"
                      >
                        <Sparkles className="mr-1 h-2.5 w-2.5" /> 5W2H
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{chg.purpose}</TableCell>
                    <TableCell className="text-sm">{chg.impact}</TableCell>
                    <TableCell className="text-sm">{chg.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          chg.status === 'Aprovada'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                        }
                      >
                        {chg.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ActionMotor5W2HModal
        isOpen={is5W2HOpen}
        onOpenChange={setIs5W2HOpen}
        title={`Estruturar Mudança: ${selectedItem?.id}`}
        promptContext={`Mudança Proposta: ${selectedItem?.description}\nPropósito: ${selectedItem?.purpose}\nImpacto Previsto: ${selectedItem?.impact}\nCrie o plano de execução e controle para esta mudança organizacional.`}
        onSave={handleSave5W2H}
      />
    </div>
  )
}
