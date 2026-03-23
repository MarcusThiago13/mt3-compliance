import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Activity, Play, Target, DollarSign, Upload, CheckCircle2 } from 'lucide-react'

export default function ExecucaoTab({ partnership }: any) {
  const [execution, setExecution] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [physical, setPhysical] = useState(0)
  const [financial, setFinancial] = useState(0)

  const fetchData = async () => {
    setLoading(true)
    const { data: execData } = await supabase
      .from('osc_partnership_execution' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .maybeSingle()

    if (execData) {
      setExecution(execData)
      setPhysical(execData.physical_progress || 0)
      setFinancial(execData.financial_progress || 0)
    }

    // Fetch goals to show progress tracking
    const { data: wpData } = await supabase.from('osc_partnership_workplans' as any).select('id').eq('partnership_id', partnership.id).maybeSingle()
    if (wpData) {
      const { data: goalsData } = await supabase.from('osc_partnership_goals' as any).select('*').eq('workplan_id', wpData.id)
      if (goalsData) setGoals(goalsData)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
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
    else toast({ title: 'Sucesso', description: 'Progresso macro atualizado.' })
    setSaving(false)
  }

  const handleUpdateGoal = async (goalId: string, value: number) => {
    const { error } = await supabase.from('osc_partnership_goals' as any).update({ achieved_value: value }).eq('id', goalId)
    if (!error) {
      toast({ title: 'Sucesso', description: 'Progresso da meta atualizado.' })
      fetchData()
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>
  }

  if (!execution) {
    return (
      <Card className="border-emerald-100 bg-emerald-50/30 text-center py-12">
        <CardContent className="space-y-4">
          <Activity className="h-12 w-12 text-emerald-300 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-emerald-900">
              Execução do Objeto Não Iniciada
            </h3>
            <p className="text-sm text-emerald-700 max-w-sm mx-auto mt-2">
              Ative este módulo para registrar o alcance de metas físicas e subsidiar os relatórios de execução.
            </p>
          </div>
          <Button onClick={handleStart} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Iniciar Módulo de Execução (Bloco 4)
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
        <div>
          <h3 className="font-semibold text-emerald-900 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-emerald-600" />
            Execução do Objeto (Bloco 4)
          </h3>
          <p className="text-sm text-emerald-800 mt-1 max-w-2xl">
            Acompanhamento do cumprimento de metas vinculadas ao plano de trabalho e guarda de evidências fotográficas ou documentais do objeto.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Monitoramento das Metas</CardTitle>
            <CardDescription>Acompanhamento detalhado do que foi pactuado no Plano de Trabalho (B3).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.length === 0 ? (
               <div className="text-center py-8 border-2 border-dashed rounded-lg bg-slate-50 text-slate-500">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">O Plano de Trabalho não possui metas cadastradas.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {goals.map((g) => {
                  const percent = g.target_value > 0 ? Math.round((g.achieved_value / g.target_value) * 100) : 0
                  return (
                    <div key={g.id} className="space-y-3 p-4 border rounded-lg bg-slate-50/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{g.title}</p>
                          <p className="text-xs text-muted-foreground">Alvo: {g.target_value} {g.unit}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${percent >= 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {percent}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${percent >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <Upload className="h-3 w-3 mr-2" /> Anexar Evidência
                          </Button>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" /> 0 Arquivos
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-muted-foreground">Alcançado:</span>
                           <input 
                             type="number" 
                             defaultValue={g.achieved_value} 
                             onBlur={(e) => handleUpdateGoal(g.id, parseFloat(e.target.value) || 0)}
                             className="w-16 px-2 py-1 text-xs border rounded"
                           />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Progresso Macro</CardTitle>
            <CardDescription>Resumo físico e financeiro geral da execução.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="flex items-center text-sm font-semibold text-slate-800">
                  <Target className="h-4 w-4 mr-2 text-blue-600" />
                  Execução Física Global
                </label>
                <span className="text-base font-bold text-blue-700">{physical}%</span>
              </div>
              <Slider
                value={[physical]}
                onValueChange={(v) => setPhysical(v[0])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="flex items-center text-sm font-semibold text-slate-800">
                  <DollarSign className="h-4 w-4 mr-2 text-emerald-600" />
                  Repasses / Desembolsos
                </label>
                <span className="text-base font-bold text-emerald-700">{financial}%</span>
              </div>
              <Slider
                value={[financial]}
                onValueChange={(v) => setFinancial(v[0])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Atualizar Painel Macro
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
