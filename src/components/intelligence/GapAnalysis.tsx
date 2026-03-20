import { useEffect, useState } from 'react'
import { complianceService } from '@/services/compliance'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ChevronRight, Zap } from 'lucide-react'

export function GapAnalysis() {
  const [gaps, setGaps] = useState<any[]>([])
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  useEffect(() => {
    complianceService.getGaps().then(setGaps)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Análise Automática de Gaps</h3>
          <p className="text-sm text-muted-foreground">
            O motor inteligente cruza os dados do SGC e alerta sobre vulnerabilidades documentais.
          </p>
        </div>
        <Button variant="outline" className="text-primary border-primary">
          <Zap className="mr-2 h-4 w-4" /> Rodar Nova Análise
        </Button>
      </div>

      <div className="grid gap-4">
        {gaps.map((g) => (
          <Card
            key={g.id}
            className="border-l-4 shadow-sm"
            style={{
              borderLeftColor:
                g.severity === 'Crítica'
                  ? 'var(--destructive)'
                  : g.severity === 'Alta'
                    ? 'var(--orange-500)'
                    : 'var(--amber-500)',
            }}
          >
            <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`h-5 w-5 mt-0.5 shrink-0 ${
                    g.severity === 'Crítica'
                      ? 'text-destructive'
                      : g.severity === 'Alta'
                        ? 'text-orange-500'
                        : 'text-amber-500'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="font-mono text-[10px] bg-slate-50">
                      {g.rule}
                    </Badge>
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      Grau: {g.severity}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{g.description}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="shrink-0 w-full md:w-auto mt-2 md:mt-0"
                onClick={() => navigate(`/${tenantId}/clause/10.2`, { state: { prefillGap: g } })}
              >
                Criar Plano de Ação <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {gaps.length === 0 && (
          <div className="text-center p-12 border-2 border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground">
              Nenhum Gap de conformidade encontrado no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
