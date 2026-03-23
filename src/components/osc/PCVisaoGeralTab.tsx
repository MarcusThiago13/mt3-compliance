import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, FileCheck, Save, Play, Target, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function PCVisaoGeralTab({ partnership }: any) {
  const [accountability, setAccountability] = useState<any>(null)
  const [execution, setExecution] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    report_type: 'Anual',
    status: 'Em Elaboração',
    deadline: '',
    submission_date: '',
    final_decision: '',
  })

  const fetchData = async () => {
    setLoading(true)

    // Fetch PC data
    const { data: accData } = await supabase
      .from('osc_partnership_accountability' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .maybeSingle()

    if (accData) {
      setAccountability(accData)
      setFormData({
        report_type: accData.report_type || 'Anual',
        status: accData.status || 'Em Elaboração',
        deadline: accData.deadline || '',
        submission_date: accData.submission_date || '',
        final_decision: accData.final_decision || '',
      })
    }

    // Fetch integration with B4 (Physical Execution)
    const { data: execData } = await supabase
      .from('osc_partnership_execution' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .maybeSingle()
    setExecution(execData)

    const { data: wpData } = await supabase
      .from('osc_partnership_workplans' as any)
      .select('id')
      .eq('partnership_id', partnership.id)
      .maybeSingle()

    if (wpData) {
      const { data: goalsData } = await supabase
        .from('osc_partnership_goals' as any)
        .select('*')
        .eq('workplan_id', wpData.id)
        .order('created_at', { ascending: true })
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
      .from('osc_partnership_accountability' as any)
      .insert({ partnership_id: partnership.id })
      .select()
      .single()

    if (data) {
      setAccountability(data)
      toast({ title: 'Sucesso', description: 'Módulo de Prestação de Contas ativado.' })
    }
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    setSaving(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('osc_partnership_accountability' as any)
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', accountability.id)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Metadados e status atualizados.' })
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
      </div>
    )
  }

  if (!accountability) {
    return (
      <Card className="border-amber-100 bg-amber-50/30 text-center py-12">
        <CardContent className="space-y-4">
          <FileCheck className="h-12 w-12 text-amber-400 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-amber-900">Módulo de Prestação Inativo</h3>
            <p className="text-sm text-amber-700 max-w-md mx-auto mt-2">
              Inicie a prestação de contas desta parceria para compilar a execução física e
              financeira em um dossiê único e auditável.
            </p>
          </div>
          <Button
            onClick={handleStart}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700 mt-4 text-white"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Iniciar Processo de Prestação
          </Button>
        </CardContent>
      </Card>
    )
  }

  const physicalProgress = execution?.physical_progress || 0

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Status Legal e Aprovações</CardTitle>
            <CardDescription>
              Acompanhamento formal do processo perante o Órgão Público.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Relatório</Label>
                <Select
                  value={formData.report_type}
                  onValueChange={(v) => setFormData({ ...formData, report_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parcial">Parcial / Intermediária</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status da Prestação</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em Elaboração">Em Elaboração (Pendente de Envio)</SelectItem>
                    <SelectItem value="Enviada">Enviada para Análise</SelectItem>
                    <SelectItem value="Em Diligência">Em Diligência / Saneamento</SelectItem>
                    <SelectItem value="Aprovada">Aprovada (Regular)</SelectItem>
                    <SelectItem value="Aprovada com Ressalvas">Aprovada com Ressalvas</SelectItem>
                    <SelectItem value="Rejeitada">Rejeitada (Irregular)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prazo Limite para Envio</Label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data de Protocolo Efetivo</Label>
                <Input
                  type="date"
                  value={formData.submission_date}
                  onChange={(e) => setFormData({ ...formData, submission_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Decisão Final / Parecer Conclusivo do Ente</Label>
              <Input
                value={formData.final_decision}
                onChange={(e) => setFormData({ ...formData, final_decision: e.target.value })}
                placeholder="Ex: Contas julgadas regulares conforme Parecer nº 123/2026..."
              />
            </div>

            <div className="flex justify-end pt-2 border-t">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-slate-800 hover:bg-slate-900 w-full sm:w-auto"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Histórico Legal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-emerald-100 bg-emerald-50/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-emerald-900">
              <Target className="h-5 w-5 mr-2 text-emerald-600" />
              Relatório de Execução do Objeto
            </CardTitle>
            <CardDescription>
              O cumprimento físico alimenta a aprovação financeira. Dados sincronizados do módulo de
              Gestão (B4).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-emerald-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Índice Global de Execução Física
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Reportado no acompanhamento da parceria
                </p>
              </div>
              <span
                className={`text-2xl font-bold ${physicalProgress >= 100 ? 'text-emerald-600' : 'text-blue-600'}`}
              >
                {physicalProgress}%
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-800">Status das Metas Pactuadas:</h4>
              {goals.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  Nenhuma meta estruturada no Plano de Trabalho.
                </p>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                  {goals.map((g) => {
                    const percent =
                      g.target_value > 0 ? Math.round((g.achieved_value / g.target_value) * 100) : 0
                    return (
                      <div
                        key={g.id}
                        className="flex items-center justify-between p-2 text-sm border rounded bg-white"
                      >
                        <span className="truncate max-w-[65%] font-medium text-slate-700">
                          {g.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{percent}%</span>
                          {percent >= 100 ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
