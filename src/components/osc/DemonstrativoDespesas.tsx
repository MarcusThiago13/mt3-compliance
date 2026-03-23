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
import {
  Loader2,
  Plus,
  Receipt,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

const CATEGORIAS_LICITACON = [
  { code: '1', title: 'Pessoal' },
  { code: '1.1', title: 'Vencimentos e vantagens' },
  { code: '1.2', title: 'Obrigações Patronais' },
  { code: '1.99', title: 'Outras despesas com pessoal' },
  { code: '2', title: 'Material de Consumo' },
  { code: '2.1', title: 'Material Farmacológico/Hospitalar' },
  { code: '2.2', title: 'Material de Expediente' },
  { code: '2.3', title: 'Material de Limpeza e Higienização' },
  { code: '2.99', title: 'Outras desp. Material Consumo' },
  { code: '3', title: 'Serviços de Terceiros' },
  { code: '3.1', title: 'Pessoa Física' },
  { code: '3.2', title: 'Pessoa Jurídica' },
]

export default function DemonstrativoDespesas({ partnership }: any) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    payment_date: '',
    category_code: '',
    provider_document: '',
    provider_name: '',
    invoice_number: '',
    invoice_date: '',
    gross_value: 0,
    paid_value: 0,
  })

  const fetchTransactions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('osc_financial_transactions' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .order('payment_date', { ascending: false })

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else setTransactions(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchTransactions()
  }, [partnership.id])

  const handleSave = async () => {
    setIsSaving(true)
    const { error } = await supabase.from('osc_financial_transactions' as any).insert({
      partnership_id: partnership.id,
      ...formData,
      status: 'Pendente',
    })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Despesa registrada com sucesso.' })
      setIsModalOpen(false)
      fetchTransactions()
      setFormData({
        payment_date: '',
        category_code: '',
        provider_document: '',
        provider_name: '',
        invoice_number: '',
        invoice_date: '',
        gross_value: 0,
        paid_value: 0,
      })
    }
    setIsSaving(false)
  }

  const exportCSV = () => {
    const headers = [
      'Data do Pagamento',
      'Categoria de Despesa',
      'CNPJ/CPF do Fornecedor / Prestador',
      'Nome do Fornecedor / Prestador',
      'Número da Nota Fiscal',
      'Data de Emissão da NF',
      'Valor Bruto',
      'Valor Pago',
    ]

    // As per the attached instructions: formats DD/MM/AAAA, no hyphens on CNPJ/CPF,
    // values with comma separator for decimals and no thousand separator.
    const rows = transactions.map((t) => [
      new Date(t.payment_date).toLocaleDateString('pt-BR'),
      t.category_code,
      t.provider_document,
      t.provider_name,
      t.invoice_number,
      new Date(t.invoice_date).toLocaleDateString('pt-BR'),
      t.gross_value.toFixed(2).replace('.', ','),
      t.paid_value.toFixed(2).replace('.', ','),
    ])

    const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=windows-1252;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `Licitacon_Despesas_Parceria_${partnership.id.substring(0, 6)}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  const totalPago = transactions.reduce((acc, curr) => acc + Number(curr.paid_value), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-lg border border-dashed">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-600" />
            Demonstrativo Integral das Despesas
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Registro baseado no extrato da conta bancária. Formato padronizado Licitacon.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block mr-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Total Pago
            </p>
            <p className="text-lg font-bold text-slate-900">{formatCurrency(totalPago)}</p>
          </div>
          <Button
            variant="outline"
            onClick={exportCSV}
            disabled={transactions.length === 0}
            className="bg-white"
          >
            <Download className="h-4 w-4 mr-2" /> CSV (Licitacon)
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" /> Novo Lançamento
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-blue-100">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Nenhuma despesa registrada ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Data Pgto</TableHead>
                    <TableHead className="whitespace-nowrap">Categoria</TableHead>
                    <TableHead className="whitespace-nowrap">CNPJ/CPF</TableHead>
                    <TableHead className="min-w-[200px]">Fornecedor/Prestador</TableHead>
                    <TableHead className="whitespace-nowrap">Num. NF</TableHead>
                    <TableHead className="whitespace-nowrap">Data NF</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Valor Bruto</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Valor Pago</TableHead>
                    <TableHead className="text-center">Nexo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id} className="text-sm">
                      <TableCell>{new Date(t.payment_date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-slate-50">
                          {t.category_code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{t.provider_document}</TableCell>
                      <TableCell className="font-medium">{t.provider_name}</TableCell>
                      <TableCell>{t.invoice_number}</TableCell>
                      <TableCell>{new Date(t.invoice_date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right">{formatCurrency(t.gross_value)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(t.paid_value)}
                      </TableCell>
                      <TableCell className="text-center">
                        {t.status === 'Validado' ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500 mx-auto" />
                        )}
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Novo Lançamento de Despesa</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Data do Pagamento *</Label>
              <Input
                type="date"
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              />
              <p className="text-[10px] text-muted-foreground">
                Data do efetivo desembolso na conta.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Categoria de Despesa *</Label>
              <Select
                value={formData.category_code}
                onValueChange={(v) => setFormData({ ...formData, category_code: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o código" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS_LICITACON.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="font-mono text-muted-foreground mr-2">{c.code}</span>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>CNPJ/CPF do Fornecedor *</Label>
              <Input
                value={formData.provider_document}
                onChange={(e) =>
                  setFormData({ ...formData, provider_document: e.target.value.replace(/\D/g, '') })
                }
                placeholder="Somente números"
              />
            </div>
            <div className="space-y-2">
              <Label>Nome do Fornecedor / Prestador *</Label>
              <Input
                value={formData.provider_name}
                onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Número da Nota Fiscal *</Label>
              <Input
                value={formData.invoice_number}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Emissão da NF *</Label>
              <Input
                type="date"
                value={formData.invoice_date}
                onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor Bruto (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.gross_value || ''}
                onChange={(e) =>
                  setFormData({ ...formData, gross_value: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Valor Efetivamente Pago (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.paid_value || ''}
                onChange={(e) =>
                  setFormData({ ...formData, paid_value: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.payment_date || !formData.category_code}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Despesa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
