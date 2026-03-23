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
import { toast } from '@/hooks/use-toast'
import { Loader2, Download, FileSpreadsheet, ShieldCheck, AlertTriangle } from 'lucide-react'

export default function RelatoriosPrestacaoTab({ partnership }: any) {
  const [lines, setLines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('osc_bank_statement_lines' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .order('transaction_date', { ascending: true })

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else setLines(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [partnership.id])

  const exportCSV = () => {
    const headers = [
      'Data do Pagamento',
      'Categoria de Despesa',
      'CNPJ/CPF do Fornecedor / Prestador',
      'Nome do Fornecedor / Prestador',
      'Número do Documento / NF',
      'Valor Pago',
      'Status da Conciliação',
    ]

    const eligibleLines = lines.filter((l) => l.classification === 'Despesa Elegível')

    const rows = eligibleLines.map((t) => [
      new Date(t.transaction_date).toLocaleDateString('pt-BR'),
      t.category_code || '',
      t.provider_document || '',
      t.provider_name || '',
      t.invoice_number || '',
      t.amount.toFixed(2).replace('.', ','),
      t.status,
    ])

    const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=windows-1252;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Demonstrativo_Integral_Despesas.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const totalEligible = lines
    .filter((l) => l.classification === 'Despesa Elegível')
    .reduce((acc, curr) => acc + Number(curr.amount), 0)
  const totalIncomes = lines
    .filter(
      (l) =>
        l.classification === 'Repasse do Ente Público' ||
        l.classification === 'Rendimento de Aplicação',
    )
    .reduce((acc, curr) => acc + Number(curr.amount), 0)
  const pendingRestitutions = lines
    .filter((l) => l.status === 'Aguardando Restituição')
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-blue-100 shadow-sm bg-blue-50/30">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-1">
              Total Recebido (Repasses/Rendimentos)
            </p>
            <h3 className="text-2xl font-bold text-blue-900">{formatCurrency(totalIncomes)}</h3>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-sm bg-emerald-50/30">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Despesas Elegíveis Consolidadas
            </p>
            <h3 className="text-2xl font-bold text-emerald-900">{formatCurrency(totalEligible)}</h3>
          </CardContent>
        </Card>
        <Card
          className={
            pendingRestitutions > 0
              ? 'border-red-200 shadow-sm bg-red-50/50'
              : 'border-slate-200 shadow-sm bg-slate-50'
          }
        >
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p
                className={`text-sm font-semibold uppercase tracking-wider mb-1 ${pendingRestitutions > 0 ? 'text-red-800' : 'text-slate-600'}`}
              >
                Pendente de Restituição
              </p>
              <h3
                className={`text-2xl font-bold ${pendingRestitutions > 0 ? 'text-red-900' : 'text-slate-800'}`}
              >
                {formatCurrency(pendingRestitutions)}
              </h3>
            </div>
            {pendingRestitutions > 0 ? (
              <AlertTriangle className="h-8 w-8 text-red-400 opacity-50" />
            ) : (
              <ShieldCheck className="h-8 w-8 text-emerald-400 opacity-50" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-lg flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2 text-slate-600" />
              Demonstrativo Integral de Despesas (DID)
            </CardTitle>
            <CardDescription>
              Gerado automaticamente a partir das movimentações bancárias conciliadas e documentadas.
            </CardDescription>
          </div>
          <Button
            onClick={exportCSV}
            disabled={totalEligible === 0}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-2" /> Exportar Planilha
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 border-t">
                  <TableRow>
                    <TableHead>Data Pgto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Fornecedor / Doc</TableHead>
                    <TableHead>Documento / NF</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines
                    .filter((l) => l.classification === 'Despesa Elegível')
                    .map((t) => (
                      <TableRow key={t.id} className="text-sm">
                        <TableCell>
                          {new Date(t.transaction_date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono bg-slate-50">
                            {t.category_code}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {t.provider_name} <br/> <span className="text-xs text-muted-foreground font-mono">{t.provider_document}</span>
                        </TableCell>
                        <TableCell>{t.invoice_number}</TableCell>
                        <TableCell className="text-right font-semibold text-slate-700">
                          {formatCurrency(t.amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" title="Conciliada" />
                        </TableCell>
                      </TableRow>
                    ))}
                  {totalEligible === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhuma despesa elegível conciliada até o momento.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
