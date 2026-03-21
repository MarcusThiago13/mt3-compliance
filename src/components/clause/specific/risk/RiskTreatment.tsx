import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { riskMotorService } from '@/services/risk-motor'
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
import { ActionMotor5W2HModal } from '@/components/shared/ActionMotor5W2HModal'
import { Sparkles, Loader2, Search } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export function RiskTreatment() {
  const { tenantId } = useParams()
  const [treatments, setTreatments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (tenantId) {
      riskMotorService.getTreatments(tenantId).then((data) => {
        setTreatments(data)
        setLoading(false)
      })
    }
  }, [tenantId])

  const handleSavePlan = (plan: any) => {
    toast({
      title: 'Plano 5W2H Registrado',
      description: 'O plano foi integrado à rotina de tratamento do risco.',
    })
  }

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    )

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-purple-50 p-4 rounded-lg border border-purple-100 gap-4">
        <div>
          <h4 className="font-semibold text-purple-900">Respostas e Planos de Tratamento</h4>
          <p className="text-xs text-purple-800/80 mt-1">
            Desdobre ações de mitigação usando a metodologia 5W2H e Inteligência Artificial.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto shadow-sm"
        >
          <Sparkles className="h-4 w-4 mr-2" /> Gerar Plano 5W2H (IA)
        </Button>
      </div>

      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Risco Vinculado</TableHead>
              <TableHead className="w-[120px]">Estratégia</TableHead>
              <TableHead>Ação / Plano</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((t, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    {t.risk_code}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                    {t.response_type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">{t.description}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.owner}</TableCell>
                <TableCell className="text-sm">{t.deadline}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      t.status === 'Concluído'
                        ? 'bg-success hover:bg-success/90'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }
                  >
                    {t.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {treatments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum tratamento cadastrado. Defina respostas para os riscos identificados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ActionMotor5W2HModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Assistente de Tratamento de Riscos"
        promptContext="Cenário: Necessidade de criar um plano de mitigação robusto para o risco de 'Vazamento de Dados Pessoais (LGPD)'. O risco residual está muito alto devido à falta de controles de acesso automatizados."
        onSave={handleSavePlan}
      />
    </div>
  )
}
