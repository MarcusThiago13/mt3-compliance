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
import { Loader2, UploadCloud, FileSpreadsheet, ScanLine } from 'lucide-react'
import OcrModal from './OcrModal'

const CATEGORIAS_DESPESA = [
  { code: '1.1', title: '1.1 - Vencimentos e vantagens' },
  { code: '1.2', title: '1.2 - Obrigações Patronais' },
  { code: '1.99', title: '1.99 - Outras despesas com pessoal' },
  { code: '2.1', title: '2.1 - Material Farmacológico/Hospitalar' },
  { code: '2.2', title: '2.2 - Material de Expediente' },
  { code: '2.3', title: '2.3 - Material de Limpeza/Higiene' },
  { code: '2.99', title: '2.99 - Outras despesas de Material' },
  { code: '3.1', title: '3.1 - Serviços de Saúde (PF)' },
  { code: '3.2', title: '3.2 - Apoio Administrativo/Operacional (PF)' },
  { code: '3.3', title: '3.3 - Manutenção de Equipamentos/Bens (PF)' },
  { code: '3.99', title: '3.99 - Outros Serviços Terceiros (PF)' },
  { code: '4.1', title: '4.1 - Serviços Médico/Odonto/Lab (PJ)' },
  { code: '4.2', title: '4.2 - Apoio Administrativo/Operacional (PJ)' },
  { code: '4.3', title: '4.3 - Vigilância e Limpeza' },
  { code: '4.4', title: '4.4 - Locação de Máquinas/Equipamentos' },
  { code: '4.5', title: '4.5 - Manutenção de Equipamentos/Bens (PJ)' },
  { code: '4.6', title: '4.6 - Serviços Bancários' },
  { code: '4.7', title: '4.7 - Locação de Imóveis' },
  { code: '4.99', title: '4.99 - Outros Serviços Terceiros (PJ)' },
  { code: '5', title: '5 - Equipamentos e Material Permanente' },
  { code: '6', title: '6 - Obras e Instalações' },
  { code: '7', title: '7 - Custos Indiretos' },
  { code: '8', title: '8 - Despesas Tributárias' },
]

