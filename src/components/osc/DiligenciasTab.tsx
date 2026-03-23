import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import {
  Loader2,
  Plus,
  MessageSquareWarning,
  CalendarClock,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react'

export default function DiligenciasTab({ partnership }: any) {
  const [diligences, setDiligences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    notification_date: '',
    deadline: '',
    description: '',
    status: 'Aberta',
    response_notes: '',
    glosa_amount: 0,
    glosa_reason: '',
  })

  const fetchDiligences = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('osc_accountability_diligences' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .order('notification_date', { ascending: false })

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else setDiligences(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchDiligences()
  }, [partnership.id])

  const openModal = (diligence?: any) => {
    if (diligence) {
      setEditingId(diligence.id)
      setFormData({
        notification_date: diligence.notification_date,
        deadline: diligence.deadline || '',
        description: diligence.description,
        status: diligence.status || 'Aberta',
        response_notes: diligence.response_notes || '',
        glosa_amount: diligence.glosa_amount || 0,
        glosa_reason: diligence.glosa_reason || '',
      })
    } else {
      setEditingId(null)
      setFormData({
        notification_date: '',
        deadline: '',
        description: '',
        status: 'Aberta',
        response_notes: '',
        glosa_amount: 0,
        glosa_reason: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const payload = {
      partnership_id: partnership.id,
      ...formData,
      glosa_amount: formData.glosa_amount || 0,
    }

    let error
    if (editingId) {
      const res = await supabase
        .from('osc_accountability_diligences' as any)
        .update(payload)
        .eq('id', editingId)
      error = res.error
    } else {
      const res = await supabase.from('osc_accountability_diligences' as any).insert(payload)
      error = res.error
    }

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Registro atualizado.' })
      setIsModalOpen(false)
      fetchDiligences()
    }
    setIsSaving(false)
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aberta':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-none hover:bg-amber-200">
            Aberta - Pendente
          </Badge>
        )
      case 'Respondida':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-none hover:bg-blue-200">
            Respondida (Em Análise)
          </Badge>
        )
      case 'Saneada':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-200">
            Saneada / Regularizada
          </Badge>
        )
      case 'Glosa':
        return (
          <Badge className="bg-red-100 text-red-800 border-none hover:bg-red-200">
            Glosa Aplicada
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-lg border border-dashed">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <MessageSquareWarning className="h-5 w-5 mr-2 text-amber-600" />
            Controle de Diligências e Glosas
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Rastreamento do histórico de apontamentos da Administração Pública. Registre as
            respostas e mapeie possíveis glosas de despesas para manter a trilha de auditoria
            íntegra.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-amber-600 hover:bg-amber-700 shrink-0 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Registrar Notificação
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
        </div>
      ) : diligences.length === 0 ? (
        <Card className="border-amber-100 bg-amber-50/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-800">Histórico Limpo</h3>
            <p className="text-muted-foreground text-sm max-w-md mt-1">
              A prestação de contas desta parceria não possui apontamentos pendentes ou glosas
              aplicadas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {diligences.map((d) => (
            <Card
              key={d.id}
              className={`shadow-sm border-l-4 ${d.status === 'Glosa' ? 'border-l-red-500 bg-red-50/10' : d.status === 'Saneada' ? 'border-l-emerald-500' : 'border-l-amber-500'}`}
            >
              <CardHeader className="pb-2 flex flex-col sm:flex-row items-start justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Notificação Oficial / Parecer
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center mt-1">
                    <CalendarClock className="h-3.5 w-3.5 mr-1" />
                    Recebida em:{' '}
                    {new Date(d.notification_date).toLocaleDateString('pt-BR', {
                      timeZone: 'UTC',
                    })}{' '}
                    <span className="mx-2">|</span>
                    Prazo de Resposta:{' '}
                    <strong
                      className={`ml-1 ${d.status === 'Aberta' ? 'text-amber-700' : 'text-slate-700'}`}
                    >
                      {d.deadline
                        ? new Date(d.deadline).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                        : 'Não definido'}
                    </strong>
                  </CardDescription>
                </div>
                {getStatusBadge(d.status)}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-md text-sm text-slate-700 border">
                    <span className="font-semibold block mb-1 text-slate-900">
                      Apontamentos do Ente Público:
                    </span>
                    {d.description}
                  </div>

                  {d.status === 'Glosa' && (
                    <div className="bg-red-50 p-3 rounded-md text-sm text-red-900 border border-red-200 flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-1">
                          Despesa Glosada: {formatCurrency(d.glosa_amount)}
                        </span>
                        <span>{d.glosa_reason || 'Motivo da glosa não detalhado.'}</span>
                      </div>
                    </div>
                  )}

                  {d.response_notes && (
                    <div className="bg-blue-50/50 p-3 rounded-md text-sm text-slate-700 border border-blue-100">
                      <span className="font-semibold text-blue-900 block mb-1">
                        Providências de Saneamento / Defesa:
                      </span>
                      {d.response_notes}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => openModal(d)}>
                    Atualizar e Responder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Atualizar Tramitação' : 'Registrar Nova Diligência'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Recebimento</Label>
                <Input
                  type="date"
                  value={formData.notification_date}
                  onChange={(e) => setFormData({ ...formData, notification_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Prazo de Resposta Legal</Label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição / Apontamentos do Ente Público</Label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva os itens questionados..."
              />
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="space-y-2">
                <Label>Status do Tratamento</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aberta">Aberta (Aguardando ação da OSC)</SelectItem>
                    <SelectItem value="Respondida">Respondida (Aguardando ente)</SelectItem>
                    <SelectItem value="Saneada">Saneada (Aceita pelo ente)</SelectItem>
                    <SelectItem value="Glosa">Glosa Confirmada (Rejeição do item)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.status === 'Glosa' && (
                <div className="grid gap-4 bg-red-50 p-4 rounded-md border border-red-100">
                  <div className="space-y-2">
                    <Label className="text-red-900">Valor Total Glosado (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.glosa_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, glosa_amount: parseFloat(e.target.value) || 0 })
                      }
                      className="border-red-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-red-900">Fundamento da Rejeição / Glosa</Label>
                    <Textarea
                      rows={2}
                      value={formData.glosa_reason}
                      onChange={(e) => setFormData({ ...formData, glosa_reason: e.target.value })}
                      className="border-red-200"
                      placeholder="Ex: Despesa não prevista no plano de trabalho (Art. X)..."
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Defesa ou Providências Saneadoras da OSC</Label>
                <Textarea
                  rows={3}
                  value={formData.response_notes}
                  onChange={(e) => setFormData({ ...formData, response_notes: e.target.value })}
                  placeholder="Registro das ações tomadas internamente para sanear o apontamento..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
