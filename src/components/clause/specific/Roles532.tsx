import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Key, CheckCircle2 } from 'lucide-react'
import { Label } from '@/components/ui/label'

export function Roles532() {
  return (
    <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Perfil da Função
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <Label className="text-sm text-muted-foreground">Modelo de Estrutura</Label>
            <Badge variant="outline" className="font-semibold bg-accent/5">
              Comitê Interno + CCO
            </Badge>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <Label className="text-sm text-muted-foreground">Líder Nomeado</Label>
            <span className="text-sm font-semibold">Mariana Costa (Chief Compliance Officer)</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <Label className="text-sm text-muted-foreground">Dedicação / Capacidade</Label>
            <span className="text-sm font-semibold">Tempo Integral (Exclusivo)</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" /> Níveis de Autoridade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-success/10 text-success-foreground rounded-md text-sm font-medium border border-success/20 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> Acesso irrestrito a todos os documentos e
            pessoas
          </div>
          <div className="p-3 bg-success/10 text-success-foreground rounded-md text-sm font-medium border border-success/20 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> Autoridade para interromper operações
            inseguras
          </div>
          <div className="p-3 bg-success/10 text-success-foreground rounded-md text-sm font-medium border border-success/20 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> Reporte direto e não-filtrado ao Conselho
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
