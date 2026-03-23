import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Loader2, Plus, MessageSquareWarning, CalendarClock, CheckCircle } from 'lucide-react'

export default function DiligenciasTab({ partnership, accountabilityId }: any) {
  const [diligences, setDiligences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    notification_date: '',
    deadline: '',
    description: '',
    status: 'Aberta',
    response_notes: '',
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

  const handleSave = async () => {
    setIsSaving(true)
    const { error } = await supabase.from('osc_accountability_diligences' as any).insert({
      partnership_id: partnership.id,
      ...formData,
    })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Diligência registrada.' })
      setIsModalOpen(false)
      fetchDiligences()
      setFormData({
        notification_date: '',
        deadline: '',
        description: '',
        status: 'Aberta',
        response_notes: '',
      })
    }
    setIsSaving(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aberta':
        return <Badge className="bg-amber-100 text-amber-800 border-none">Aberta - Pendente</Badge>
      case 'Respondida':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-none">Respondida (Em Análise)</Badge>
        )
      case 'Saneada':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-none">Saneada / Resolvida</Badge>
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
            Controle de Diligências e Pareceres
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Rastreamento de apontamentos do ente público para evitar glosas ou rejeição de contas.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 shrink-0 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Registrar Diligência
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
            <h3 className="text-lg font-bold text-slate-800">Nenhuma diligência registrada</h3>
            <p className="text-muted-foreground text-sm max-w-md mt-1">
              A prestação de contas desta parceria não possui apontamentos pendentes.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {diligences.map((d) => (
            <Card key={d.id} className="shadow-sm border-l-4 border-l-amber-500">
              <CardHeader className="pb-2 flex flex-col sm:flex-row items-start justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Notificação de Diligência
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center mt-1">
                    <CalendarClock className="h-3.5 w-3.5 mr-1" />
                    Recebida em: {new Date(d.notification_date).toLocaleDateString('pt-BR')}{' '}
                    <span className="mx-2">|</span>
                    Prazo Legal:{' '}
                    <strong className="ml-1 text-slate-800">
                      {d.deadline
                        ? new Date(d.deadline).toLocaleDateString('pt-BR')
                        : 'Não definido'}
                    </strong>
                  </CardDescription>
                </div>
                {getStatusBadge(d.status)}
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-3 rounded text-sm text-slate-700 mb-3 border">
                  {d.description}
                </div>
                {d.response_notes && (
                  <div className="bg-blue-50/50 p-3 rounded text-sm text-slate-700 border border-blue-100">
                    <span className="font-semibold text-blue-900 block mb-1">
                      Providências de Saneamento:
                    </span>
                    {d.response_notes}
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    Atualizar Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Diligência</DialogTitle>
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
                <Label>Prazo de Resposta</Label>
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
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
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
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
