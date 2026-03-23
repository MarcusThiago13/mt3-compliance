import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Activity, Play, Target, DollarSign } from 'lucide-react'

export default function ExecucaoTab({ partnership }: any) {
  const [execution, setExecution] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [physical, setPhysical] = useState(0)
  const [financial, setFinancial] = useState(0)

  const fetchExecution = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('osc_partnership_execution' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .maybeSingle()

    if (data) {
      setExecution(data)
      setPhysical(data.physical_progress || 0)
      setFinancial(data.financial_progress || 0)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchExecution()
  }, [partnership.id])

  const handleStart = async () => {
    setSaving(true)
    const { data, error } = await supabase
      .from('osc_partnership_execution' as any)
      .insert({ partnership_id: partnership.id })
      .select()
      .single()

    if (data) {
      setExecution(data)
      toast({ title: 'Sucesso', description: 'Módulo de Execução iniciado.' })
    }
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    setSaving(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('osc_partnership_execution' as any)
      .update({
        physical_progress: physical,
        financial_progress: financial,
        last_update: new Date().toISOString(),
      })
      .eq('id', execution.id)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Progresso da execução atualizado.' })
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!execution) {
    return (
      <Card className="border-emerald-100 bg-emerald-50/30 text-center py-12">
        <CardContent className="space-y-4">
          <Activity className="h-12 w-12 text-emerald-300 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-emerald-900">Fase de Execução Não Iniciada</h3>
            <p className="text-sm text-emerald-700 max-w-sm mx-auto mt-2">
              Após a assinatura e celebração do termo, ative este módulo para iniciar a gestão de
              alcance de metas físicas e acompanhamento financeiro.
            </p>
          </div>
          <Button
            onClick={handleStart}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Iniciar Acompanhamento da Execução
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-emerald-100">
      <CardHeader>
        <CardTitle className="text-lg text-emerald-900 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-emerald-600" />
          Monitoramento do Plano de Trabalho
        </CardTitle>
        <CardDescription>
          Mantenha atualizada a evolução para subsidiar a Prestação de Contas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4 bg-muted/20 p-5 rounded-lg border">
          <div className="flex justify-between items-center">
            <Label className="flex items-center text-base font-semibold text-slate-800">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              Execução Física (Metas Atingidas)
            </Label>
            <span className="text-lg font-bold text-blue-700">{physical}%</span>
          </div>
          <Slider
            value={[physical]}
            onValueChange={(v) => setPhysical(v[0])}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Registre o volume de entregas sociais ou serviços prestados em relação ao previsto no
            plano.
          </p>
        </div>

        <div className="space-y-4 bg-muted/20 p-5 rounded-lg border">
          <div className="flex justify-between items-center">
            <Label className="flex items-center text-base font-semibold text-slate-800">
              <DollarSign className="h-4 w-4 mr-2 text-emerald-600" />
              Execução Financeira (Recursos Utilizados)
            </Label>
            <span className="text-lg font-bold text-emerald-700">{financial}%</span>
          </div>
          <Slider
            value={[financial]}
            onValueChange={(v) => setFinancial(v[0])}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Proporção dos recursos já liquidados e pagos em conformidade com o cronograma de
            desembolso.
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Última atualização: {new Date(execution.last_update).toLocaleString('pt-BR')}
          </p>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Atualizar Progresso
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
