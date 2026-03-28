import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Plus, School, Users, ShieldAlert, Fingerprint } from 'lucide-react'

export function UnidadesEstudantesTab({ tenantId }: { tenantId: string }) {
  const [schools, setSchools] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('escolas')

  const [schoolModalOpen, setSchoolModalOpen] = useState(false)
  const [studentModalOpen, setStudentModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [schoolForm, setSchoolForm] = useState({
    name: '',
    city: '',
    school_type: 'Pública',
    status: 'Ativa',
  })
  const [studentForm, setStudentForm] = useState({
    name: '',
    school_id: '',
    class_grade: '',
    legal_guardians: '',
    status: 'Ativo',
  })

  const fetchData = async () => {
    setLoading(true)
    const [scRes, stRes] = await Promise.all([
      supabase.from('osc_inclusive_schools').select('*').eq('tenant_id', tenantId).order('name'),
      supabase
        .from('osc_inclusive_students')
        .select('*, osc_inclusive_schools(name)')
        .eq('tenant_id', tenantId)
        .order('name'),
    ])
    if (scRes.data) setSchools(scRes.data)
    if (stRes.data) setStudents(stRes.data)
    setLoading(false)
  }

  useEffect(() => {
    if (tenantId) fetchData()
  }, [tenantId])

  const saveSchool = async () => {
    if (!schoolForm.name)
      return toast({ title: 'Atenção', description: 'Nome obrigatório.', variant: 'destructive' })
    setSaving(true)
    const { error } = await supabase
      .from('osc_inclusive_schools')
      .insert({ tenant_id: tenantId, ...schoolForm })
    if (!error) {
      toast({ title: 'Sucesso', description: 'Unidade registrada.' })
      setSchoolModalOpen(false)
      setSchoolForm({ name: '', city: '', school_type: 'Pública', status: 'Ativa' })
      fetchData()
    } else {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
    setSaving(false)
  }

  const saveStudent = async () => {
    if (!studentForm.name || !studentForm.school_id)
      return toast({
        title: 'Atenção',
        description: 'Nome e Unidade são obrigatórios.',
        variant: 'destructive',
      })
    setSaving(true)
    const { error } = await supabase
      .from('osc_inclusive_students')
      .insert({ tenant_id: tenantId, ...studentForm })
    if (!error) {
      toast({ title: 'Sucesso', description: 'Estudante registrado.' })
      setStudentModalOpen(false)
      setStudentForm({
        name: '',
        school_id: '',
        class_grade: '',
        legal_guardians: '',
        status: 'Ativo',
      })
      fetchData()
    } else {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="bg-slate-100 p-1 h-auto">
            <TabsTrigger
              value="escolas"
              className="py-2 px-4 data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm"
            >
              <School className="w-4 h-4 mr-2" /> Unidades Escolares
            </TabsTrigger>
            <TabsTrigger
              value="estudantes"
              className="py-2 px-4 data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm"
            >
              <Users className="w-4 h-4 mr-2" /> Estudantes
            </TabsTrigger>
          </TabsList>

          {activeTab === 'escolas' ? (
            <Button
              onClick={() => setSchoolModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" /> Nova Unidade
            </Button>
          ) : (
            <Button
              onClick={() => setStudentModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" /> Novo Estudante
            </Button>
          )}
        </div>

        <TabsContent value="escolas" className="mt-0">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : schools.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-slate-50/50 rounded-lg">
                  <School className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma unidade escolar registrada.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-100">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-700">
                        Nome da Unidade
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">Município</TableHead>
                      <TableHead className="font-semibold text-slate-700">Tipo</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-medium text-slate-800">{s.name}</TableCell>
                        <TableCell className="text-slate-600">{s.city || '-'}</TableCell>
                        <TableCell className="text-slate-600">{s.school_type}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200"
                          >
                            {s.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estudantes" className="mt-0 space-y-4">
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start gap-3">
            <Fingerprint className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900">
                Atenção à Privacidade e Proteção de Dados (LGPD)
              </h4>
              <p className="text-xs text-amber-800 mt-1">
                Os dados listados abaixo pertencem a crianças e adolescentes e podem conter
                informações de saúde sensíveis. O sistema monitora todos os acessos em conformidade
                com as exigências legais de proteção de dados.
              </p>
            </div>
          </div>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-slate-50/50 rounded-lg">
                  <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Nenhum estudante registrado.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-100">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-700">
                        Nome do Estudante
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Unidade / Escola
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">Série / Turma</TableHead>
                      <TableHead className="font-semibold text-slate-700">Responsáveis</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-medium text-slate-800">{s.name}</TableCell>
                        <TableCell className="text-slate-600">
                          {s.osc_inclusive_schools?.name || '-'}
                        </TableCell>
                        <TableCell className="text-slate-600">{s.class_grade || '-'}</TableCell>
                        <TableCell className="text-slate-600">{s.legal_guardians || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {s.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={schoolModalOpen} onOpenChange={setSchoolModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Unidade Escolar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Unidade *</Label>
              <Input
                value={schoolForm.name}
                onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                placeholder="Ex: E.M. Machado de Assis"
              />
            </div>
            <div className="space-y-2">
              <Label>Município</Label>
              <Input
                value={schoolForm.city}
                onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                placeholder="Cidade da unidade"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Unidade</Label>
              <Select
                value={schoolForm.school_type}
                onValueChange={(v) => setSchoolForm({ ...schoolForm, school_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pública">Pública</SelectItem>
                  <SelectItem value="Privada">Privada</SelectItem>
                  <SelectItem value="OSC Parceira">OSC Parceira</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSchoolModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveSchool} disabled={saving} className="bg-blue-600">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar Unidade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Estudante</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Nome Completo *
                <ShieldAlert className="w-3 h-3 text-amber-500" title="Dado Pessoal Sensível" />
              </Label>
              <Input
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                placeholder="Nome do estudante"
              />
            </div>
            <div className="space-y-2">
              <Label>Unidade Escolar *</Label>
              <Select
                value={studentForm.school_id}
                onValueChange={(v) => setStudentForm({ ...studentForm, school_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Série / Turma</Label>
                <Input
                  value={studentForm.class_grade}
                  onChange={(e) => setStudentForm({ ...studentForm, class_grade: e.target.value })}
                  placeholder="Ex: 5º Ano B"
                />
              </div>
              <div className="space-y-2">
                <Label>Responsáveis</Label>
                <Input
                  value={studentForm.legal_guardians}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, legal_guardians: e.target.value })
                  }
                  placeholder="Nome dos responsáveis"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStudentModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveStudent} disabled={saving} className="bg-blue-600">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar Estudante
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
