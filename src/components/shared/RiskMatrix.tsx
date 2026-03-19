import { useMemo } from 'react'
import { Sparkles } from 'lucide-react'

export interface RiskPoint {
  id: string
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

  const risks = points || defaultRisks

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto p-4 relative">
      {aiSuggestion && (
        <div className="absolute top-0 right-0 z-10 w-48 bg-purple-50 border border-purple-200 text-purple-900 text-[10px] p-2 rounded shadow-md animate-fade-in-up">
          <span className="font-bold flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3" /> AI Suggestion
          </span>
          {aiSuggestion}
        </div>
      )}

      <div className="flex w-full mb-2">
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
              const activeRisks = risks.filter((r) => r.i === impact && r.p === prob)
              return (
                <div
                  key={`${prob}-${impact}`}
                  className={`aspect-square rounded-md border border-white/20 relative flex items-center justify-center ${getRiskLevel(impact, prob)} hover:opacity-100 transition-opacity shadow-sm`}
                >
                  <span className="absolute top-1 left-1 text-[10px] opacity-50">
                    {impact * prob}
                  </span>
                  {activeRisks.length > 0 && (
                    <div className="bg-white text-black text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center shadow-lg">
                      {activeRisks.length}
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
