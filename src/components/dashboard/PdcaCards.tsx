import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const pdcaData = [
  { phase: 'Plan', title: 'Planejamento', value: 85, color: 'bg-primary' },
  { phase: 'Do', title: 'Operação', value: 62, color: 'bg-accent' },
  { phase: 'Check', title: 'Verificação', value: 45, color: 'bg-destructive' },
  { phase: 'Act', title: 'Ação/Melhoria', value: 90, color: 'bg-success' },
]

export function PdcaCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {pdcaData.map((item) => (
        <Card key={item.phase} className="shadow-subtle hover:shadow-elevation transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {item.phase}
            </CardTitle>
            <div
              className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-bold`}
            >
              {item.value}%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{item.title}</div>
            <Progress value={item.value} className="h-2" indicatorClassName={item.color} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
