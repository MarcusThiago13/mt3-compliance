import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Loader2, FileText, CheckCircle2, AlertCircle, Plus } from 'lucide-react'

export function PlanosTab({ tenantId }: { tenantId: string }) {
  const [plans, setPlans] = useState<any[]>([])
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    case_id: '',
    plan_type: 'PAEE',
    status: 'Em Elaboração',
  })

  const fetchData = async () => {
    setLoading(true)
    const [plansRes, casesRes] = await Promise.all([
      supabase
        .from('osc_inclusive_plans')
        .select('*, osc_inclusive_cases(student_name, osc_inclusive_students(name))')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false }),
      supabase
        .from('osc_inclusive_cases')
        .select('id, student_name, osc_inclusive_students(name)')
        .eq('tenant_id', tenantId),
    ])

    if (plansRes.data) setPlans(plansRes.data)
    if (casesRes.data) setCases(casesRes.data)
    setLoading(false)
  }

  useEffect(() => {
    if (tenantId) fetchData()
  }, [tenantId])

  const handleSave = async () => {
    if (!formData.case_id)
      return toast({
        title: 'Atenção',
        description: 'Selecione um Estudo de Caso.',
        variant: 'destructive',
      })
    setSaving(true)
    const { error } = await supabase
      .from('osc_inclusive_plans')
      .insert({ tenant_id: tenantId, ...formData })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Plano criado com sucesso.' })
      setIsModalOpen(false)
      fetchData()
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" /> Acompanhamento de PAEE e PEI
        </h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Criar Plano
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum plano (PEI ou PAEE) elaborado ainda. Crie o primeiro plano a partir de um
              Estudo de Caso.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Tipo de Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsáveis (AEE/Docente)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((p) => {
                  const studentName =
                    p.osc_inclusive_cases?.osc_inclusive_students?.name ||
                    p.osc_inclusive_cases?.student_name ||
                    'Desconhecido'
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{studentName}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            p.plan_type === 'PEI'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-blue-50 text-blue-700'
                          }
                        >
                          {p.plan_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {p.status === 'Vigente' ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-none">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Vigente
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-none">
                            <AlertCircle className="h-3 w-3 mr-1" /> Em Elaboração
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.responsibles || 'Não atribuído'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Plano (PAEE/PEI)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Estudo de Caso Base *</Label>
              <Select
                value={formData.case_id}
                onValueChange={(v) => setFormData({ ...formData, case_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Estudo de Caso do estudante" />
                </SelectTrigger>
                <SelectContent>
                  {cases.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.osc_inclusive_students?.name || c.student_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Plano</Label>
              <Select
                value={formData.plan_type}
                onValueChange={(v) => setFormData({ ...formData, plan_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAEE">
                    Plano de Atendimento Educacional Especializado (PAEE)
                  </SelectItem>
                  <SelectItem value="PEI">Plano Educacional Individualizado (PEI)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
