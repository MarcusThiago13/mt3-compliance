import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export function Roles531() {
  const duties = [
    'Assegurar que a política e objetivos de compliance sejam estabelecidos.',
    'Garantir a integração dos requisitos do SGC nos processos de negócios.',
    'Alocar recursos adequados e proporcionais para o SGC.',
    'Garantir a independência e autoridade da Função de Compliance.',
    'Monitorar a eficácia e o desempenho do SGC (Análise Crítica periódica).',
    'Assegurar que o SGC alcance os resultados pretendidos.',
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-md">
            Atribuições Estatutárias Mapeadas (Alta Direção e Conselho)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {duties.map((duty, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-md border border-border/50"
              >
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground/90">{duty}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
