import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const activities = [
  {
    id: 1,
    action: 'Nova evidência anexada',
    item: '4.1 Contexto',
    user: 'Ana Silva',
    time: 'Há 2h',
  },
  {
    id: 2,
    action: 'Status alterado para Conforme',
    item: '5.2 Política',
    user: 'Carlos Gomes',
    time: 'Há 5h',
  },
  { id: 3, action: 'Novo Risco Identificado', item: '4.6 Riscos', user: 'Sistema', time: 'Ontem' },
  { id: 4, action: 'Denúncia recebida', item: '8.3 Canal', user: 'Anônimo', time: 'Ontem' },
]

export function KpiDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Maturidade do Compliance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <div className="relative w-48 h-48 rounded-full border-[16px] border-muted flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border-[16px] border-primary"
              style={{
                clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
                transform: 'rotate(45deg)',
              }}
            ></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">3.2</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
                Gerenciado
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex flex-col gap-1 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{act.action}</span>
                  <span className="text-xs text-muted-foreground">{act.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{act.user}</span>
                  <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                    {act.item}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
