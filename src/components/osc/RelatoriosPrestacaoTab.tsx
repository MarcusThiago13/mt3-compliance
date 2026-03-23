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

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const formatDateUTC = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  const eligibleLines = lines.filter((l) => l.classification === 'Despesa Elegível')
  const totalEligible = eligibleLines.reduce((acc, curr) => acc + Number(curr.amount), 0)
  const totalGross = eligibleLines.reduce(
    (acc, curr) => acc + Number(curr.gross_value || curr.amount),
    0,
  )

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
              Total Entradas na Conta
            </p>
            <h3 className="text-2xl font-bold text-blue-900">{formatCurrency(totalIncomes)}</h3>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-sm bg-emerald-50/30">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Despesas Conciliadas
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
                Pendências Recomposição
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
              <FileSpreadsheet className="h-5 w-5 mr-2 text-slate-600" /> Demonstrativo Integral de
              Despesas (DID)
            </CardTitle>
            <CardDescription>
              Relatório estruturado nos padrões exigidos pela Administração Pública.
            </CardDescription>
          </div>
          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" /> Exportar Planilha Oficial
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="overflow-x-auto border-t">
              <Table className="whitespace-nowrap">
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Data Pagamento</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>CNPJ/CPF</TableHead>
                    <TableHead>Nome Fornecedor</TableHead>
                    <TableHead>Número NF</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead className="text-right">Valor Bruto</TableHead>
                    <TableHead className="text-right bg-slate-100">Valor Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eligibleLines.map((t) => (
                    <TableRow key={t.id} className="text-xs">
                      <TableCell>{formatDateUTC(t.transaction_date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px] bg-white">
                          {t.category_code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono tracking-tighter text-slate-600">
                        {t.provider_document || '-'}
                      </TableCell>
                      <TableCell className="font-medium text-slate-800">
                        {t.provider_name || '-'}
                      </TableCell>
                      <TableCell>{t.invoice_number || '-'}</TableCell>
                      <TableCell>{formatDateUTC(t.invoice_date)}</TableCell>
                      <TableCell className="text-right font-mono text-slate-600">
                        {formatCurrency(t.gross_value || t.amount)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-800 bg-slate-50/50">
                        {formatCurrency(t.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {eligibleLines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nenhuma despesa elegível processada e conciliada no período.
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow className="bg-slate-100 font-bold border-t-2">
                      <TableCell colSpan={6} className="text-right text-slate-700">
                        TOTAIS DO DEMONSTRATIVO:
                      </TableCell>
                      <TableCell className="text-right text-slate-800 font-mono">
                        {formatCurrency(totalGross)}
                      </TableCell>
                      <TableCell className="text-right text-slate-900 font-mono">
                        {formatCurrency(totalEligible)}
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
