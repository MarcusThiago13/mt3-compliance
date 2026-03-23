import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Plus, Users, Search, ClipboardList } from 'lucide-react'

export default function EstudosCasoTab({ tenantId }: { tenantId: string }) {
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    student_name: '',
    status: 'Ativo',
    demands: '',
    barriers: '',
    potentialities: '',
  })

  const fetchCases = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('osc_inclusive_cases')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
    if (data) setCases(data)
    setLoading(false)
  }

  useEffect(() => {
    if (tenantId) fetchCases()
  }, [tenantId])

  const handleSave = async () => {
    if (!formData.student_name)
      return toast({
        title: 'Atenção',
        description: 'O nome do estudante é obrigatório.',
        variant: 'destructive',
      })
    setSaving(true)
    const { error } = await supabase
      .from('osc_inclusive_cases')
      .insert({ tenant_id: tenantId, ...formData })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Estudo de caso registrado.' })
      setIsModalOpen(false)
      fetchCases()
      setFormData({
        student_name: '',
        status: 'Ativo',
        demands: '',
        barriers: '',
        potentialities: '',
      })
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <ClipboardList className="h-5 w-5 mr-2 text-blue-600" /> Registro de Estudos de Caso
        </h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Novo Estudo de Caso
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Nenhum estudo de caso registrado para a escola.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Demandas / Necessidades</TableHead>
                  <TableHead>Barreiras Identificadas</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.student_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {c.demands || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {c.barriers || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {c.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Novo Estudo de Caso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Estudante (Público-Alvo da Educação Especial) *</Label>
              <Input
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Demandas e Necessidades Específicas</Label>
              <Textarea
                rows={2}
                value={formData.demands}
                onChange={(e) => setFormData({ ...formData, demands: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Barreiras à Inclusão Identificadas</Label>
              <Textarea
                rows={2}
                value={formData.barriers}
                onChange={(e) => setFormData({ ...formData, barriers: e.target.value })}
                placeholder="Físicas, Atitudinais, Pedagógicas..."
              />
            </div>
            <div className="space-y-2">
              <Label>Potencialidades do Estudante</Label>
              <Textarea
                rows={2}
                value={formData.potentialities}
                onChange={(e) => setFormData({ ...formData, potentialities: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Salvar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
