import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FileSignature, Shield, MessageSquareWarning, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function PoliticasLgpdTab({ tenant }: any) {
  return (
    <div className="space-y-6 animate-in fade-in">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileSignature className="w-5 h-5 text-primary" /> Políticas Internas e Adesão
          </CardTitle>
          <CardDescription>
            Controle de versionamento, publicação e coleta de ciência das políticas trabalhistas e
            de convivência.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-800 text-sm">
                  Política de Jornada e Ponto
                </h4>
                <Badge className="bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-200">
                  Vigente (v2.1)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Estabelece regras para compensação e exceções.
              </p>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Adesão: 98%</span>
                <Button variant="link" size="sm" className="h-auto p-0">
                  Ver Pendentes
                </Button>
              </div>
            </div>
            <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-800 text-sm">
                  Prevenção ao Assédio (CIPA)
                </h4>
                <Badge className="bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-200">
                  Vigente (v1.0)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Diretrizes de convivência e fluxo de denúncias.
              </p>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-slate-700">Adesão: 100%</span>
                <span className="text-emerald-600 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Completo
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-slate-50/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquareWarning className="w-5 h-5 text-primary" /> Canal Interno e Assédio
            </CardTitle>
            <CardDescription>
              Acompanhamento de relatos trabalhistas e denúncias de convivência.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-slate-50 text-center">
              <MessageSquareWarning className="w-10 h-10 mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Nenhum relato pendente</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                As denúncias categorizadas como trabalhistas ou de assédio no Canal Seguro do mt3
                aparecerão aqui para tratamento do RH e Compliance.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-slate-50/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" /> LGPD no Contexto Laboral
            </CardTitle>
            <CardDescription>
              Inventário de dados funcionais e controles de privacidade do trabalhador.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-md text-sm">
                <span className="font-medium text-slate-700">
                  Ficha Médica / ASO (Dado Sensível)
                </span>
                <Badge variant="outline">Acesso Restrito: RH/SST</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-md text-sm">
                <span className="font-medium text-slate-700">Biometria (Ponto Eletrônico)</span>
                <Badge variant="outline">Consentimento Contratual</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-md text-sm">
                <span className="font-medium text-slate-700">Dados de Dependentes</span>
                <Badge variant="outline">Obrigação Legal (eSocial)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
