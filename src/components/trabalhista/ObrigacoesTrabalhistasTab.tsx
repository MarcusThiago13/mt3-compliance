import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileCheck, ShieldAlert, Clock, Info } from 'lucide-react'

export function ObrigacoesTrabalhistasTab({ tenant }: any) {
  const profile = tenant.labor_profile || {}

  const obligations = [
    {
      title: 'Envio da Folha de Pagamento (S-1200)',
      category: 'eSocial',
      apply: profile.has_esocial,
      freq: 'Mensal',
      risk: 'Alto',
    },
    {
      title: 'Renovação do PCMSO e ASO Admissional/Periódico',
      category: 'SST',
      apply: profile.has_sst,
      freq: 'Anual / Contínuo',
      risk: 'Alto',
    },
    {
      title: 'Treinamento de Prevenção ao Assédio (CIPA)',
      category: 'Governança',
      apply: profile.has_canal_assedio,
      freq: 'Anual',
      risk: 'Médio',
    },
    {
      title: 'Fechamento e Tratamento de Exceções de Ponto',
      category: 'Jornada',
      apply: profile.has_ponto,
      freq: 'Mensal',
      risk: 'Baixo',
    },
    {
      title: 'Fiscalização de CNDT e Folha de Terceiros',
      category: 'Terceirização',
      apply: profile.has_terceirizados,
      freq: 'Mensal',
      risk: 'Alto',
    },
    {
      title: 'Assinatura de Termo de Estágio e Relatório de Atividades',
      category: 'Vínculos',
      apply: profile.has_estagiarios,
      freq: 'Semestral',
      risk: 'Baixo',
    },
  ].filter((o) => o.apply !== false)

  return (
    <Card className="animate-in fade-in shadow-sm border-slate-200">
      <CardHeader className="border-b bg-slate-50/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileCheck className="w-5 h-5 text-primary" /> Catálogo Dinâmico de Obrigações Laborais
        </CardTitle>
        <CardDescription>
          Obrigações aplicáveis geradas automaticamente com base no perfil laboral configurado.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {obligations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50">
              <Info className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">Nenhuma obrigação parametrizada.</p>
              <p className="text-xs">Ative as opções no "Perfil Laboral" para gerar o catálogo.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {obligations.map((o, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full shrink-0">
                      {o.category === 'eSocial' ? (
                        <Clock className="w-5 h-5 text-primary" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{o.title}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-slate-100 text-slate-700"
                        >
                          {o.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Ciclo: {o.freq}</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 self-start sm:self-auto">
                    <Badge
                      className={
                        o.risk === 'Alto'
                          ? 'bg-red-100 text-red-800 hover:bg-red-200 border-none'
                          : 'bg-slate-100 text-slate-800 border-none'
                      }
                    >
                      Risco {o.risk}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
