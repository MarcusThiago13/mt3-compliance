import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Globe,
  Link as LinkIcon,
  Save,
  Loader2,
  AlertCircle,
  Calendar,
  ShieldAlert,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function TransparenciaTab({ partnership }: any) {
  const [saving, setSaving] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString())

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setLastUpdate(new Date().toISOString())
      toast({
        title: 'Sucesso',
        description: 'Configurações de transparência atualizadas e publicadas.',
      })
    }, 1000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        <div>
          <h3 className="font-semibold text-blue-900 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-600" />
            Transparência e Publicidade (Bloco 6)
          </h3>
          <p className="text-sm text-blue-800 mt-1 max-w-2xl">
            Assegure o cumprimento da transparência ativa. O painel segrega dados públicos de dados
            sensíveis (LGPD) e parametriza a exibição no portal institucional.
          </p>
        </div>
        <Button
          variant="outline"
          className="bg-white shrink-0 shadow-sm border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <LinkIcon className="h-4 w-4 mr-2" /> Copiar Link Público
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Parametrização de Dados Públicos</CardTitle>
            <CardDescription>
              Selecione quais informações serão publicadas. Dados sensíveis (como CPFs e informações
              de assistidos) são bloqueados nativamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50/30 border-blue-100">
                <div>
                  <p className="font-semibold text-blue-900 text-sm">
                    Objeto, Ente Público e Resumo Financeiro
                  </p>
                  <p className="text-xs text-blue-700/80 mt-1">
                    Exibição obrigatória por lei. Inclui valores totais, montantes repassados e
                    vigência.
                  </p>
                </div>
                <Switch checked disabled className="data-[state=checked]:bg-blue-600" />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800 text-sm">
                    Plano de Trabalho Aprovado e Metas
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Disponibiliza indicadores e resultados esperados pactuados no Bloco 3.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800 text-sm">
                    Relação Nominal da Equipe Dirigente
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Nomes e cargos (anonimizando documentos pessoais, contatos e endereços
                    residenciais).
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800 text-sm">
                    Situação da Execução e Prestações de Contas
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Informa o percentual de conclusão e o status final do julgamento perante o ente
                    público.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800 text-sm">Relação de Atuação em Rede</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Exibe a lista de organizações executantes secundárias, quando houver (Bloco 7).
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Publicar Atualizações no Portal
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Status do Portal Público</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                <p className="text-sm font-bold text-emerald-800">Transparência Ativa: Regular</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Sua OSC está cumprindo as exigências do MROSC para publicação de dados desta
                  parceria.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Calendar className="h-4 w-4 text-slate-400" />
                Última publicação: {new Date(lastUpdate).toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-amber-200 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 text-amber-900">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
                <div className="text-sm space-y-2">
                  <p className="font-bold">Atenção aos Prazos de Manutenção</p>
                  <p className="text-amber-800/90 leading-relaxed">
                    A Lei 13.019 exige que as informações da parceria sejam mantidas no site da
                    instituição por até <strong>180 dias após o respectivo encerramento</strong>{' '}
                    (Bloco 9).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-purple-200 bg-purple-50/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 text-purple-900">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-purple-600" />
                <div className="text-sm space-y-2">
                  <p className="font-bold">Privacidade & LGPD</p>
                  <p className="text-purple-800/90 leading-relaxed">
                    A publicação de nomes e remuneração da equipe vinculada ao projeto deve observar
                    a base legal e o consentimento explícito, protegendo dados bancários e de
                    residência.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
