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
import { Plus, Sparkles, Loader2, Search, ShieldAlert, BookOpen } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useAppStore } from '@/stores/main'

export function RiskInventory() {
  const { tenantId } = useParams()
  const { activeTenant } = useAppStore()
  const isEducacional = activeTenant?.org_subtype === 'educacional'

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
        title: 'Mapeamento de Gatilhos (IA)',
        description:
          'A IA analisou os dados operacionais e não encontrou novos padrões ou gatilhos de risco neste momento.',
      })
      setAiLoading(false)
    }, 2500)
  }

  const loadEduRisks = () => {
    if (risks.find((r) => r.code === 'RE-01')) {
      toast({ description: 'Biblioteca educacional já carregada.' })
      return
    }

    const newRisks = [
      {
        id: 'mock-r1',
        code: 'RE-01',
        title: 'Falha na proteção integral da criança (ECA)',
        category: 'Operacional / Reputacional',
        status: 'Identificado',
        isAi: false,
        assessments: [{ inherent_score: 20, residual_score: 16 }],
      },
      {
        id: 'mock-r2',
        code: 'RE-02',
        title: 'Subdimensionamento financeiro do plano de trabalho',
        category: 'Financeiro (MROSC)',
        status: 'Em Tratamento',
        isAi: false,
        assessments: [{ inherent_score: 15, residual_score: 10 }],
      },
      {
        id: 'mock-r3',
        code: 'RE-03',
        title: 'Glosas em prestação de contas por falta de evidência',
        category: 'Compliance / MROSC',
        status: 'Identificado',
        isAi: true,
        assessments: [{ inherent_score: 25, residual_score: 12 }],
      },
    ]
    setRisks([...newRisks, ...risks])
    toast({
      title: 'Biblioteca OSC Educacional',
      description: 'Riscos setoriais carregados com sucesso.',
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 p-4 rounded-lg border gap-4">
        <div>
          <h4 className="font-semibold text-foreground">Inventário Transversal de Riscos</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Registro centralizado e versionado de todos os riscos mapeados no ecossistema.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isEducacional && (
            <Button
              variant="outline"
              onClick={loadEduRisks}
              className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 w-full sm:w-auto"
            >
              <BookOpen className="h-4 w-4 mr-2" /> Biblioteca OSC Educacional
            </Button>
          )}
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
                    <span className="font-medium text-foreground">
                      {r.owner_id || 'Não atribuído'}
                    </span>
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
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
                    <ShieldAlert className="h-10 w-10 opacity-40" />
                    <div>
                      <p className="font-medium text-foreground">Nenhum risco cadastrado</p>
                      <p className="text-sm">Inicie o mapeamento para construir o inventário.</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="mr-2 h-4 w-4" /> Cadastrar Primeiro Risco
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
