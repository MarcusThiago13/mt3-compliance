import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileCheck, Search, Loader2, ArrowRight, Activity, ShieldAlert } from 'lucide-react'
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
import { toast } from '@/hooks/use-toast'

export default function PrestacaoContasList() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [partnerships, setPartnerships] = useState<any[]>([])

  const fetchData = async () => {
    if (!tenantId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('osc_partnerships' as any)
      .select(`
        id,
        title,
        public_entity,
        instrument_type,
        status,
        current_phase,
        osc_partnership_accountability (
          id,
          status,
          deadline,
          report_type
        ),
        osc_accountability_diligences (
          id,
          status
        )
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (data) setPartnerships(data)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [tenantId])

  const getAccountabilityStatusBadge = (acc: any) => {
    if (!acc || acc.length === 0) {
      return (
        <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-200">
          Não Iniciada
        </Badge>
      )
    }
    const status = acc[0].status
    const colors: Record<string, string> = {
      'Em Elaboração': 'bg-amber-100 text-amber-800',
      Enviada: 'bg-blue-100 text-blue-800',
      'Em Diligência': 'bg-orange-100 text-orange-800',
      Aprovada: 'bg-emerald-100 text-emerald-800',
      'Aprovada com Ressalvas': 'bg-lime-100 text-lime-800',
      Rejeitada: 'bg-red-100 text-red-800',
    }
    return (
      <Badge
        className={`${colors[status] || 'bg-slate-100 text-slate-800'} border-none shadow-sm hover:opacity-80`}
      >
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
            <FileCheck className="h-8 w-8" /> Central de Prestação de Contas (MROSC)
          </h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            Módulo financeiro especializado. Processe a conciliação linha a linha a partir do
            extrato da conta específica, associe a execução física (B4), responda diligências e gere
            o Demonstrativo Integral de Despesas (DID).
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-amber-50/50 border-amber-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-amber-600 shadow-sm">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">
                {
                  partnerships.filter(
                    (p) => p.osc_partnership_accountability?.[0]?.status === 'Em Elaboração',
                  ).length
                }
              </p>
              <p className="text-sm font-medium text-amber-700">Prestações em Aberto</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50/50 border-red-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-red-600 shadow-sm">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-900">
                {
                  partnerships.filter((p) =>
                    p.osc_accountability_diligences?.some(
                      (d: any) => d.status === 'Aberta' || d.status === 'Glosa',
                    ),
                  ).length
                }
              </p>
              <p className="text-sm font-medium text-red-700">
                Parcerias com Alertas (Diligência/Glosa)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm">
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-900">
                {
                  partnerships.filter(
                    (p) => p.osc_partnership_accountability?.[0]?.status === 'Aprovada',
                  ).length
                }
              </p>
              <p className="text-sm font-medium text-emerald-700">Contas Aprovadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-amber-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Relação de Prestações de Contas</span>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
          <CardDescription>
            Selecione a parceria para iniciar a conciliação bancária ou analisar ressalvas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
          ) : partnerships.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
              <FileCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Nenhuma parceria cadastrada nesta organização para prestar contas.</p>
              <Button
                variant="link"
                className="text-amber-700 mt-2"
                onClick={() => navigate(`/${tenantId}/osc/parcerias`)}
              >
                Ir para Gestão de Parcerias
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parceria / Objeto</TableHead>
                  <TableHead>Ente Público</TableHead>
                  <TableHead>Status da Parceria</TableHead>
                  <TableHead>Status da Prestação</TableHead>
                  <TableHead>Prazo Legal (Envio)</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerships.map((p) => {
                  const acc = p.osc_partnership_accountability?.[0]
                  const hasAlerts = p.osc_accountability_diligences?.some(
                    (d: any) => d.status === 'Aberta' || d.status === 'Glosa',
                  )

                  return (
                    <TableRow
                      key={p.id}
                      className="hover:bg-amber-50/30 cursor-pointer transition-colors"
                      onClick={() => navigate(`/${tenantId}/osc/prestacao-contas/${p.id}`)}
                    >
                      <TableCell className="font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          {hasAlerts && <ShieldAlert className="h-4 w-4 text-red-500" />}
                          {p.title}
                        </div>
                      </TableCell>
                      <TableCell>{p.public_entity}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-slate-600 bg-slate-50">
                          {p.status || p.current_phase || 'Ativa'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getAccountabilityStatusBadge(p.osc_partnership_accountability)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {acc?.deadline
                          ? new Date(acc.deadline).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
                        >
                          {acc ? 'Acessar Finanças' : 'Iniciar Módulo'}{' '}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
