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
import { AlertTriangle, Plus, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function IncidentesTab({ tenant }: any) {
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIncidents()
  }, [tenant.id])

  const fetchIncidents = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('digital_incidents')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
    if (data) setIncidents(data)
    setLoading(false)
  }

  return (
    <Card className="animate-in fade-in shadow-sm border-slate-200">
      <CardHeader className="border-b bg-slate-50/50 pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" /> Incidentes de Segurança e Privacidade
          </CardTitle>
          <CardDescription>
            Registro e plano de resposta a incidentes envolvendo dados pessoais.
          </CardDescription>
        </div>
        <Button variant="destructive" size="sm">
          <Plus className="w-4 h-4 mr-2" /> Declarar Incidente
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : incidents.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-slate-50">
            <p>Nenhum incidente de segurança registrado.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título do Incidente</TableHead>
                <TableHead>Data de Ocorrência</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-slate-800">{r.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {r.incident_date ? new Date(r.incident_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        r.severity === 'Alta' ? 'text-red-700 bg-red-50 border-red-200' : ''
                      }
                    >
                      {r.severity || 'Não Avaliado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{r.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
