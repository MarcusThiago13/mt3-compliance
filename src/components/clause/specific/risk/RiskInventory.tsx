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
import { Plus, Sparkles, Loader2, Search } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export function RiskInventory() {
  const { tenantId } = useParams()
  const [risks, setRisks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)

  const load = async () => {
    if (tenantId) {
      const data = await riskMotorService.getRisks(tenantId)
      setRisks(data)
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [tenantId])

  const runAiMapping = async () => {
    setAiLoading(true)
    setTimeout(() => {
      toast({
        title: 'Gatilhos Analisados pela IA',
        description:
          'A IA identificou novos gatilhos (Red Flags de Due Diligence) e mapeou 1 novo risco sugerido.',
      })
      setAiLoading(false)
      setRisks((prev) => [
        {
          id: 'new-ai',
          code: 'AI-04',
          title: 'Contratação de Terceiros PEP sem Diligência Prévia',
          category: 'Interações Públicas',
          status: 'Identificado',
          owner: 'Compliance',
          assessments: [{ inherent_score: 20, residual_score: 20 }],
          isAi: true,
        },
        ...prev,
      ])
    }, 2500)
  }

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    )

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 p-4 rounded-lg border gap-4">
        <div>
          <h4 className="font-semibold text-foreground">Inventário Transversal de Riscos</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Registro centralizado e versionado de todos os riscos mapeados no ecossistema.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={runAiMapping}
            disabled={aiLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
          >
            {aiLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Mapear via Gatilhos (IA)
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Novo Risco
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cód / Origem</TableHead>
              <TableHead>Título / Categoria</TableHead>
              <TableHead>Status (Workflow)</TableHead>
              <TableHead className="text-center">Score Inerente</TableHead>
              <TableHead className="text-center">Score Residual</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.map((r) => (
              <TableRow key={r.id} className={r.isAi ? 'bg-purple-50/40' : ''}>
                <TableCell>
                  <span className="font-mono text-xs font-bold bg-muted px-1.5 py-0.5 rounded">
                    {r.code}
                  </span>
                  {r.isAi && (
                    <Sparkles
                      className="h-3 w-3 text-purple-600 inline ml-1"
                      title="Sugerido via IA"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-sm">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {r.category} | Resp:{' '}
                    <span className="font-medium text-foreground">{r.owner}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-50 text-slate-700">
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="shadow-none">
                    {r.assessments?.[0]?.inherent_score || '-'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      r.assessments?.[0]?.residual_score >= 15
                        ? 'border-red-300 text-red-700 bg-red-50'
                        : r.assessments?.[0]?.residual_score <= 6
                          ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                          : 'border-yellow-300 text-yellow-700 bg-yellow-50'
                    }
                  >
                    {r.assessments?.[0]?.residual_score || '-'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {risks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum risco cadastrado no inventário.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
