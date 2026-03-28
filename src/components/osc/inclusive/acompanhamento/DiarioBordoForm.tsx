import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
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
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export function DiarioBordoForm({ tenantId, onSaved }: { tenantId: string; onSaved: () => void }) {
  const [open, setOpen] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    student_id: '',
    log_date: new Date().toISOString().split('T')[0],
    activity_type: '',
    presence: true,
    description: '',
    strategies_used: '',
    observations: '',
    paee_adherence: true,
    needs_referral: false,
  })

  useEffect(() => {
    if (open) {
      supabase
        .from('osc_inclusive_students')
        .select('id, name')
        .eq('tenant_id', tenantId)
        .eq('status', 'Ativo')
        .then(({ data }) => setStudents(data || []))
    }
  }, [open, tenantId])

  const handleSubmit = async () => {
    if (!formData.student_id || !formData.activity_type || !formData.description) {
      toast({
        title: 'Atenção',
        description: 'Preencha os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    const { error } = await supabase.from('osc_inclusive_daily_logs').insert({
      tenant_id: tenantId,
      student_id: formData.student_id,
      professional_id: user?.id,
      professional_name: user?.user_metadata?.name || user?.email || 'Profissional',
      log_date: formData.log_date,
      activity_type: formData.activity_type,
      presence: formData.presence,
      description: formData.description,
      strategies_used: formData.strategies_used,
      observations: formData.observations,
      paee_adherence: formData.paee_adherence,
      needs_referral: formData.needs_referral,
    })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Registro diário salvo.' })
      setOpen(false)
      onSaved()
      setFormData({ ...formData, description: '', strategies_used: '', observations: '' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Novo Registro Diário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Diário de Bordo - Apoio Escolar</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estudante *</Label>
              <Select onValueChange={(v) => setFormData({ ...formData, student_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data *</Label>
              <Input
                type="date"
                value={formData.log_date}
                onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Atividade *</Label>
            <Select onValueChange={(v) => setFormData({ ...formData, activity_type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a atividade..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Apoio em sala de aula">Apoio em sala de aula</SelectItem>
                <SelectItem value="Apoio em locomoção/alimentação">
                  Apoio em locomoção/alimentação
                </SelectItem>
                <SelectItem value="Atividade externa">Atividade externa</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Descrição da Atividade *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Estratégias Utilizadas</Label>
            <Textarea
              value={formData.strategies_used}
              onChange={(e) => setFormData({ ...formData, strategies_used: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between border p-3 rounded-lg">
              <Label className="cursor-pointer">Estudante Presente?</Label>
              <Switch
                checked={formData.presence}
                onCheckedChange={(c) => setFormData({ ...formData, presence: c })}
              />
            </div>
            <div className="flex items-center justify-between border p-3 rounded-lg">
              <Label className="cursor-pointer">Aderente ao PAEE?</Label>
              <Switch
                checked={formData.paee_adherence}
                onCheckedChange={(c) => setFormData({ ...formData, paee_adherence: c })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar Registro</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
