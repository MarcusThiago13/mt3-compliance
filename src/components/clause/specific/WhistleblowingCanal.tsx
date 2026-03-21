import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  ShieldAlert,
  ListFilter,
  ShieldCheck,
  Eye,
  Loader2,
  MessageSquare,
  Send,
} from 'lucide-react'
import { whistleblowingService } from '@/services/whistleblowing'
import { toast } from '@/hooks/use-toast'

export function WhistleblowingCanal() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')

  const fetchReports = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      const data = await whistleblowingService.getTenantReports(tenantId)
      setReports(data)
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao buscar denúncias.', variant: 'destructive' })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReports()
  }, [tenantId])

  const openReport = async (report: any) => {
    setSelectedReport(report)
    setIsModalOpen(true)
    const msgs = await whistleblowingService.getMessages(report.id)
    setMessages(msgs)
  }

  const handleUpdateStatus = async (val: string) => {
    if (!selectedReport) return
    try {
      await whistleblowingService.updateReport(selectedReport.id, { status: val })
      setSelectedReport({ ...selectedReport, status: val })
      toast({ title: 'Status Atualizado', description: 'O caso foi atualizado com sucesso.' })
      fetchReports()
    } catch (e) {
      toast({ title: 'Erro', description: 'Não foi possível atualizar.', variant: 'destructive' })
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedReport) return
    try {
      await whistleblowingService.sendMessage(selectedReport.id, 'investigator', newMessage)
      setNewMessage('')
      const msgs = await whistleblowingService.getMessages(selectedReport.id)
      setMessages(msgs)
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao enviar.', variant: 'destructive' })
    }
  }

  const triageReports = reports.filter((r) =>
    ['nova', 'em_triagem', 'em_admissibilidade', 'arquivada'].includes(r.status),
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">8.3 Levantamento de Preocupações</h3>
          <p className="text-sm text-muted-foreground">
            Recepção, triagem e gestão segura de denúncias (Intake Portal).
          </p>
        </div>
      </div>

      <Tabs defaultValue="triage">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="triage" className="py-2">
            Triagem (Inbox)
          </TabsTrigger>
          <TabsTrigger value="protection" className="py-2">
            Medidas de Proteção
          </TabsTrigger>
          <TabsTrigger value="preview" className="py-2">
            Portal Público (Acesso)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="triage">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <ListFilter className="h-4 w-4" /> Fila de Entrada
            </h4>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="animate-spin h-6 w-6 text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data Recepção</TableHead>
                    <TableHead>Sigilo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {triageReports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Nenhum caso na triagem.
                      </TableCell>
                    </TableRow>
                  )}
                  {triageReports.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {c.protocol_number}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{c.category}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(c.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {c.is_anonymous ? 'Anônimo' : 'Identificado'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="uppercase text-[10px]">
                          {c.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openReport(c)}>
                          <Eye className="h-4 w-4 mr-2" /> Analisar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="protection">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-3">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Política de Não-Retaliação Aplicada
            </h4>
            <p className="text-sm text-blue-800">
              A organização garante proteção integral a relatores de boa-fé. O acesso a este painel
              é restrito.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="bg-muted/50 p-8 rounded-lg max-w-2xl mx-auto border shadow-sm mt-4 text-center">
            <ShieldAlert className="h-16 w-16 text-primary mx-auto mb-4 opacity-80" />
            <h4 className="text-2xl font-bold mb-2">Portal Público de Denúncias</h4>
            <p className="text-muted-foreground mb-6">
              O canal seguro e anônimo da sua organização já está ativo. Compartilhe o link abaixo
              com seus colaboradores.
            </p>
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <Input
                readOnly
                value={`${window.location.origin}/r/${tenantId}/report`}
                className="text-center font-mono text-xs"
              />
              <Button asChild className="w-full">
                <a href={`/r/${tenantId}/report`} target="_blank" rel="noopener noreferrer">
                  Testar Portal Seguro
                </a>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between border-b pb-2">
              <span>Caso: {selectedReport?.protocol_number}</span>
              <Badge variant="outline">
                {selectedReport?.is_anonymous ? 'Relato Anônimo' : 'Relato Identificado'}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="grid md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Status Atual (Triagem)</Label>
                  <Select value={selectedReport.status} onValueChange={handleUpdateStatus}>
                    <SelectTrigger className="font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nova">Nova</SelectItem>
                      <SelectItem value="em_triagem">Em Triagem</SelectItem>
                      <SelectItem value="em_admissibilidade">Em Admissibilidade</SelectItem>
                      <SelectItem value="em_investigacao">
                        Encaminhar p/ Investigação (8.4)
                      </SelectItem>
                      <SelectItem value="arquivada">Arquivar (Inadmissível)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted/30 p-3 rounded-md text-sm border space-y-2">
                  <p>
                    <strong>Categoria:</strong> {selectedReport.category}
                  </p>
                  <p>
                    <strong>Data Indicada:</strong> {selectedReport.incident_date_start || 'N/A'}
                  </p>
                  <p>
                    <strong>Local:</strong> {selectedReport.incident_location || 'N/A'}
                  </p>
                  <p>
                    <strong>Envolvidos:</strong> {selectedReport.involved_persons || 'N/A'}
                  </p>
                </div>
                {!selectedReport.is_anonymous && (
                  <div className="bg-amber-50 p-3 rounded-md text-sm border border-amber-200">
                    <p className="font-bold text-amber-800 mb-1">Dados do Denunciante</p>
                    <p>Nome: {selectedReport.reporter_name}</p>
                    <p>
                      Contato: {selectedReport.reporter_email} / {selectedReport.reporter_phone}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="font-bold">Descrição do Relato</Label>
                  <p className="text-sm mt-1 bg-slate-50 p-3 rounded-md border min-h-[100px] whitespace-pre-wrap">
                    {selectedReport.description}
                  </p>
                </div>
              </div>

              <div className="border rounded-md flex flex-col h-[400px]">
                <div className="bg-muted px-3 py-2 font-semibold flex items-center gap-2 text-sm border-b">
                  <MessageSquare className="h-4 w-4" /> Sala Segura (Chat)
                </div>
                <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender_type === 'investigator' ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5">
                        {m.sender_type === 'investigator' ? 'Equipe SGC' : 'Denunciante'}
                      </span>
                      <div
                        className={`p-2 text-xs rounded-md shadow-sm max-w-[90%] ${m.sender_type === 'investigator' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-white border rounded-tl-none'}`}
                      >
                        {m.message}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t bg-white flex gap-2">
                  <Textarea
                    placeholder="Mensagem ao denunciante..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[40px] h-10 text-xs"
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
