import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Globe, Link as LinkIcon, Save, Loader2, AlertCircle, Calendar } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function TransparenciaTab({ partnership }: any) {
  const [saving, setSaving] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString())

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setLastUpdate(new Date().toISOString())
      toast({ title: 'Sucesso', description: 'Configurações de transparência atualizadas e publicadas.' })
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
            Consolidação das obrigações de transparência ativa. Os dados selecionados aqui alimentam automaticamente a página pública da OSC e garantem a conformidade com o regulamento do ente parceiro.
          </p>
        </div>
        <Button variant="outline" className="bg-white shrink-0 shadow-sm border-blue-200 text-blue-700 hover:bg-blue-50">
          <LinkIcon className="h-4 w-4 mr-2" /> Copiar Link do Portal
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Painel de Dados Públicos</CardTitle>
            <CardDescription>
              Selecione quais blocos de informação serão exibidos. O sistema segrega automaticamente os dados restritos (como CPFs de terceiros) dos dados de interesse público.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800">Objeto e Resumo Financeiro</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Exibe o objeto pactuado, ente parceiro, valor total e montantes já recebidos. <span className="text-amber-600 font-medium">(Obrigatório)</span>
                  </p>
                </div>
                <Switch checked disabled />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800">Plano de Trabalho Aprovado</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Disponibiliza as metas, indicadores e resultados esperados na íntegra.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800">Relação Nominal da Equipe Dirigente e Técnica</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Exibe os profissionais vinculados à execução e remunerações, garantindo anonimização de dados sensíveis.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800">Situação da Execução e Prestação de Contas</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Informa prazos, percentual de conclusão e status final do julgamento de contas.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-800">Bens Remanescentes e Destinação</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Exibe o patrimônio adquirido e a destinação final após o encerramento.
                  </p>
                </div>
                <Switch />
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
                Publicar Atualizações
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Status do Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                 <p className="text-sm font-semibold text-emerald-800">Portal Público Ativo</p>
                 <p className="text-xs text-emerald-700 mt-1">Sua OSC está cumprindo o requisito de transparência ativa.</p>
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600">
                 <Calendar className="h-4 w-4" />
                 Última atualização: {new Date(lastUpdate).toLocaleString('pt-BR')}
               </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-amber-100 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2 text-amber-800">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Atenção aos Prazos de Transparência</p>
                  <p>A Lei 13.019 exige que as informações sejam mantidas no site por até 180 dias após o encerramento da parceria.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
