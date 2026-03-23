import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, Plus, Loader2, ListTodo, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export default function PlanoTrabalhoTab({ partnership }: any) {
  const [workplan, setWorkplan] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    target_value: 0,
    unit: '',
    verification_method: '',
  })

  const fetchData = async () => {
    setLoading(true)
    let { data: wp } = await supabase
      .from('osc_partnership_workplans' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .maybeSingle()
    if (!wp) {
      const { data: newWp } = await supabase
        .from('osc_partnership_workplans' as any)
        .insert({ partnership_id: partnership.id })
        .select()
        .single()
      wp = newWp
    }
    setWorkplan(wp)
    if (wp) {
      const { data: g } = await supabase
        .from('osc_partnership_goals' as any)
        .select('*')
        .eq('workplan_id', wp.id)
        .order('created_at', { ascending: true })
      setGoals(g || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [partnership.id])

  const handleAddGoal = async () => {
    if (!workplan) return
    await supabase
      .from('osc_partnership_goals' as any)
      .insert({ workplan_id: workplan.id, ...newGoal })
    setIsModalOpen(false)
    setNewGoal({ title: '', target_value: 0, unit: '', verification_method: '' })
    fetchData()
  }

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-lg border">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <ListTodo className="h-5 w-5 mr-2 text-slate-500" />
            Plano de Trabalho (Bloco 3)
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Eixo jurídico-operacional central. O que é cadastrado aqui serve de referência para toda
            a fase de execução.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Meta
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Metas e Indicadores Aprovados</CardTitle>
          <CardDescription>
            Critérios quantitativos e qualitativos que embasarão a prestação de contas física.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma meta pactuada registrada no Plano de Trabalho.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className="p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800">{g.title}</h4>
                    <span className="text-sm font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Alvo Pactuado: {g.target_value} {g.unit}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center mt-2">
                    <FileText className="h-4 w-4 mr-2" /> Comprovação Exigida:{' '}
                    <span className="ml-1 text-slate-700">
                      {g.verification_method || 'Não definida'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Meta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Descrição da Meta</Label>
              <Input
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="Ex: Capacitar 100 professores da rede"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Alvo (Quantitativo)</Label>
                <Input
                  type="number"
                  value={newGoal.target_value}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, target_value: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Unidade de Medida</Label>
                <Input
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  placeholder="Ex: pessoas, atendimentos, %"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Meio de Comprovação (Evidência Física)</Label>
              <Input
                value={newGoal.verification_method}
                onChange={(e) => setNewGoal({ ...newGoal, verification_method: e.target.value })}
                placeholder="Ex: Listas de presença e relatório fotográfico"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddGoal}>Salvar Meta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
