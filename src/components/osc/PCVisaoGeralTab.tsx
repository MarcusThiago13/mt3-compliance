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
import { Loader2, FileCheck, Save, Play, AlertTriangle } from 'lucide-react'

export default function PCVisaoGeralTab({ partnership }: any) {
  const [accountability, setAccountability] = useState<any>(null)
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
      toast({
        title: 'Sucesso',
        description: 'Módulo de Prestação de Contas ativado para esta parceria.',
      })
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
    else toast({ title: 'Sucesso', description: 'Metadados da prestação atualizados.' })
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
            <h3 className="text-lg font-bold text-amber-900">Módulo Financeiro Inativo</h3>
            <p className="text-sm text-amber-700 max-w-md mx-auto mt-2">
              Inicie a estruturação da prestação de contas habilitando o controle de contas
              bancárias, conciliação e demonstrativos.
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
            Ativar Módulo de Prestação
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-amber-900 text-sm">
            Integração com o Gestor da Parceria
          </h4>
          <p className="text-sm text-amber-800 mt-1">
            As classificações e status definidos aqui são automaticamente sincronizados com o painel
            central da parceria para visão dos coordenadores de projeto.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-800">Status Legal e Prazos</CardTitle>
          <CardDescription>
            Controle o envio e o parecer conclusivo da administração pública.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
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
              <Label>Status Atual</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em Elaboração">Em Elaboração (Interno)</SelectItem>
                  <SelectItem value="Enviada">Enviada para Análise do Ente</SelectItem>
                  <SelectItem value="Em Diligência">Em Diligência / Saneamento</SelectItem>
                  <SelectItem value="Aprovada">Aprovada (Regular)</SelectItem>
                  <SelectItem value="Aprovada com Ressalvas">Aprovada com Ressalvas</SelectItem>
                  <SelectItem value="Rejeitada">Rejeitada (Irregular)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prazo Limite Legal/Contratual</Label>
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
            <div className="space-y-2 md:col-span-2">
              <Label>Decisão Final / Parecer Conclusivo</Label>
              <Input
                value={formData.final_decision}
                onChange={(e) => setFormData({ ...formData, final_decision: e.target.value })}
                placeholder="Ex: Contas julgadas regulares conforme Parecer nº 123..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-slate-800 hover:bg-slate-900"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Metadados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
