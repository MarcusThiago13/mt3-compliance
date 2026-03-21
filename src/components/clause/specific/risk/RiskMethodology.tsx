import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GitCommit, Edit3 } from 'lucide-react'

export function RiskMethodology() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-sm border-t-4 border-t-primary">
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <div>
            <CardTitle className="text-lg">Metodologia de Avaliação Vigente</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <GitCommit className="h-4 w-4" /> Versão 2.1 (Ativada em 15/01/2024)
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Edit3 className="h-4 w-4 mr-2" /> Editar Versão
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="bg-primary hover:bg-primary">
              Modelo: Avançado (P x I x V)
            </Badge>
            <Badge variant="outline" className="bg-muted">
              Escala Padrão: 5 níveis
            </Badge>
            <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50">
              Aprovada por: Comitê de Risco
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">
              Gatilhos Ativos
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 bg-muted/10 shadow-sm">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  P
                </span>
                Escala de Probabilidade
              </h4>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex justify-between border-b pb-1">
                  <span>1 - Muito Rara</span> <span>&lt; 5% ao ano</span>
                </li>
                <li className="flex justify-between border-b pb-1">
                  <span>2 - Improvável</span> <span>5% a 20%</span>
                </li>
                <li className="flex justify-between border-b pb-1">
                  <span>3 - Possível</span> <span>20% a 50%</span>
                </li>
                <li className="flex justify-between border-b pb-1">
                  <span>4 - Provável</span> <span>50% a 80%</span>
                </li>
                <li className="flex justify-between font-medium text-foreground">
                  <span>5 - Quase Certa</span> <span>&gt; 80%</span>
                </li>
              </ul>
            </div>
            <div className="border rounded-md p-4 bg-muted/10 shadow-sm">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  I
                </span>
                Escala de Impacto
              </h4>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex justify-between border-b pb-1">
                  <span>1 - Insignificante</span> <span>&lt; R$ 10k / Sem mídia</span>
                </li>
                <li className="flex justify-between border-b pb-1">
                  <span>2 - Menor</span> <span>R$ 10k a 50k / Local</span>
                </li>
                <li className="flex justify-between border-b pb-1">
                  <span>3 - Moderado</span> <span>R$ 50k a 200k / Regional</span>
                </li>
                <li className="flex justify-between border-b pb-1">
                  <span>4 - Maior</span> <span>R$ 200k a 1M / Nacional</span>
                </li>
                <li className="flex justify-between font-medium text-destructive">
                  <span>5 - Catastrófico</span> <span>&gt; R$ 1M / Risco Prisão</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-sm text-blue-900 shadow-sm">
            <strong className="block mb-1">
              Fórmula de Cálculo Residual (Algoritmo do Motor):
            </strong>
            O sistema mantém o nível de Impacto intacto, mas aplica um fator de redução na
            Probabilidade com base na efetividade comprovada dos controles vinculados (Efetivo = -2
            níveis, Parcialmente Efetivo = -1 nível).
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
