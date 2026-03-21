import { cn } from '@/lib/utils'

export function RiskHeatmap({
  risks,
  type = 'residual',
}: {
  risks: any[]
  type?: 'inherent' | 'residual'
}) {
  const getRiskLevel = (i: number, p: number) => {
    const score = i * p
    if (score <= 4) return 'bg-emerald-500/80 hover:bg-emerald-500'
    if (score <= 10) return 'bg-yellow-500/80 hover:bg-yellow-500'
    if (score <= 16) return 'bg-orange-500/80 hover:bg-orange-500'
    return 'bg-red-500/80 hover:bg-red-500'
  }

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto">
      <div className="flex w-full mb-1">
        <div className="w-8"></div>
        <div className="flex-1 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Impacto
        </div>
      </div>
      <div className="flex w-full">
        <div className="w-8 flex items-center justify-center mr-1">
          <div className="transform -rotate-90 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Probabilidade
          </div>
        </div>
        <div className="flex-1 grid grid-cols-5 grid-rows-5 gap-1 bg-muted/20 p-1.5 rounded-lg border shadow-inner">
          {[5, 4, 3, 2, 1].map((prob) =>
            [1, 2, 3, 4, 5].map((impact) => {
              const count = risks.filter((r) => {
                const ass = r.assessments?.[0]
                if (!ass) return false
                return type === 'residual'
                  ? ass.residual_prob === prob && ass.residual_impact === impact
                  : ass.inherent_prob === prob && ass.inherent_impact === impact
              }).length

              return (
                <div
                  key={`${prob}-${impact}`}
                  className={cn(
                    'aspect-square rounded border border-white/20 flex items-center justify-center relative transition-colors shadow-sm',
                    getRiskLevel(impact, prob),
                  )}
                >
                  <span className="absolute top-0.5 left-1 text-[9px] opacity-40 text-white font-bold">
                    {impact * prob}
                  </span>
                  {count > 0 && (
                    <div className="bg-white text-black text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center shadow-lg animate-fade-in-up">
                      {count}
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
