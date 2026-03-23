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
import { Loader2, FileText, Play } from 'lucide-react'

export default function ChamamentoTab({ partnership }: any) {
  const [call, setCall] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    notice_number: '',
    publication_date: '',
    submission_deadline: '',
    status: 'Aberto',
    result: '',
  })

  const fetchCall = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('osc_partnership_calls' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .maybeSingle()

    if (data) {
      setCall(data)
      setFormData({
        notice_number: data.notice_number || '',
        publication_date: data.publication_date || '',
        submission_deadline: data.submission_deadline || '',
        status: data.status || 'Aberto',
        result: data.result || '',
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCall()
  }, [partnership.id])

  const handleStart = async () => {
    setSaving(true)
    const { data, error } = await supabase
      .from('osc_partnership_calls' as any)
      .insert({ partnership_id: partnership.id })
      .select()
      .single()

    if (data) setCall(data)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    setSaving(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('osc_partnership_calls' as any)
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', call.id)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Dados do edital atualizados.' })
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-purple-700" />
      </div>
    )
  }

  if (!call) {
    return (
      <Card className="border-purple-100 bg-purple-50/30 text-center py-12">
        <CardContent className="space-y-4">
          <FileText className="h-12 w-12 text-purple-300 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-purple-900">Processo de Seleção</h3>
            <p className="text-sm text-purple-700 max-w-sm mx-auto mt-2">
              Se esta parceria é oriunda de um edital ou chamamento público, inicie o registro para
              controle de prazos e diligências.
            </p>
          </div>
          <Button
            onClick={handleStart}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Vincular Edital de Chamamento
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-purple-100">
      <CardHeader>
        <CardTitle className="text-lg text-purple-900">Controle do Chamamento Público</CardTitle>
        <CardDescription>
          Acompanhe os prazos do edital e o status da proposta técnica.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Número do Edital / Referência</Label>
            <Input
              value={formData.notice_number}
              onChange={(e) => setFormData({ ...formData, notice_number: e.target.value })}
              placeholder="Ex: Edital 04/2026 SMDHC"
            />
          </div>
          <div className="space-y-2">
            <Label>Status no Certame</Label>
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aberto">Edital Aberto (Preparando)</SelectItem>
                <SelectItem value="Enviado">Proposta Enviada (Avaliando)</SelectItem>
                <SelectItem value="Diligência">Em Diligência</SelectItem>
                <SelectItem value="Finalizado">Processo Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Data de Publicação do Edital</Label>
            <Input
              type="date"
              value={formData.publication_date}
              onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Prazo Limite para Proposta</Label>
            <Input
              type="date"
              value={formData.submission_deadline}
              onChange={(e) => setFormData({ ...formData, submission_deadline: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Resultado / Observações</Label>
            <Input
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              placeholder="Ex: Aprovado em 1º Lugar / Necessário ajustar plano financeiro..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Salvar Edital
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
