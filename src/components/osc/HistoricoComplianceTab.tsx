import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, ShieldAlert, History, Plus, FileWarning, Clock } from 'lucide-react'

export default function HistoricoComplianceTab({ partnership }: any) {
  const [occurrences, setOccurrences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Advertência',
    description: '',
    severity: 'Baixa',
  })

  const fetchOccurrences = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('osc_partnership_occurrences' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .order('date', { ascending: false })
    
    if (data) setOccurrences(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchOccurrences()
  }, [partnership.id])

  const handleSave = async () => {
    if (!formData.description) return toast({ title: 'Atenção', description: 'Descreva a ocorrência.', variant: 'destructive' })

    setSaving(true)
    const { error } = await supabase.from('osc_partnership_occurrences' as any).insert({
      partnership_id: partnership.id,
      ...formData
    })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Registro institucional salvo.' })
      setIsModalOpen(false)
      setFormData({ date: new Date().toISOString().split('T')[0], type: 'Advertência', description: '', severity: 'Baixa' })
      fetchOccurrences()
    }
    setSaving(false)
  }

  const getSeverityBadge = (sev: string) => {
    if (sev === 'Alta') return <Badge variant="destructive">Gravidade Alta</Badge>
    if (sev === 'Média') return <Badge className="bg-amber-500 hover:bg-amber-600 border-none">Gravidade Média</Badge>
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">Gravidade Baixa</Badge>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-100 p-4 rounded-lg border border-slate-200">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <History className="h-5 w-5 mr-2 text-slate-600" />
            Histórico Institucional e Conformidade (Bloco 10)
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Retenção de eventos críticos, advertências, glosas relevantes e trilha de auditoria para fins de compliance e histórico da OSC perante a Administração Pública.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-slate-800 hover:bg-slate-900 shrink-0">
          <Plus className="h-4 w-4 mr-2" /> Registrar Ocorrência
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Ocorrências e Impedimentos Registrados</CardTitle>
            <CardDescription>Eventos que afetam o grau de risco institucional da parceria.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
            ) : occurrences.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-lg bg-slate-50 text-slate-500">
                <ShieldAlert className="h-10 w-10 mx-auto mb-2 opacity-20 text-emerald-500" />
                <p className="text-sm font-medium text-slate-700">Histórico Limpo</p>
                <p className="text-xs mt-1">Nenhuma penalidade, advertência ou glosa grave registrada no ciclo desta parceria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {occurrences.map((occ) => (
                  <div key={occ.id} className="p-4 border rounded-lg bg-white relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${occ.severity === 'Alta' ? 'bg-red-500' : occ.severity === 'Média' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                    <div className="flex justify-between items-start mb-2 pl-2">
                      <div className="flex items-center gap-2">
                        <FileWarning className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-800 text-sm">{occ.type}</span>
                      </div>
                      {getSeverityBadge(occ.severity)}
                    </div>
                    <p className="text-sm text-slate-600 pl-2 mb-2">{occ.description}</p>
                    <p className="text-xs text-muted-foreground pl-2 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> Ocorrido em: {new Date(occ.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 h-fit bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Trilha de Auditoria (Logs)</CardTitle>
            <CardDescription>Rastreabilidade imutável gerada pelo sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-xs p-2 bg-white border rounded">
                <span className="font-semibold text-slate-700 block">Criação da Parceria</span>
                <span className="text-muted-foreground">{new Date(partnership.created_at).toLocaleString('pt-BR')} por Usuário Logado</span>
              </div>
              <div className="text-xs p-2 bg-white border rounded">
                <span className="font-semibold text-slate-700 block">Atualização de Dados (B5)</span>
                <span className="text-muted-foreground">{new Date(partnership.updated_at).toLocaleString('pt-BR')} via Sistema</span>
              </div>
              <div className="mt-4 p-3 bg-slate-100 rounded text-center">
                 <p className="text-xs text-slate-600">A trilha de auditoria completa da plataforma garante que dados sensíveis não sejam excluídos, retendo logs por 10 anos pós-julgamento.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Ocorrência Formal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data do Evento</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Classificação / Tipo</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advertência Formal">Advertência Formal</SelectItem>
                    <SelectItem value="Glosa Relevante">Glosa Relevante</SelectItem>
                    <SelectItem value="Suspensão de Repasse">Suspensão de Repasse</SelectItem>
                    <SelectItem value="Auditoria Externa">Apontamento Auditoria Externa</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição Factual</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Descreva brevemente o evento..." />
            </div>
            <div className="space-y-2">
              <Label>Gravidade (Impacto no Compliance)</Label>
              <Select value={formData.severity} onValueChange={(v) => setFormData({ ...formData, severity: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa (Rotineira)</SelectItem>
                  <SelectItem value="Média">Média (Atenção)</SelectItem>
                  <SelectItem value="Alta">Alta (Impeditiva)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-slate-800 hover:bg-slate-900 text-white">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Registrar Ocorrência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
