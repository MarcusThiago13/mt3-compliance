import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Handshake, Plus, Loader2, Search, ArrowRight, Layers, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

export default function GestaoParcerias() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [parcerias, setParcerias] = useState<any[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [publicEntity, setPublicEntity] = useState('')
  const [instrument, setInstrument] = useState('Termo de Fomento')
  const [instrumentNumber, setInstrumentNumber] = useState('')

  const fetchData = async () => {
    if (!tenantId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('osc_partnerships' as any)
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (data) setParcerias(data)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [tenantId])

  const handleCreate = async () => {
    if (!title || !publicEntity) {
      return toast({
        title: 'Atenção',
        description: 'Preencha os campos obrigatórios.',
        variant: 'destructive',
      })
    }
    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from('osc_partnerships' as any)
        .insert({
          tenant_id: tenantId,
          title,
          public_entity: publicEntity,
          instrument_type: instrument,
          instrument_number: instrumentNumber,
          status: 'Planejamento',
          current_phase: 'Planejamento',
        })
        .select()
        .single()

      if (error) throw error
      toast({
        title: 'Sucesso',
        description: 'Parceria criada. Redirecionando para o painel da parceria.',
      })
      setIsModalOpen(false)
      navigate(`/${tenantId}/osc/parcerias/${data.id}`)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const s = status || 'Planejamento'
    const colors: Record<string, string> = {
      Planejamento: 'bg-slate-100 text-slate-800',
      Chamamento: 'bg-blue-100 text-blue-800',
      Celebração: 'bg-purple-100 text-purple-800',
      Execução: 'bg-emerald-100 text-emerald-800',
      'Prestação de Contas': 'bg-amber-100 text-amber-800',
      Encerrado: 'bg-gray-100 text-gray-800',
    }
    return (
      <Badge
        className={`${colors[s] || 'bg-slate-100 text-slate-800'} border-none shadow-sm font-medium`}
      >
        {s}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-800 flex items-center gap-3">
            <Handshake className="h-8 w-8" /> Central de Gestão de Parcerias
          </h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            Eixo organizador do ciclo completo das parcerias celebradas com a Administração Pública.
            Consolide habilitação, plano de trabalho, execução, prestação de contas e encerramento
            em um só lugar.
          </p>
        </div>
        <Button
          className="bg-purple-700 hover:bg-purple-800 text-white shadow-sm shrink-0"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Cadastrar Nova Parceria
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-purple-50/50 border-purple-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-purple-600 shadow-sm">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">{parcerias.length}</p>
              <p className="text-sm font-medium text-purple-700">Total de Parcerias</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm">
              <Handshake className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-900">
                {
                  parcerias.filter((p) => p.status === 'Execução' || p.current_phase === 'Execução')
                    .length
                }
              </p>
              <p className="text-sm font-medium text-emerald-700">Em Execução Ativa</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-amber-600 shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">
                {
                  parcerias.filter(
                    (p) =>
                      p.status === 'Prestação de Contas' ||
                      p.current_phase === 'Prestação de Contas',
                  ).length
                }
              </p>
              <p className="text-sm font-medium text-amber-700">Aguardando Avaliação de Contas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-purple-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Relação de Instrumentos Pactuados</span>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Acesse o detalhamento gerencial, operacional e jurídico de cada parceria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-700" />
            </div>
          ) : parcerias.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
              <Handshake className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Nenhuma parceria cadastrada nesta organização.</p>
              <Button
                variant="link"
                className="mt-2 text-purple-700"
                onClick={() => setIsModalOpen(true)}
              >
                Registrar a primeira parceria
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título / Objeto</TableHead>
                  <TableHead>Ente Público</TableHead>
                  <TableHead>Instrumento / Nº</TableHead>
                  <TableHead>Fase Atual</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parcerias.map((p) => (
                  <TableRow
                    key={p.id}
                    className="hover:bg-purple-50/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/${tenantId}/osc/parcerias/${p.id}`)}
                  >
                    <TableCell className="font-semibold text-purple-900">{p.title}</TableCell>
                    <TableCell>{p.public_entity}</TableCell>
                    <TableCell>
                      <div className="text-sm">{p.instrument_type}</div>
                      {p.instrument_number && (
                        <div className="text-xs text-muted-foreground font-mono">
                          {p.instrument_number}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(p.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-700 hover:text-purple-800 hover:bg-purple-100"
                      >
                        Acessar Eixo <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
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
            <DialogTitle>Registro Inicial da Parceria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome de Referência ou Resumo do Objeto *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Projeto Educação Inclusiva em Ação"
              />
            </div>
            <div className="space-y-2">
              <Label>Ente Público Parceiro *</Label>
              <Input
                value={publicEntity}
                onChange={(e) => setPublicEntity(e.target.value)}
                placeholder="Ex: Secretaria Estadual de Educação"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Instrumento</Label>
                <Select value={instrument} onValueChange={setInstrument}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Termo de Fomento">Termo de Fomento</SelectItem>
                    <SelectItem value="Termo de Colaboração">Termo de Colaboração</SelectItem>
                    <SelectItem value="Acordo de Cooperação">Acordo de Cooperação</SelectItem>
                    <SelectItem value="Contrato de Gestão">Contrato de Gestão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nº do Instrumento (Opcional)</Label>
                <Input
                  value={instrumentNumber}
                  onChange={(e) => setInstrumentNumber(e.target.value)}
                  placeholder="Ex: 001/2026"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar e Organizar Eixo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
