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
import { Loader2, Plus, ArrowDownToLine, Landmark } from 'lucide-react'

export default function ReceitasRendimentosTab({ partnership }: any) {
  const [incomes, setIncomes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    income_date: '',
    income_type: 'Repasse/Parcela',
    description: '',
    amount: 0,
  })

  const fetchIncomes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('osc_financial_incomes' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .order('income_date', { ascending: false })

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else setIncomes(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchIncomes()
  }, [partnership.id])

  const handleSave = async () => {
    setIsSaving(true)
    const { error } = await supabase.from('osc_financial_incomes' as any).insert({
      partnership_id: partnership.id,
      ...formData,
    })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Receita registrada com sucesso.' })
      setIsModalOpen(false)
      fetchIncomes()
      setFormData({
        income_date: '',
        income_type: 'Repasse/Parcela',
        description: '',
        amount: 0,
      })
    }
    setIsSaving(false)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  const totalReceitas = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-lg border border-dashed">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Landmark className="h-5 w-5 mr-2 text-emerald-600" />
            Receitas e Conta Específica
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Controle de repasses do ente público, rendimentos de aplicação e aportes próprios.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Total Recebido
            </p>
            <p className="text-lg font-bold text-emerald-700">{formatCurrency(totalReceitas)}</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Nova Receita
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-emerald-100">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : incomes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ArrowDownToLine className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Nenhuma receita ou rendimento registrado na conta específica.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Data do Crédito</TableHead>
                    <TableHead className="whitespace-nowrap">Tipo de Receita</TableHead>
                    <TableHead className="w-full">Descrição / Histórico</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Valor Creditado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomes.map((inc) => (
                    <TableRow key={inc.id} className="text-sm">
                      <TableCell>{new Date(inc.income_date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${inc.income_type === 'Rendimento de Aplicação' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}
                        >
                          {inc.income_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{inc.description}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-700">
                        {formatCurrency(inc.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Receita ou Rendimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data do Crédito *</Label>
                <Input
                  type="date"
                  value={formData.income_date}
                  onChange={(e) => setFormData({ ...formData, income_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Receita *</Label>
              <Select
                value={formData.income_type}
                onValueChange={(v) => setFormData({ ...formData, income_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Repasse/Parcela">Repasse do Ente Público (Parcela)</SelectItem>
                  <SelectItem value="Rendimento de Aplicação">
                    Rendimento de Aplicação Financeira
                  </SelectItem>
                  <SelectItem value="Aporte Próprio">
                    Aporte com Recursos Próprios da OSC
                  </SelectItem>
                  <SelectItem value="Devolução/Estorno">Estorno ou Devolução à Conta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descrição / Histórico</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Parcela 01/12 referente ao Termo de Fomento..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.income_date || !formData.amount}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
