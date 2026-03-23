import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Plus, Landmark, Building } from 'lucide-react'

export default function ContasBancariasTab({ partnership }: any) {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    account_type: 'Específica da Parceria',
    bank: '',
    agency: '',
    account_number: '',
  })

  const fetchAccounts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('osc_bank_accounts' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .order('created_at', { ascending: true })

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else setAccounts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchAccounts()
  }, [partnership.id])

  const handleSave = async () => {
    if (!formData.name || !formData.bank || !formData.account_number) {
      return toast({
        title: 'Atenção',
        description: 'Preencha os campos obrigatórios.',
        variant: 'destructive',
      })
    }
    setIsSaving(true)
    const { error } = await supabase.from('osc_bank_accounts' as any).insert({
      partnership_id: partnership.id,
      ...formData,
    })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Conta bancária registrada com sucesso.' })
      setIsModalOpen(false)
      fetchAccounts()
      setFormData({
        name: '',
        account_type: 'Específica da Parceria',
        bank: '',
        agency: '',
        account_number: '',
      })
    }
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-lg border border-dashed">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Landmark className="h-5 w-5 mr-2 text-blue-600" />
            Gestão Financeira e Contas Bancárias (Bloco 4)
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre a conta específica (fonte primária da prestação) e a conta matriz (para
            restituições).
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Conta
        </Button>
      </div>

      <Card className="shadow-sm border-blue-100">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Nenhuma conta bancária cadastrada.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Nome da Conta</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Banco</TableHead>
                  <TableHead>Agência / Conta</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((acc) => (
                  <TableRow key={acc.id} className="text-sm">
                    <TableCell className="font-medium text-slate-900">{acc.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          acc.account_type === 'Específica da Parceria'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100'
                        }
                      >
                        {acc.account_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{acc.bank}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {acc.agency} / {acc.account_number}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-200">
                        {acc.status}
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
            <DialogTitle>Vincular Nova Conta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Conta *</Label>
              <Select
                value={formData.account_type}
                onValueChange={(v) => setFormData({ ...formData, account_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Específica da Parceria">
                    Específica da Parceria (Base da Prestação)
                  </SelectItem>
                  <SelectItem value="Matriz / Recursos Próprios">
                    Matriz / Recursos Próprios (Para Restituições)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Identificação Interna (Nome) *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Conta Principal Convênio Educação"
              />
            </div>
            <div className="space-y-2">
              <Label>Instituição Financeira (Banco) *</Label>
              <Input
                value={formData.bank}
                onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                placeholder="Ex: Banco do Brasil"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Agência</Label>
                <Input
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Número da Conta *</Label>
                <Input
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
