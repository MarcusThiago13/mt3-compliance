import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShieldCheck, Handshake, Globe, Info } from 'lucide-react'

export function GovernancaDigitalTab({ tenant }: any) {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="w-5 h-5 text-primary" /> Avaliação de Impacto (RIPD)
            </CardTitle>
            <CardDescription>
              Análise de riscos para tratamentos de alta criticidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-50 border rounded-lg text-center text-sm text-muted-foreground">
              Nenhum RIPD em elaboração.
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Handshake className="w-5 h-5 text-primary" /> Gestão de Operadores
            </CardTitle>
            <CardDescription>Auditoria e due diligence de fornecedores de TI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-50 border rounded-lg text-center text-sm text-muted-foreground">
              Integração direta com o módulo de Due Diligence.
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="w-5 h-5 text-primary" /> Transferências Internacionais
            </CardTitle>
            <CardDescription>Mapeamento de fluxos transfronteiriços de dados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-50 border rounded-lg text-center text-sm text-muted-foreground">
              Nenhuma transferência registrada.
            </div>
          </CardContent>
        </Card>
      </div>

      {tenant.org_type === 'poder_publico' && (
        <Card className="bg-blue-50/50 border-blue-200 shadow-sm">
          <CardContent className="p-5 flex gap-4 items-start">
            <Info className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900">
                Transparência Ativa x LGPD (Poder Público)
              </h4>
              <p className="text-sm text-blue-800 mt-1">
                O sistema aplicará filtros de anonimização automáticos nos relatórios públicos para
                conciliar a Lei de Acesso à Informação (LAI) com a LGPD.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {tenant.org_type === 'osc' && (
        <Card className="bg-purple-50/50 border-purple-200 shadow-sm">
          <CardContent className="p-5 flex gap-4 items-start">
            <Info className="w-6 h-6 text-purple-600 mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-purple-900">Integração MROSC e CEBAS</h4>
              <p className="text-sm text-purple-800 mt-1">
                Os dados sensíveis de beneficiários vinculados aos projetos sociais estão isolados
                com perfis de acesso restritos, gerando evidências de conformidade para prestação de
                contas.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
