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
import { ShieldAlert, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function SegurancaIncidentesTab({ tenantId }: { tenantId?: string }) {
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchIncidents = async () => {
    if (!tenantId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('digital_incidents')
      .select('*')
      .eq('tenant_id', tenantId)
      .ilike('title', '%Sentinel%')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setIncidents(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchIncidents()
  }, [tenantId])

  const simulateTest = async () => {
    if (!tenantId) return
    toast({
      title: 'Simulação Iniciada',
      description: 'Injetando logs de acesso não autorizado para acionar o Sentinel...',
    })

    // This insert will be caught by the Postgres Trigger (trg_check_suspicious_audit_log)
    await supabase.from('audit_logs' as any).insert({
      tenant_id: tenantId,
      clause_id: 'prontuario_estudante_sensivel',
      action: 'Tentativa de acesso não autorizado a dados clínicos',
      user_email: 'ip-externo-suspeito',
    })

    // Wait for trigger to fire and then refresh
    setTimeout(fetchIncidents, 1500)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('digital_incidents').update({ status }).eq('id', id)
    toast({ title: 'Status Atualizado', description: `Incidente marcado como ${status}.` })
    fetchIncidents()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-red-100 shadow-sm">
        <CardHeader className="bg-red-50/50 border-b border-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <ShieldAlert className="h-5 w-5" /> Sentinel: Central de Segurança e Incidentes
            </CardTitle>
            <CardDescription className="text-red-600/80 mt-1">
              Monitoramento contínuo de acessos e detecção automática de anomalias em dados
              sensíveis.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-100 w-full sm:w-auto"
            onClick={simulateTest}
          >
            <Activity className="h-4 w-4 mr-2" /> Simular Invasão
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center p-4 text-slate-500">Buscando alertas do Sentinel...</div>
          ) : incidents.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed rounded-lg border-red-100 bg-slate-50 flex flex-col items-center">
              <ShieldAlert className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-slate-600 font-medium">Nenhum incidente de segurança detectado.</p>
              <p className="text-slate-400 text-sm mt-1">
                A fortaleza digital está operando normalmente e nenhum comportamento atípico foi
                registrado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alerta do Sentinel</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Recurso/Dados</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((inc) => (
                    <TableRow key={inc.id}>
                      <TableCell className="max-w-xs">
                        <div className="font-medium text-slate-900 truncate" title={inc.title}>
                          {inc.title}
                        </div>
                        <div
                          className="text-xs text-slate-500 mt-1 line-clamp-2"
                          title={inc.description}
                        >
                          {inc.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm whitespace-nowrap">
                        {new Date(inc.created_at).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 text-slate-700">
                          {inc.affected_data || 'Não especificado'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {inc.status === 'Aberto' ? (
                          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                            <AlertTriangle className="h-3 w-3" /> Aberto
                          </Badge>
                        ) : inc.status === 'Mitigado' ? (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 w-fit bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          >
                            <Clock className="h-3 w-3" /> Mitigado
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 w-fit border-green-200 text-green-700 bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3" /> Resolvido
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {inc.status === 'Aberto' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800"
                            onClick={() => updateStatus(inc.id, 'Mitigado')}
                          >
                            Mitigar
                          </Button>
                        )}
                        {inc.status === 'Mitigado' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-200 text-green-700 hover:bg-green-50"
                            onClick={() => updateStatus(inc.id, 'Resolvido')}
                          >
                            Resolver
                          </Button>
                        )}
                        {inc.status === 'Resolvido' && (
                          <span className="text-sm text-green-600 font-medium">Finalizado</span>
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
    </div>
  )
}
