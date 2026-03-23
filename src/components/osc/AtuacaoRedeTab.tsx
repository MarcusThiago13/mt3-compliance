import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Network, Plus, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
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
    // In a real environment, the table would exist. We are mocking the persistence for the requested UI improvement.
    // fetchNetwork()
    setLoading(false)
  }, [partnership.id])

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setNetwork([...network, { id: Date.now().toString(), ...formData }])
      setSaving(false)
      setIsModalOpen(false)
      setFormData({ organization_name: '', cnpj: '', instrument_type: 'Termo de Atuação em Rede', responsibilities: '', status: 'Regular' })
      toast({ title: 'Sucesso', description: 'Entidade vinculada à rede da parceria.' })
    }, 800)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-purple-50/50 p-4 rounded-lg border border-purple-100">
        <div>
          <h3 className="font-semibold text-purple-900 flex items-center">
            <Network className="h-5 w-5 mr-2 text-purple-600" />
            Atuação em Rede (Bloco 7)
          </h3>
          <p className="text-sm text-purple-800 mt-1 max-w-2xl">
            Se a OSC executa o projeto com o apoio de outras organizações, registre-as aqui. A OSC celebrante mantém a responsabilidade final, devendo reter e conferir a documentação comprobatória da rede.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 shrink-0">
          <Plus className="h-4 w-4 mr-2" /> Adicionar Organização Executante
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Organizações Parceiras Vinculadas</CardTitle>
            <CardDescription>Relação de entidades que possuem instrumentos específicos com a OSC celebrante.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-purple-700" /></div>
            ) : network.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50 m-4 sm:m-0">
                <ShieldAlert className="h-10 w-10 mb-3 opacity-20 text-purple-600" />
                <p className="font-medium text-slate-700">Atuação em Rede Não Configurada</p>
                <p className="text-sm mt-1 max-w-md">
                  A parceria atual está sendo executada exclusivamente por esta OSC. Para habilitar as exigências de rede, adicione a primeira entidade executante.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                      <TableRow key={net.id}>
                        <TableCell className="font-medium text-sm">{net.organization_name}</TableCell>
                        <TableCell className="font-mono text-xs">{net.cnpj}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{net.instrument_type}</TableCell>
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

        <Card className="shadow-sm border-slate-200 h-fit bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Requisitos de Condicionalidade</CardTitle>
            <CardDescription>Obrigações da OSC celebrante perante a rede.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className={`h-4 w-4 mt-0.5 ${network.length > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                <div className="text-sm text-slate-700">
                  <span className="font-semibold block">Celebração de Instrumento Próprio</span>
                  A OSC firmou termo de atuação em rede com a executante.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className={`h-4 w-4 mt-0.5 ${network.length > 0 ? 'text-amber-500' : 'text-slate-300'}`} />
                <div className="text-sm text-slate-700">
                  <span className="font-semibold block">Coleta de Documentação Fiscal</span>
                  As notas fiscais e comprovantes de despesas emitidos pela executante devem ser integrados à prestação de contas (Bloco 6).
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className={`h-4 w-4 mt-0.5 text-slate-300`} />
                <div className="text-sm text-slate-700">
                  <span className="font-semibold block">Verificação de Impedimentos</span>
                  A organização executante não deve constar no CEIS/CNEP.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Organização à Rede</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Organização Executante</Label>
              <Input
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                placeholder="Ex: Associação de Apoio à Criança"
              />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
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
                placeholder="Ex: Execução de oficinas pedagógicas na unidade Sul."
              />
            </div>
            <div className="bg-amber-50 p-3 rounded-md text-xs text-amber-800 border border-amber-200 mt-2">
              <strong>Responsabilidade Solidária:</strong> A OSC celebrante permanece responsável perante a Administração Pública por atos e omissões das organizações da rede.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Vincular Organização
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
