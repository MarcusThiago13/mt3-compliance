import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileSignature, Lightbulb } from 'lucide-react'

export function Roles534() {
  return (
    <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" /> Aceite Global de Responsabilidades
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Todos os colaboradores devem compreender suas obrigações de compliance, a conformidade
            com a política e a ciência do canal de denúncias.
          </p>

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Termos de Responsabilidade Assinados</span>
              <span className="font-bold text-primary">92%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: '92%' }}
              ></div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-2">
            Disparar Lembretes de Assinatura
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" /> Engajamento e Contribuições
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Mecanismo documentado para que os colaboradores contribuam ativamente para a melhoria
            contínua do SGC.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 rounded-md border border-amber-200 text-center">
              <p className="text-3xl font-bold text-amber-600">12</p>
              <p className="text-xs text-amber-800 font-medium mt-1">Sugestões (Mês)</p>
            </div>
            <div className="p-4 bg-success/10 rounded-md border border-success/20 text-center">
              <p className="text-3xl font-bold text-success">3</p>
              <p className="text-xs text-success-foreground font-medium mt-1">Implementadas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