export default function ConciliacaoBancariaTab({ partnership }: any) {
  const [lines, setLines] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isImporting, setIsImporting] = useState(false)
  const [ocrModalOpen, setOcrModalOpen] = useState(false)

  const [classifyModalOpen, setClassifyModalOpen] = useState(false)
  const [selectedLine, setSelectedLine] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [classification, setClassification] = useState('')
  const [providerName, setProviderName] = useState('')
  const [providerDoc, setProviderDoc] = useState('')
  const [invoiceNum, setInvoiceNum] = useState('')
  const [invoiceDate, setInvoiceDate] = useState('')
  const [categoryCode, setCategoryCode] = useState('')
  const [grossValue, setGrossValue] = useState(0)

  const fetchData = async () => {
    setLoading(true)
    const { data: accs } = await supabase
      .from('osc_bank_accounts' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
    if (accs) setAccounts(accs)

    const { data: ln } = await supabase
      .from('osc_bank_statement_lines' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .order('transaction_date', { ascending: false })
    if (ln) setLines(ln)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [partnership.id])

  const handleSimulateImport = async () => {
    if (accounts.length === 0)
      return toast({
        title: 'Atenção',
        description: 'Cadastre uma conta bancária primeiro.',
        variant: 'destructive',
      })
    const accountId = accounts[0].id
    const mockLines = [
      {
        partnership_id: partnership.id,
        account_id: accountId,
        transaction_date: '2026-01-05',
        description: 'TED REPASSE DO ENTE',
        amount: 50000,
        transaction_type: 'credit',
      },
      {
        partnership_id: partnership.id,
        account_id: accountId,
        transaction_date: '2026-01-10',
        description: 'PGTO TITULO 123456',
        amount: 1500,
        transaction_type: 'debit',
      },
      {
        partnership_id: partnership.id,
        account_id: accountId,
        transaction_date: '2026-01-15',
        description: 'TARIFA BANCARIA',
        amount: 45.5,
        transaction_type: 'debit',
      },
    ]
    setIsImporting(true)
    await supabase.from('osc_bank_statement_lines' as any).insert(mockLines)
    toast({ title: 'Sucesso', description: 'Extrato importado.' })
    fetchData()
    setIsImporting(false)
  }

  const openClassifyModal = (line: any) => {
    setSelectedLine(line)
    setClassification(line.classification || '')
    setProviderName(line.provider_name || '')
    setProviderDoc(line.provider_document || '')
    setInvoiceNum(line.invoice_number || '')
    setInvoiceDate(line.invoice_date || '')
    setCategoryCode(line.category_code || '')
    setGrossValue(line.gross_value || line.amount)
    setClassifyModalOpen(true)
  }

  const handleSaveClassification = async () => {
    setIsSaving(true)
    const newStatus =
      classification === 'Tarifa / Juros (Não Elegível)' ? 'Aguardando Restituição' : 'Conciliada'

    const updates: any = { classification, status: newStatus, updated_at: new Date().toISOString() }

    if (classification === 'Despesa Elegível') {
      updates.provider_name = providerName
      updates.provider_document = providerDoc
      updates.invoice_number = invoiceNum
      updates.invoice_date = invoiceDate
      updates.category_code = categoryCode
      updates.gross_value = grossValue
    }

    const { error } = await supabase
      .from('osc_bank_statement_lines' as any)
      .update(updates)
      .eq('id', selectedLine.id)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Lançamento classificado com sucesso.' })
      setClassifyModalOpen(false)
      fetchData()
    }
    setIsSaving(false)
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-5 rounded-lg border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center text-lg">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-slate-600" /> Motor Extrato-Cêntrico
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            A conciliação deve ser feita linha a linha com base no extrato bancário oficial. Todas
            as saídas devem ter lastro documental e vínculo ao plano de trabalho (B3).
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOcrModalOpen(true)} variant="outline" className="shrink-0">
            <ScanLine className="h-4 w-4 mr-2" /> Leitura OCR (Notas)
          </Button>
          <Button onClick={handleSimulateImport} disabled={isImporting} className="shrink-0">
            {isImporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4 mr-2" />
            )}{' '}
            Importar OFX
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : lines.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Nenhum extrato importado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Histórico do Banco</TableHead>
                    <TableHead className="text-right">Saída</TableHead>
                    <TableHead className="text-right">Entrada</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line) => (
                    <TableRow key={line.id} className="text-sm">
                      <TableCell>
                        {new Date(line.transaction_date).toLocaleDateString('pt-BR', {
                          timeZone: 'UTC',
                        })}
                      </TableCell>
                      <TableCell>{line.description}</TableCell>
                      <TableCell className="text-right text-red-600 font-mono">
                        {line.transaction_type === 'debit' ? formatCurrency(line.amount) : '-'}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600 font-mono">
                        {line.transaction_type === 'credit' ? formatCurrency(line.amount) : '-'}
                      </TableCell>
                      <TableCell>
                        {line.status === 'Importada' ? (
                          <Badge variant="secondary">Pendente de Tratamento</Badge>
                        ) : line.status === 'Aguardando Restituição' ? (
                          <Badge variant="destructive">Requer Devolução</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-800 border-none">
                            Conciliada
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openClassifyModal(line)}>
                          Classificar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={classifyModalOpen} onOpenChange={setClassifyModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Conciliação e Lastro Documental</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-slate-50 border rounded flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">{selectedLine?.description}</span>
              <span className="font-mono text-lg font-bold">
                {selectedLine?.transaction_type === 'debit' ? '-' : '+'}
                {formatCurrency(selectedLine?.amount || 0)}
              </span>
            </div>

            <div className="space-y-2">
              <Label>Natureza da Movimentação *</Label>
              <Select value={classification} onValueChange={setClassification}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a classificação..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedLine?.transaction_type === 'debit' ? (
                    <>
                      <SelectItem value="Despesa Elegível">
                        Despesa Elegível (Possui NF/Recibo)
                      </SelectItem>
                      <SelectItem value="Tarifa / Juros (Não Elegível)">
                        Tarifa / Multa (Não Elegível - Exige Recomposição)
                      </SelectItem>
                      <SelectItem value="Devolução de Saldo">
                        Devolução de Saldo ao Ente Público
                      </SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Repasse do Ente Público">Repasse do Parceiro</SelectItem>
                      <SelectItem value="Rendimento de Aplicação">
                        Rendimento de Aplicação Financeira
                      </SelectItem>
                      <SelectItem value="Recomposição da Matriz">
                        Recomposição da OSC (Devolução de tarifa)
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {classification === 'Despesa Elegível' && (
              <div className="grid gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <Label>Categoria de Despesa (DID)</Label>
                  <Select value={categoryCode} onValueChange={setCategoryCode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria conforme plano..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS_DESPESA.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CNPJ/CPF do Fornecedor</Label>
                    <Input
                      value={providerDoc}
                      onChange={(e) => setProviderDoc(e.target.value.replace(/\D/g, ''))}
                      placeholder="Somente números"
                      maxLength={14}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      11 ou 14 dígitos sem pontuação
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Nome do Fornecedor / Prestador</Label>
                    <Input value={providerName} onChange={(e) => setProviderName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Número da Nota Fiscal</Label>
                    <Input value={invoiceNum} onChange={(e) => setInvoiceNum(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Emissão da NF</Label>
                    <Input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Bruto da NF (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={grossValue}
                      onChange={(e) => setGrossValue(parseFloat(e.target.value))}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Valor total antes de retenções
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Efetivamente Pago (R$)</Label>
                    <Input disabled value={selectedLine?.amount} className="bg-slate-50" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClassifyModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveClassification} disabled={isSaving || !classification}>
              Salvar Conciliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OcrModal
        isOpen={ocrModalOpen}
        onClose={() => setOcrModalOpen(false)}
        lines={lines}
        onSuccess={fetchData}
      />
    </div>
  )
}
