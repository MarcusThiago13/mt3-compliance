import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
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
import { Loader2, FileText, CheckCircle2, Circle, AlertTriangle, Play, Landmark } from 'lucide-react'

export default function HabilitacaoCelebracaoTab({ partnership }: any) {
  const { tenantId } = useParams<{ tenantId: string }>()
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
    else toast({ title: 'Sucesso', description: 'Dados de habilitação atualizados.' })
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-purple-700" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-purple-50/50 p-4 rounded-lg border border-purple-100">
        <div>
          <h3 className="font-semibold text-purple-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-purple-600" />
            Habilitação e Celebração (Bloco 2)
          </h3>
          <p className="text-sm text-purple-800 mt-1 max-w-2xl">
            Controle do edital/chamamento público, proposta e checklist de requisitos legais para a celebração do instrumento.
          </p>
        </div>
        <Button variant="outline" asChild className="bg-white border-purple-200 text-purple-800 hover:bg-purple-50 shrink-0">
          <Link to={`/${tenantId}/osc/regularidade`}>
            <Landmark className="h-4 w-4 mr-2" /> Validar Regularidade Institucional (B1)
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Processo de Seleção / Chamamento</CardTitle>
            <CardDescription>
              Acompanhe os prazos do edital e o status da proposta técnica.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!call ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">
                  Esta parceria ainda não possui dados de chamamento vinculados.
                </p>
                <Button onClick={handleStart} disabled={saving} className="bg-purple-600">
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Vincular Edital
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Número do Edital / Referência</Label>
                  <Input
                    value={formData.notice_number}
                    onChange={(e) => setFormData({ ...formData, notice_number: e.target.value })}
                    placeholder="Ex: Edital 04/2026 SMDHC"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data de Publicação</Label>
                    <Input
                      type="date"
                      value={formData.publication_date}
                      onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prazo para Proposta</Label>
                    <Input
                      type="date"
                      value={formData.submission_deadline}
                      onChange={(e) => setFormData({ ...formData, submission_deadline: e.target.value })}
                    />
                  </div>
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
                      <SelectItem value="Finalizado">Processo Finalizado (Selecionada)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Resultado / Observações</Label>
                  <Input
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    placeholder="Ex: Aprovado em 1º Lugar"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Salvar Chamamento
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Checklist de Habilitação</CardTitle>
            <CardDescription>
              Validação dos requisitos para assinatura do instrumento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">Regularidade Institucional (Bloco 1)</p>
                <p className="text-xs text-emerald-700">Validação conectada automaticamente ao módulo da OSC. (Vigente)</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Proposta Técnica Aprovada</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Anexar</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50">
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Parecer Jurídico do Ente Parceiro</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Anexar</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50">
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Declaração de Instalações Prévias</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Anexar</Button>
              </div>
            </div>

            <div className="pt-4 border-t">
               <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm flex items-start gap-2 border border-amber-200">
                 <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                 <p>Há pendências na entrega documental. A celebração não deve prosseguir até o saneamento.</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
