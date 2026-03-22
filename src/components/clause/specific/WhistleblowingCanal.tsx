import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  ShieldAlert,
  ListFilter,
  ShieldCheck,
  Eye,
  Loader2,
  MessageSquare,
  Send,
  FileSearch,
  CheckCircle2,
} from 'lucide-react'
import { whistleblowingService } from '@/services/whistleblowing'
import { ddService } from '@/services/due-diligence'
import { toast } from '@/hooks/use-toast'

export function WhistleblowingCanal() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()

  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')

  const [isCreatingDD, setIsCreatingDD] = useState(false)
  const [ddModalOpen, setDdModalOpen] = useState(false)

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

  const handleTriggerDD = async () => {
    if (!selectedReport || !tenantId) return
    setIsCreatingDD(true)

    try {
      // Create a High Risk DD Process automatically linked to the involved persons
      await ddService.createProcess({
        tenant_id: tenantId,
        target_type: 'Investigação Interna',
        target_name: selectedReport.involved_persons || 'Envolvido não especificado',
        target_document: selectedReport.protocol_number,
        risk_score: 10,
        risk_level: 'Alto',
        dd_level: 'EDD',
      })

      toast({
        title: 'Due Diligence Iniciada',
        description: 'Um processo de EDD (Enhanced Due Diligence) foi criado para os envolvidos.',
      })

      // Auto-update status to investigation
      if (selectedReport.status !== 'em_investigacao') {
        await handleUpdateStatus('em_investigacao')
      }

      setDdModalOpen(false)
    } catch (e: any) {
      toast({
        title: 'Erro',
        description: e.message || 'Falha ao criar Due Diligence',
        variant: 'destructive',
      })
    } finally {
      setIsCreatingDD(false)
    }
  }

  const triageReports = reports.filter((r) =>
    ['nova', 'em_triagem', 'em_admissibilidade', 'arquivada'].includes(r.status),
  )

  const investigationReports = reports.filter((r) => ['em_investigacao'].includes(r.status))

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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 h-auto p-1 gap-1">
          <TabsTrigger
            value="triage"
            className="py-2 text-xs sm:text-sm whitespace-normal h-auto text-center"
          >
            Triagem (Inbox)
          </TabsTrigger>
          <TabsTrigger
            value="investigation"
            className="py-2 text-xs sm:text-sm whitespace-normal h-auto text-center"
          >
            Em Investigação
          </TabsTrigger>
          <TabsTrigger
            value="protection"
            className="py-2 text-xs sm:text-sm whitespace-normal h-auto text-center"
          >
            Medidas de Proteção
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="py-2 text-xs sm:text-sm whitespace-normal h-auto text-center"
          >
            Portal Público
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

        <TabsContent value="investigation">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <FileSearch className="h-4 w-4" /> Casos em Investigação Ativa
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
                    <TableHead>Envolvidos</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Início da Investigação</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investigationReports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhum caso em investigação no momento.
                      </TableCell>
                    </TableRow>
                  )}
                  {investigationReports.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {c.protocol_number}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm max-w-[200px] truncate">
                          {c.involved_persons || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{c.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(c.updated_at || c.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openReport(c)}>
                          <FileSearch className="h-4 w-4 mr-2" /> Detalhes
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between border-b pb-2">
              <span>Caso: {selectedReport?.protocol_number}</span>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {selectedReport?.is_anonymous ? 'Relato Anônimo' : 'Relato Identificado'}
                </Badge>
                {selectedReport?.status === 'em_admissibilidade' && (
                  <Button
                    size="sm"
                    className="h-6 text-[10px] bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => setDdModalOpen(true)}
                  >
                    <FileSearch className="h-3 w-3 mr-1" />
                    Iniciar Due Diligence
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="grid md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Status Atual</Label>
                  <Select value={selectedReport.status} onValueChange={handleUpdateStatus}>
                    <SelectTrigger className="font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nova">Nova</SelectItem>
                      <SelectItem value="em_triagem">Em Triagem</SelectItem>
                      <SelectItem value="em_admissibilidade">Em Admissibilidade</SelectItem>
                      <SelectItem value="em_investigacao">Em Investigação (8.4)</SelectItem>
                      <SelectItem value="arquivada">Arquivada (Inadmissível)</SelectItem>
                      <SelectItem value="encerrada_procedente">Encerrada (Procedente)</SelectItem>
                      <SelectItem value="encerrada_improcedente">
                        Encerrada (Improcedente)
                      </SelectItem>
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
                  <p className="text-sm mt-1 bg-slate-50 p-3 rounded-md border min-h-[100px] max-h-[150px] overflow-y-auto whitespace-pre-wrap">
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

      <Dialog open={ddModalOpen} onOpenChange={setDdModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-purple-600" />
              Integrar com Due Diligence
            </DialogTitle>
            <DialogDescription>
              Deseja criar um processo de Enhanced Due Diligence (EDD) para os envolvidos nesta
              denúncia? O status será alterado automaticamente para "Em Investigação".
            </DialogDescription>
          </DialogHeader>
          <div className="bg-purple-50 p-4 rounded-md border border-purple-100 my-2">
            <p className="text-sm text-purple-900 font-medium mb-1">Alvo da Investigação:</p>
            <p className="text-sm text-purple-700">
              {selectedReport?.involved_persons ||
                'Não especificado (Será criado como "Alvo Indeterminado")'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDdModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleTriggerDD}
              disabled={isCreatingDD}
            >
              {isCreatingDD ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Criar Processo DD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
