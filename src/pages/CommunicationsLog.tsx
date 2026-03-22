import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { History, Loader2, Mail, CheckCircle2, Eye, XCircle, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
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
import { useAppStore } from '@/stores/main'
import { SendEmailModal } from '@/components/shared/SendEmailModal'

export default function CommunicationsLog() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { activeTenant } = useAppStore()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('communication_logs')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
    if (data) setLogs(data)
    setLoading(false)
  }

  useEffect(() => {
    if (tenantId) fetchLogs()
  }, [tenantId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-none">
            <Mail className="mr-1 h-3 w-3" /> Enviado
          </Badge>
        )
      case 'delivered':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Entregue
          </Badge>
        )
      case 'opened':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-none">
            <Eye className="mr-1 h-3 w-3" /> Lido
          </Badge>
        )
      case 'bounced':
      case 'complained':
        return (
          <Badge variant="destructive" className="border-none">
            <XCircle className="mr-1 h-3 w-3" /> Falha
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <History className="h-8 w-8" />
            Histórico de Comunicações
          </h1>
          <p className="text-muted-foreground mt-1">
            Registro de e-mails disparados pelo sistema para{' '}
            {activeTenant?.name || 'esta organização'}.
          </p>
        </div>
        <Button onClick={() => setIsEmailModalOpen(true)}>
          <Send className="mr-2 h-4 w-4" /> Nova Comunicação
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30">
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-medium">{log.to_email}</TableCell>
                    <TableCell>{log.subject}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      Nenhuma comunicação registrada para esta organização.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SendEmailModal
        isOpen={isEmailModalOpen}
        onOpenChange={(open) => {
          setIsEmailModalOpen(open)
          if (!open) fetchLogs()
        }}
        tenantId={tenantId}
      />
    </div>
  )
}
