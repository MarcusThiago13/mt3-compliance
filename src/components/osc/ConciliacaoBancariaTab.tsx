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
  DialogDescription,
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
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Search,
} from 'lucide-react'

const CATEGORIAS_LICITACON = [
  { code: '1.1', title: 'Vencimentos e vantagens' },
  { code: '1.2', title: 'Obrigações Patronais' },
  { code: '2.1', title: 'Material de Consumo' },
  { code: '3.3', title: 'Serviços de Terceiros - PJ' },
  { code: '3.4', title: 'Serviços de Terceiros - PF' },
  { code: '4.6', title: 'Serviços Bancários' },
]

export default function ConciliacaoBancariaTab({ partnership }: any) {
  const [lines, setLines] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isImporting, setIsImporting] = useState(false)

  const [classifyModalOpen, setClassifyModalOpen] = useState(false)
  const [selectedLine, setSelectedLine] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Classification Form
  const [classification, setClassification] = useState('')
  const [providerName, setProviderName] = useState('')
  const [providerDoc, setProviderDoc] = useState('')
  const [invoiceNum, setInvoiceNum] = useState('')
  const [categoryCode, setCategoryCode] = useState('')
  const [restitutionLineId, setRestitutionLineId] = useState('')

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
    if (accounts.length === 0) {
      toast({
        title: 'Atenção',
        description: 'Cadastre uma conta bancária primeiro.',
        variant: 'destructive',
      })
      return
    }
    const accountId = accounts[0].id

    const mockLines = [
      {
        partnership_id: partnership.id,
        account_id: accountId,
        transaction_date: '2026-01-05',
        description: 'TED REPASSE DO ENTE PÚBLICO',
        amount: 50000,
        transaction_type: 'credit',
        competence_month: '2026-01',
      },
      {
        partnership_id: partnership.id,
        account_id: accountId,
        transaction_date: '2026-01-10',
        description: 'TARIFA MANUTENCAO CONTA',
        amount: 45.5,
        transaction_type: 'debit',
        competence_month: '2026-01',
      },
      {
        partnership_id: partnership.id,
        account_id: accountId,
        transaction_date: '2026-01-12',
        description: 'PGTO FORNECEDOR MAT. CONSUMO',
        amount: 1500,
        transaction_type: 'debit',
        competence_month: '2026-01',
      },
      {
        partnership_id: partnership.id,
        account_id: accountId,
        transaction_date: '2026-01-20',
        description: 'TED MESMA TITULARIDADE (MATRIZ)',
        amount: 45.5,
        transaction_type: 'credit',
        competence_month: '2026-01',
      },
    ]

    setIsImporting(true)
    const { error } = await supabase.from('osc_bank_statement_lines' as any).insert(mockLines)
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Extrato importado com sucesso (Modo Simulação).' })
      fetchData()
    }
    setIsImporting(false)
  }

  const openClassifyModal = (line: any) => {
    setSelectedLine(line)
    setClassification(line.classification || '')
    setProviderName(line.provider_name || '')
    setProviderDoc(line.provider_document || '')
    setInvoiceNum(line.invoice_number || '')
    setCategoryCode(line.category_code || '')
    setRestitutionLineId(line.restitution_line_id || '')
    setClassifyModalOpen(true)
  }

  const handleSaveClassification = async () => {
    setIsSaving(true)
    let newStatus = 'Conciliada'
    let restStatus = null

    if (classification === 'Tarifa / Juros (Não Elegível)') {
      newStatus = 'Aguardando Restituição'
    }

    const updates: any = {
      classification,
      status: newStatus,
      updated_at: new Date().toISOString(),
    }

    if (classification === 'Despesa Elegível') {
      updates.provider_name = providerName
      updates.provider_document = providerDoc.replace(/\D/g, '')
      updates.invoice_number = invoiceNum
      updates.category_code = categoryCode
    }

    if (classification === 'Restituição da Matriz' && restitutionLineId) {
      updates.restitution_line_id = restitutionLineId
    }

    const { error } = await supabase
      .from('osc_bank_statement_lines' as any)
      .update(updates)
      .eq('id', selectedLine.id)

    if (!error && classification === 'Restituição da Matriz' && restitutionLineId) {
      await supabase
        .from('osc_bank_statement_lines' as any)
        .update({
          status: 'Conciliada',
          restitution_status: 'Saneada',
          updated_at: new Date().toISOString(),
        })
        .eq('id', restitutionLineId)
    }

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Movimentação classificada e conciliada.' })
      setClassifyModalOpen(false)
      fetchData()
    }
    setIsSaving(false)
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const getStatusBadge = (status: string, classification: string) => {
    if (status === 'Importada')
      return (
        <Badge variant="secondary" className="bg-slate-200 text-slate-700">
          Pendente de Classificação
        </Badge>
      )
    if (status === 'Aguardando Restituição')
      return (
        <Badge variant="destructive" className="border-none">
          Não Elegível (Aguard. Restituição)
        </Badge>
      )
    if (status === 'Conciliada')
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-none">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Conciliada ({classification})
        </Badge>
      )
    return <Badge>{status}</Badge>
  }

  const pendingRestitutions = lines.filter(
    (l) =>
      l.status === 'Aguardando Restituição' || l.classification === 'Tarifa / Juros (Não Elegível)',
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-purple-50 p-5 rounded-xl border border-purple-100 shadow-sm">
        <div>
          <h3 className="font-bold text-purple-900 flex items-center text-lg">
            <FileSpreadsheet className="h-6 w-6 mr-2 text-purple-700" />
            Conciliação Extrato-Cêntrica (Bloco 4)
          </h3>
          <p className="text-sm text-purple-800 mt-1 max-w-2xl">
            A prestação financeira baseia-se integralmente no extrato. Toda linha bancária importada
            deve receber um tratamento e vinculação documental para gerar os demonstrativos finais.
          </p>
        </div>
        <Button
          onClick={handleSimulateImport}
          disabled={isImporting}
          className="bg-purple-700 hover:bg-purple-800 shadow-md shrink-0"
        >
          {isImporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4 mr-2" />
          )}
          Importar Extrato (Simulação Jan/2026)
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          ) : lines.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground bg-slate-50/50 rounded-b-lg">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-slate-700">Nenhum extrato importado</h3>
              <p className="text-sm mt-1">
                Realize a importação do extrato bancário para iniciar a conciliação linha a linha.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-100/80">
                  <TableRow>
                    <TableHead className="whitespace-nowrap w-24">Data</TableHead>
                    <TableHead>Histórico Bancário</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Saída (R$)</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Entrada (R$)</TableHead>
                    <TableHead className="min-w-[250px]">Status da Conciliação</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line) => (
                    <TableRow key={line.id} className="text-sm hover:bg-slate-50">
                      <TableCell className="font-mono text-xs">
                        {new Date(line.transaction_date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium text-slate-800">
                        {line.description}
                      </TableCell>
                      <TableCell className="text-right text-red-600 font-mono">
                        {line.transaction_type === 'debit' ? formatCurrency(line.amount) : '-'}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600 font-mono">
                        {line.transaction_type === 'credit' ? formatCurrency(line.amount) : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(line.status, line.classification)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openClassifyModal(line)}
                          className="h-8"
                        >
                          {line.status === 'Importada' ? 'Classificar' : 'Editar'}
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Classificar Movimentação Bancária</DialogTitle>
            <DialogDescription className="font-mono mt-2 bg-slate-100 p-2 rounded text-slate-800">
              {selectedLine &&
                `${new Date(selectedLine.transaction_date).toLocaleDateString('pt-BR')} - ${selectedLine.description} - ${formatCurrency(selectedLine.amount)} (${selectedLine.transaction_type === 'credit' ? 'Entrada' : 'Saída'})`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Natureza da Movimentação *</Label>
              <Select value={classification} onValueChange={setClassification}>
                <SelectTrigger className="border-purple-200 bg-purple-50/50">
                  <SelectValue placeholder="Selecione o tipo de operação..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedLine?.transaction_type === 'debit' ? (
                    <>
                      <SelectItem value="Despesa Elegível">
                        Despesa Elegível (Possui Documento)
                      </SelectItem>
                      <SelectItem value="Tarifa / Juros (Não Elegível)">
                        Tarifa, Juros ou Multa (Não Elegível - Exige Restituição)
                      </SelectItem>
                      <SelectItem value="Devolução ao Ente Público">
                        Devolução de Saldo ao Ente Público
                      </SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Repasse do Ente Público">
                        Repasse / Parcela do Ente Público
                      </SelectItem>
                      <SelectItem value="Rendimento de Aplicação">
                        Rendimento de Aplicação Financeira
                      </SelectItem>
                      <SelectItem value="Restituição da Matriz">
                        Restituição da Matriz (Recomposição de Tarifa/Glosa)
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {classification === 'Despesa Elegível' && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 pt-2 border-t">
                <div className="space-y-2">
                  <Label>Categoria da Despesa *</Label>
                  <Select value={categoryCode} onValueChange={setCategoryCode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS_LICITACON.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code} - {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>CNPJ/CPF Fornecedor</Label>
                  <Input value={providerDoc} onChange={(e) => setProviderDoc(e.target.value)} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Nome do Fornecedor / Favorecido</Label>
                  <Input value={providerName} onChange={(e) => setProviderName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Número do Documento (NF/Recibo)</Label>
                  <Input value={invoiceNum} onChange={(e) => setInvoiceNum(e.target.value)} />
                </div>
              </div>
            )}

            {classification === 'Restituição da Matriz' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 pt-2 border-t">
                <Label className="text-amber-700 font-semibold flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Vincular à Saída Indevida (Saneamento)
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Selecione a tarifa ou despesa glosada que esta transferência está recompondo.
                </p>
                <Select value={restitutionLineId} onValueChange={setRestitutionLineId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a pendência..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingRestitutions.length === 0 && (
                      <SelectItem value="none" disabled>
                        Nenhuma pendência encontrada
                      </SelectItem>
                    )}
                    {pendingRestitutions.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {new Date(r.transaction_date).toLocaleDateString('pt-BR')} - {r.description}{' '}
                        ({formatCurrency(r.amount)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {classification === 'Tarifa / Juros (Não Elegível)' && (
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200 mt-4 animate-in fade-in">
                <p className="text-sm text-amber-800 font-medium flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Atenção: Obrigação de Restituição
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Ao classificar como não elegível, o sistema gerará uma pendência de recomposição.
                  A OSC deverá transferir o valor exato da conta Matriz para esta conta específica.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setClassifyModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveClassification}
              disabled={isSaving || !classification}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Conciliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
