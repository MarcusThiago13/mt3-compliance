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
import { Users, Plus, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function TitularesTab({ tenant }: any) {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [tenant.id])

  const fetchRequests = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('digital_requests')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
    if (data) setRequests(data)
    setLoading(false)
  }

  return (
    <Card className="animate-in fade-in shadow-sm border-slate-200">
      <CardHeader className="border-b bg-slate-50/50 pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-primary" /> Atendimento aos Titulares
          </CardTitle>
          <CardDescription>
            Gestão de requisições de acesso, exclusão e portabilidade de dados.
          </CardDescription>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Nova Requisição
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-slate-50">
            <p>Nenhuma requisição de titular registrada.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titular / Solicitante</TableHead>
                <TableHead>Tipo de Direito</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-slate-800">{r.requester_name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{r.request_type}</TableCell>
                  <TableCell>
                    {r.deadline ? new Date(r.deadline).toLocaleDateString() : '-'}
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
