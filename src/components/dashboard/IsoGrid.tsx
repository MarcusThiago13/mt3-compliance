import { Target, ShieldCheck, Cog, Users, Rocket, BarChart, RefreshCcw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const isoSections = [
  { id: '4', title: 'Contexto', icon: Target, total: 6, conforming: 5 },
  { id: '5', title: 'Liderança', icon: ShieldCheck, total: 3, conforming: 3 },
  { id: '6', title: 'Planejamento', icon: Cog, total: 3, conforming: 2 },
  { id: '7', title: 'Apoio', icon: Users, total: 5, conforming: 4 },
  { id: '8', title: 'Operação', icon: Rocket, total: 4, conforming: 2 },
  { id: '9', title: 'Avaliação', icon: BarChart, total: 3, conforming: 1 },
  { id: '10', title: 'Melhoria', icon: RefreshCcw, total: 2, conforming: 2 },
]

export function IsoGrid() {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
      {isoSections.map((section) => {
        const Icon = section.icon
        const isPerfect = section.conforming === section.total
        const isCritical = section.conforming < section.total / 2

        return (
          <Card
            key={section.id}
            className="text-center hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <CardContent className="p-4 pt-6 flex flex-col items-center justify-center gap-3">
              <div
                className={`p-3 rounded-full ${isPerfect ? 'bg-success/10 text-success' : isCritical ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'} group-hover:scale-110 transition-transform`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">
                  {section.id}. {section.title}
                </h3>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs">
                  <Badge
                    variant={isPerfect ? 'default' : 'outline'}
                    className={isPerfect ? 'bg-success hover:bg-success' : ''}
                  >
                    {section.conforming}/{section.total}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
