import { useEffect, useState, useMemo } from 'react'
import { Sparkles, Check, X } from 'lucide-react'
import { complianceService } from '@/services/compliance'
import { ddService } from '@/services/due-diligence'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'

export interface RiskPoint {
  id: string
  title?: string
  i: number
  p: number
}

export function RiskMatrix({
  points,
  aiSuggestion,
}: {
  points?: RiskPoint[]
  aiSuggestion?: string
}) {
  const { user } = useAuth()
  const { tenantId } = useParams<{ tenantId: string }>()
  const [dbRisks, setDbRisks] = useState<RiskPoint[]>([])
  const [suggestion, setSuggestion] = useState<any>(null)

  useEffect(() => {
    if (!points) {
      loadData()
    }
  }, [points, tenantId])

  const loadData = async () => {
    const risksData = await complianceService.getRisks()
    setDbRisks(risksData.map((r) => ({ id: r.id, title: r.title, i: r.impact, p: r.probability })))

    // Check for Gaps
    const gaps = await complianceService.getGaps()
    const criticalGap = gaps.find(
      (g) =>
        g.severity === 'Crítica' ||
        g.severity === 'Alta' ||
        g.severity === 'Critical' ||
        g.severity === 'High',
    )

    let ddRedFlagCount = 0
    if (tenantId) {
      try {
        const ddProcesses = await ddService.getProcesses(tenantId)
        ddRedFlagCount = ddProcesses.reduce((acc, p) => acc + (p.dd_red_flags?.length || 0), 0)
      } catch (e) {
        console.error('Error fetching DD processes for risk matrix:', e)
      }
    }

    if (risksData.length > 0) {
      const targetRisk = risksData[0]
      if (criticalGap && (targetRisk.probability < 5 || targetRisk.impact < 5)) {
        setSuggestion({
          riskId: targetRisk.id,
          title: targetRisk.title,
          text: `A IA detectou o Gap "${criticalGap.rule}" (${criticalGap.severity}). Sugere-se elevar o Risco "${targetRisk.title}".`,
          newImpact: Math.min(5, targetRisk.impact + 1),
          newProb: Math.min(5, targetRisk.probability + 1),
        })
      } else if (ddRedFlagCount > 0 && targetRisk.probability < 4) {
        setSuggestion({
          riskId: targetRisk.id,
          title: targetRisk.title,
          text: `A IA detectou ${ddRedFlagCount} Red Flag(s) ativas em processos de Due Diligence. Sugere-se elevar a Probabilidade do Risco "${targetRisk.title}".`,
          newImpact: targetRisk.impact,
          newProb: Math.min(5, targetRisk.probability + 1),
        })
      }
    }
  }

  const handleAccept = async () => {
    if (!suggestion) return
    await complianceService.updateRisk(suggestion.riskId, suggestion.newImpact, suggestion.newProb)
    await complianceService.addAuditLog(
      '4.6',
      `Risco ${suggestion.title} atualizado via IA devido a cruzamento de dados (Gaps/Due Diligence).`,
      user?.email || 'Sistema',
    )
    toast({
      title: 'Risco Atualizado',
      description: 'O risco foi reavaliado com sucesso no banco de dados.',
    })
    setSuggestion(null)
    loadData()
  }

  const handleDismiss = () => {
    setSuggestion(null)
  }

  const getRiskLevel = (impact: number, prob: number) => {
    const score = impact * prob
    if (score <= 4) return 'bg-success/80 text-white'
    if (score <= 10) return 'bg-yellow-500/80 text-white'
    if (score <= 16) return 'bg-orange-500/80 text-white'
    return 'bg-destructive/80 text-white'
  }

  const defaultRisks = useMemo(
    () => [
      { id: 'R1', i: 4, p: 3 },
      { id: 'R2', i: 2, p: 2 },
      { id: 'R3', i: 5, p: 4 },
      { id: 'R4', i: 1, p: 5 },
    ],
    [],
  )

  const activePoints = dbRisks.length > 0 ? dbRisks : points || defaultRisks

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto p-4 relative">
      {suggestion ? (
        <div className="absolute top-0 right-0 z-10 w-64 bg-purple-50 border border-purple-200 p-3 rounded-lg shadow-lg animate-fade-in-up">
          <span className="font-bold flex items-center gap-1 mb-2 text-purple-900 text-xs">
            <Sparkles className="w-4 h-4" /> Sugestão da IA
          </span>
          <p className="text-xs text-purple-800 mb-3">{suggestion.text}</p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 text-[10px] bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleAccept}
            >
              <Check className="w-3 h-3 mr-1" /> Aceitar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] text-purple-700 border-purple-200"
              onClick={handleDismiss}
            >
              <X className="w-3 h-3 mr-1" /> Ignorar
            </Button>
          </div>
        </div>
      ) : aiSuggestion ? (
        <div className="absolute top-0 right-0 z-10 w-48 bg-purple-50 border border-purple-200 text-purple-900 text-[10px] p-2 rounded shadow-md animate-fade-in-up">
          <span className="font-bold flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3" /> AI Suggestion
          </span>
          {aiSuggestion}
        </div>
      ) : null}

      <div className="flex w-full mb-2 mt-8">
        <div className="w-12"></div>
        <div className="flex-1 text-center font-semibold text-sm text-muted-foreground">
          Impacto (Consequência)
        </div>
      </div>
      <div className="flex w-full">
        <div className="w-12 flex items-center justify-center mr-2">
          <div className="transform -rotate-90 whitespace-nowrap font-semibold text-sm text-muted-foreground">
            Probabilidade
          </div>
        </div>
        <div className="flex-1 grid grid-cols-5 grid-rows-5 gap-1 bg-muted p-1 rounded-lg">
          {[5, 4, 3, 2, 1].map((prob) =>
            [1, 2, 3, 4, 5].map((impact) => {
              const activeRisks = activePoints.filter((r) => r.i === impact && r.p === prob)
              const isSuggested =
                suggestion && suggestion.newImpact === impact && suggestion.newProb === prob
              return (
                <div
                  key={`${prob}-${impact}`}
                  className={`aspect-square rounded-md border border-white/20 relative flex items-center justify-center ${getRiskLevel(impact, prob)} hover:opacity-90 transition-opacity shadow-sm`}
                >
                  <span className="absolute top-1 left-1 text-[10px] opacity-50">
                    {impact * prob}
                  </span>
                  {activeRisks.length > 0 && (
                    <div className="bg-white text-black text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center shadow-lg z-10">
                      {activeRisks.length}
                    </div>
                  )}
                  {isSuggested && (
                    <div className="absolute inset-0 border-2 border-purple-500 border-dashed rounded-md animate-pulse pointer-events-none flex items-center justify-center bg-purple-500/20">
                      <Sparkles className="w-5 h-5 text-white opacity-80" />
                    </div>
                  )}
                </div>
              )
            }),
          )}
        </div>
      </div>
    </div>
  )
}
