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
import { Plus, ShieldAlert } from 'lucide-react'

export function RegistroTecnicoForm({
  tenantId,
  onSaved,
}: {
  tenantId: string
  onSaved: () => void
}) {
  const [open, setOpen] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    student_id: '',
    professional_role: '',
    intervention_type: '',
    description: '',
    orientations: '',
    referrals: '',
    is_secret: false,
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
    if (!formData.student_id || !formData.professional_role || !formData.intervention_type) {
      toast({
        title: 'Atenção',
        description: 'Preencha os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    const { error } = await supabase.from('osc_inclusive_technical_logs').insert({
      tenant_id: tenantId,
      student_id: formData.student_id,
      professional_id: user?.id,
      professional_name: user?.user_metadata?.name || user?.email || 'Profissional',
      professional_role: formData.professional_role,
      intervention_type: formData.intervention_type,
      description: formData.description,
      orientations: formData.orientations,
      referrals: formData.referrals,
      is_secret: formData.is_secret,
    })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Registro técnico salvo.' })
      setOpen(false)
      onSaved()
      setFormData({
        ...formData,
        description: '',
        orientations: '',
        referrals: '',
        is_secret: false,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-700 hover:bg-blue-800">
          <Plus className="h-4 w-4 mr-2" /> Novo Registro Técnico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registro de Acompanhamento Multiprofissional</DialogTitle>
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
              <Label>Perfil Profissional *</Label>
              <Select onValueChange={(v) => setFormData({ ...formData, professional_role: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Psicólogo(a)">Psicólogo(a)</SelectItem>
                  <SelectItem value="Assistente Social">Assistente Social</SelectItem>
                  <SelectItem value="Professor(a) AEE">Professor(a) AEE</SelectItem>
                  <SelectItem value="Fonoaudiólogo(a)">Fonoaudiólogo(a)</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Intervenção *</Label>
            <Select onValueChange={(v) => setFormData({ ...formData, intervention_type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Atendimento Individual">Atendimento Individual</SelectItem>
                <SelectItem value="Orientação à Família">Orientação à Família</SelectItem>
                <SelectItem value="Reunião com Equipe Escolar">
                  Reunião com Equipe Escolar
                </SelectItem>
                <SelectItem value="Avaliação/Triagem">Avaliação/Triagem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Descrição Técnica</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Descreva a intervenção realizada..."
            />
          </div>

          <div className="space-y-2">
            <Label>Encaminhamentos / Articulações de Rede</Label>
            <Textarea
              value={formData.referrals}
              onChange={(e) => setFormData({ ...formData, referrals: e.target.value })}
              rows={2}
            />
          </div>

          <div className="p-4 bg-slate-50 border rounded-lg flex items-start gap-4">
            <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-amber-900 cursor-pointer">
                  Marcação de Sigilo Profissional
                </Label>
                <Switch
                  checked={formData.is_secret}
                  onCheckedChange={(c) => setFormData({ ...formData, is_secret: c })}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ative esta opção se o registro contiver informações clínicas ou sensíveis protegidas
                por sigilo profissional. O conteúdo será ocultado para perfis operacionais.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar Registro Seguro</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
