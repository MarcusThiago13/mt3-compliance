import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, ChevronRight, UserCircle } from 'lucide-react'

export function InvestigationWorkflow() {
  const cases = [
    {
      id: 'INV-2023-042',
      title: 'Suspeita de favorecimento em licitação',
      status: 'Em Análise',
      priority: 'Alta',
      days: 12,
    },
    {
      id: 'INV-2023-045',
      title: 'Relato de assédio moral no setor de Vendas',
      status: 'Nova',
      priority: 'Crítica',
      days: 2,
    },
    {
      id: 'INV-2023-038',
      title: 'Conflito de interesses não declarado',
      status: 'Concluída',
      priority: 'Média',
      days: 45,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Workflow de Investigações</h3>
          <p className="text-sm text-muted-foreground">
            Gestão interna de relatos recebidos (Acesso Restrito).
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {cases.map((c) => (
          <Card key={c.id} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${c.priority === 'Crítica' ? 'bg-destructive' : c.priority === 'Alta' ? 'bg-orange-500' : 'bg-yellow-500'}`}
                ></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                    <Badge
                      variant="outline"
                      className={
                        c.status === 'Nova'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : c.status === 'Em Análise'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                      }
                    >
                      {c.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm mt-1">{c.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Prioridade {c.priority}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {c.days} dias em aberto
                    </span>
                    <span className="flex items-center gap-1">
                      <UserCircle className="h-3 w-3" /> Comitê de Ética
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
