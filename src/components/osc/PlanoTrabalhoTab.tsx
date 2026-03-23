import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Target, Plus, Save, GitCommit } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export default function PlanoTrabalhoTab({ partnership }: any) {
  const [workplan, setWorkplan] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', target_value: 0, unit: '' })

  const [formData, setFormData] = useState({
    object_description: '',
    methodology: '',
    status: 'Em Elaboração'
  })

  const fetchData = async () => {
    setLoading(true)
    const { data: wpData } = await supabase
      .from('osc_partnership_workplans' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .maybeSingle()

    if (wpData) {
      setWorkplan(wpData)
      setFormData({
        object_description: wpData.object_description || '',
        methodology: wpData.methodology || '',
        status: wpData.status || 'Em Elaboração'
      })

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

  const handleStartWorkplan = async () => {
    setSaving(true)
    const { data, error } = await supabase
      .from('osc_partnership_workplans' as any)
      .insert({ partnership_id: partnership.id })
      .select()
      .single()

    if (data) {
      setWorkplan(data)
      toast({ title: 'Sucesso', description: 'Plano de Trabalho iniciado.' })
    }
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    setSaving(false)
  }

  const handleSaveWorkplan = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('osc_partnership_workplans' as any)
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', workplan.id)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Plano de trabalho atualizado.' })
    setSaving(false)
  }

  const handleAddGoal = async () => {
    if (!newGoal.title) return toast({ title: 'Atenção', description: 'O título da meta é obrigatório.', variant: 'destructive' })
    
    setSaving(true)
    const { error } = await supabase
      .from('osc_partnership_goals' as any)
      .insert({ workplan_id: workplan.id, ...newGoal })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Meta adicionada com sucesso.' })
      setIsGoalModalOpen(false)
      setNewGoal({ title: '', target_value: 0, unit: '' })
      fetchData()
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
  }

  if (!workplan) {
    return (
      <Card className="border-blue-100 bg-blue-50/30 text-center py-12">
        <CardContent className="space-y-4">
          <GitCommit className="h-12 w-12 text-blue-300 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-blue-900">Plano de Trabalho (Bloco 3)</h3>
            <p className="text-sm text-blue-700 max-w-sm mx-auto mt-2">
              O Plano de Trabalho é o eixo central que guia a execução física e financeira. Inicie a estruturação para adicionar metas e cronograma.
            </p>
          </div>
          <Button onClick={handleStartWorkplan} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Iniciar Estruturação do Plano
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        <div>
          <h3 className="font-semibold text-blue-900 flex items-center">
            <GitCommit className="h-5 w-5 mr-2 text-blue-600" />
            Plano de Trabalho (Bloco 3)
          </h3>
          <p className="text-sm text-blue-800 mt-1 max-w-2xl">
            Estruturação jurídica e operacional das metas, resultados esperados e metodologia de execução que vinculam a prestação de contas.
          </p>
        </div>
        <Badge variant={formData.status === 'Aprovado' ? 'default' : 'secondary'} className="bg-white text-blue-800 border-blue-200">
          Status: {formData.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Estrutura Descritiva</CardTitle>
            <CardDescription>Detalhamento macro do escopo a ser executado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Descrição da Realidade / Objeto Específico</Label>
              <Textarea 
                rows={4}
                value={formData.object_description}
                onChange={(e) => setFormData({ ...formData, object_description: e.target.value })}
                placeholder="Descreva detalhadamente o que será realizado..."
              />
            </div>
            <div className="space-y-2">
              <Label>Metodologia de Execução</Label>
              <Textarea 
                rows={4}
                value={formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                placeholder="Como as atividades serão desenvolvidas..."
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveWorkplan} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Salvar Textos Base
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Metas e Indicadores</CardTitle>
              <CardDescription>Resultados quantificáveis a serem atingidos.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setIsGoalModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Nova Meta
            </Button>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg bg-slate-50 text-slate-500">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhuma meta cadastrada no plano de trabalho.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Descrição da Meta</TableHead>
                      <TableHead>Previsto</TableHead>
                      <TableHead>Unidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goals.map((g) => (
                      <TableRow key={g.id}>
                        <TableCell className="font-medium text-sm">{g.title}</TableCell>
                        <TableCell>{g.target_value}</TableCell>
                        <TableCell className="text-muted-foreground">{g.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Meta ao Plano</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Descrição da Meta</Label>
              <Input
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="Ex: Realizar 50 oficinas socioeducativas"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantidade Prevista</Label>
                <Input
                  type="number"
                  value={newGoal.target_value}
                  onChange={(e) => setNewGoal({ ...newGoal, target_value: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Unidade de Medida</Label>
                <Input
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  placeholder="Ex: Oficinas, Alunos, Eventos..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGoalModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddGoal} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Adicionar Meta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
