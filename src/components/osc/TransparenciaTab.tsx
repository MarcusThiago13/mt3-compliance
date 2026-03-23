import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Globe, Link as LinkIcon, Save, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function TransparenciaTab({ partnership }: any) {
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast({ title: 'Sucesso', description: 'Configurações de transparência atualizadas.' })
    }, 1000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        <div>
          <h3 className="font-semibold text-blue-900 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-600" />
            Transparência e Publicidade (Bloco 5)
          </h3>
          <p className="text-sm text-blue-800 mt-1 max-w-2xl">
            Controle de publicidade ativa, parametrizável conforme o ato regulamentar e a plataforma
            eletrônica indicada pelo ente parceiro.
          </p>
        </div>
        <Button variant="outline" className="bg-white shrink-0">
          <LinkIcon className="h-4 w-4 mr-2" /> Copiar Link Público
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Dados Públicos da Parceria</CardTitle>
          <CardDescription>
            Selecione quais informações devem ser disponibilizadas de forma ativa, garantindo a
            conformidade sem expor dados restritos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-slate-800">Objeto e Resumo Financeiro</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Exibe o objeto pactuado, valor total e montantes já recebidos.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-slate-800">Plano de Trabalho Aprovado</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Disponibiliza as metas e resultados esperados na íntegra.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-slate-800">Relação Nominal da Equipe</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Exibe os profissionais vinculados à execução, quando juridicamente exigível.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-slate-800">Situação da Prestação de Contas</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Informa prazos, entregas e status final (regular, ressalva, rejeitada).
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
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
