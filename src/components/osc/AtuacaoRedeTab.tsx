import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Network,
  Plus,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  FileText,
} from 'lucide-react'
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
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export default function AtuacaoRedeTab({ partnership }: any) {
  const [network, setNetwork] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    organization_name: '',
    cnpj: '',
    instrument_type: 'Termo de Atuação em Rede',
    responsibilities: '',
    status: 'Regular',
  })

  const fetchNetwork = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('osc_partnership_network' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
    if (data) setNetwork(data)
    setLoading(false)
  }

  useEffect(() => {
    // In a real environment, query table
    setLoading(false)
  }, [partnership.id])

  const handleSave = () => {
    if (!formData.organization_name || !formData.cnpj) {
      toast({
        title: 'Atenção',
        description: 'Nome e CNPJ são obrigatórios.',
        variant: 'destructive',
      })
      return
    }
    setSaving(true)
    setTimeout(() => {
      setNetwork([...network, { id: Date.now().toString(), ...formData }])
      setSaving(false)
      setIsModalOpen(false)
      setFormData({
        organization_name: '',
        cnpj: '',
        instrument_type: 'Termo de Atuação em Rede',
        responsibilities: '',
        status: 'Regular',
      })
      toast({ title: 'Sucesso', description: 'Entidade vinculada à rede de execução da parceria.' })
    }, 800)
  }

  const hasNetwork = network.length > 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-purple-50/50 p-4 rounded-lg border border-purple-100">
        <div>
          <h3 className="font-semibold text-purple-900 flex items-center">
            <Network className="h-5 w-5 mr-2 text-purple-600" />
            Atuação em Rede (Bloco 7)
          </h3>
          <p className="text-sm text-purple-800 mt-1 max-w-2xl">
            Registro de outras organizações que atuam na execução do objeto. A responsabilidade
            final perante o ente público permanece exclusivamente com a OSC celebrante.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 shrink-0 shadow-sm text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Vincular Organização Executante
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Organizações da Rede Vinculada</CardTitle>
            <CardDescription>
              Relação de entidades com instrumento específico firmado com a celebrante.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-700" />
              </div>
            ) : network.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50 m-4 sm:m-0">
                <Network className="h-10 w-10 mb-3 opacity-20 text-purple-600" />
                <p className="font-medium text-slate-700">
                  Atuação em rede não aplicável ou não configurada.
                </p>
                <p className="text-sm mt-1 max-w-md">
                  Se a parceria for executada inteiramente pela sua OSC, não é necessário adicionar
                  nada aqui. Para habilitar as exigências de rede, vincule a primeira entidade.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Organização Executante</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Instrumento Próprio</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {network.map((net) => (
                      <TableRow key={net.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium text-sm text-slate-800">
                          {net.organization_name}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {net.cnpj}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {net.instrument_type}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none shadow-none text-[10px]">
                            {net.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className={`shadow-sm border-slate-200 h-fit ${hasNetwork ? 'bg-white' : 'bg-slate-50/50'}`}
        >
          <CardHeader>
            <CardTitle className="text-lg">Requisitos de Conformidade (Rede)</CardTitle>
            <CardDescription>
              Obrigações da celebrante perante as executantes vinculadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-md border bg-slate-50/50">
                <CheckCircle2
                  className={`h-5 w-5 mt-0.5 shrink-0 ${hasNetwork ? 'text-emerald-500' : 'text-slate-300'}`}
                />
                <div className="text-sm">
                  <span
                    className={`font-semibold block ${hasNetwork ? 'text-slate-800' : 'text-slate-400'}`}
                  >
                    Celebração de Termo Próprio
                  </span>
                  <span className={`text-xs ${hasNetwork ? 'text-slate-600' : 'text-slate-400'}`}>
                    É obrigatório firmar termo de atuação em rede com cada executante.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-md border bg-slate-50/50">
                <AlertTriangle
                  className={`h-5 w-5 mt-0.5 shrink-0 ${hasNetwork ? 'text-amber-500' : 'text-slate-300'}`}
                />
                <div className="text-sm">
                  <span
                    className={`font-semibold block ${hasNetwork ? 'text-slate-800' : 'text-slate-400'}`}
                  >
                    Documentação Fiscal Unificada
                  </span>
                  <span className={`text-xs ${hasNetwork ? 'text-slate-600' : 'text-slate-400'}`}>
                    As notas fiscais da executante devem ser integradas à{' '}
                    <strong>Prestação de Contas</strong> geral.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-md border bg-slate-50/50">
                <ShieldAlert
                  className={`h-5 w-5 mt-0.5 shrink-0 ${hasNetwork ? 'text-blue-500' : 'text-slate-300'}`}
                />
                <div className="text-sm">
                  <span
                    className={`font-semibold block ${hasNetwork ? 'text-slate-800' : 'text-slate-400'}`}
                  >
                    Verificação de Impedimentos
                  </span>
                  <span className={`text-xs ${hasNetwork ? 'text-slate-600' : 'text-slate-400'}`}>
                    Garantir que a executante não consta no CEIS/CNEP antes do repasse.
                  </span>
                </div>
              </div>
            </div>
            {hasNetwork && (
              <Button variant="outline" className="w-full text-xs mt-2 border-dashed">
                <FileText className="h-4 w-4 mr-2" /> Anexar Comprovantes da Rede
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Organização à Rede</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Organização Executante *</Label>
              <Input
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                placeholder="Ex: Associação de Apoio Comunitário"
              />
            </div>
            <div className="space-y-2">
              <Label>CNPJ *</Label>
              <Input
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="space-y-2">
              <Label>Responsabilidades Pactuadas</Label>
              <Input
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Ex: Execução de oficinas na unidade rural"
              />
            </div>
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mt-4">
              <p className="text-sm font-semibold text-amber-900 flex items-center mb-1">
                <AlertTriangle className="h-4 w-4 mr-2" /> Responsabilidade Solidária
              </p>
              <p className="text-xs text-amber-800">
                A OSC celebrante (sua organização) permanece como única responsável perante a
                Administração Pública por atos, omissões e prestação de contas dos recursos operados
                por esta organização vinculada.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Registrar Vínculo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
