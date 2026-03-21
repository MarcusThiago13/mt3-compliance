import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { workflowService } from '@/services/workflow'
import { complianceService } from '@/services/compliance'
import { getDocumentUrl } from '@/lib/upload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import {
  Loader2,
  Inbox,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function EvidenceInbox() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { user } = useAuth()

  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedReq, setSelectedReq] = useState<any>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchRequests = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      const data = await workflowService.getTenantEvidenceRequests(tenantId)
      setRequests(data)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [tenantId])

  const handleDownload = async (path: string | null) => {
    if (!path) return
    const url = await getDocumentUrl(path)
    if (url) window.open(url, '_blank')
    else
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar link do arquivo.',
        variant: 'destructive',
      })
  }

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!selectedReq) return
    if (status === 'rejected' && !feedback.trim()) {
      toast({
        title: 'Atenção',
        description: 'Feedback é obrigatório para reprovações.',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)
    try {
      await workflowService.updateEvidenceRequest(selectedReq.id, {
        status,
        reviewer_feedback: feedback,
      })

      if (status === 'approved' && selectedReq.clause_id) {
        await complianceService.addEvidence({
          clause_id: selectedReq.clause_id,
          file_name: selectedReq.file_name || 'Evidência via Workflow',
          file_url: selectedReq.file_url,
          uploaded_by: selectedReq.assignee_email || 'Sistema Workflow',
          tenant_id: tenantId,
          is_legally_valid: false,
        })

        await complianceService.addAuditLog(
          selectedReq.clause_id,
          `Ação "${selectedReq.task_title}" aprovada e evidência consolidada.`,
          user?.email || 'Sistema',
        )
      }

      toast({
        title: 'Sucesso',
        description: `Solicitação ${status === 'approved' ? 'Aprovada' : 'Reprovada'} com sucesso.`,
      })
      setIsReviewOpen(false)
      fetchRequests()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
    setIsProcessing(false)
  }

  const openReviewModal = (req: any) => {
    setSelectedReq(req)
    setFeedback(req.reviewer_feedback || '')
    setIsReviewOpen(true)
  }

  const submitted = requests.filter((r) => r.status === 'submitted')
  const pending = requests.filter((r) => r.status === 'pending')
  const rejected = requests.filter((r) => r.status === 'rejected')
  const approved = requests.filter((r) => r.status === 'approved')

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link to={`/${tenantId}/intelligence`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Inbox className="h-8 w-8" />
            Inbox de Validação
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão e aprovação de evidências enviadas pelos colaboradores.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="submitted" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="submitted" className="relative">
              Em Análise
              {submitted.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending">Aguardando Envio</TabsTrigger>
            <TabsTrigger value="rejected">Ajuste Necessário</TabsTrigger>
            <TabsTrigger value="approved">Aprovadas</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="submitted" className="space-y-4 outline-none">
              {submitted.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-lg border">
                  <CheckCircle2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Nenhuma evidência aguardando sua validação.
                  </p>
                </div>
              ) : (
                submitted.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    onAction={() => openReviewModal(req)}
                    actionLabel="Avaliar Entrega"
                    actionIcon={<ShieldAlert className="h-4 w-4 mr-2" />}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 outline-none">
              {pending.length === 0 && (
                <p className="text-muted-foreground py-8 text-center">
                  Nenhuma solicitação pendente.
                </p>
              )}
              {pending.map((req) => (
                <RequestCard key={req.id} req={req} />
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 outline-none">
              {rejected.length === 0 && (
                <p className="text-muted-foreground py-8 text-center">
                  Nenhuma solicitação reprovada.
                </p>
              )}
              {rejected.map((req) => (
                <RequestCard key={req.id} req={req} />
              ))}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4 outline-none">
              {approved.length === 0 && (
                <p className="text-muted-foreground py-8 text-center">
                  Nenhuma solicitação aprovada.
                </p>
              )}
              {approved.map((req) => (
                <RequestCard
                  key={req.id}
                  req={req}
                  onAction={() => openReviewModal(req)}
                  actionLabel="Ver Detalhes"
                  actionVariant="outline"
                />
              ))}
            </TabsContent>
          </div>
        </Tabs>
      )}

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Avaliação de Evidência</DialogTitle>
            <DialogDescription>
              Revise o material enviado pelo colaborador e determine a conformidade.
            </DialogDescription>
          </DialogHeader>

          {selectedReq && (
            <div className="space-y-6 py-4">
              <div className="bg-muted/30 p-4 rounded-md border text-sm">
                <p>
                  <strong>Ação:</strong> {selectedReq.task_title}
                </p>
                <p>
                  <strong>Colaborador:</strong> {selectedReq.assignee_email}
                </p>
                <p>
                  <strong>Requisito (ISO):</strong> {selectedReq.clause_id || 'Não mapeado'}
                </p>
              </div>

              {selectedReq.submitter_comments && (
                <div>
                  <Label className="text-primary font-semibold mb-1 block">
                    Comentários do Colaborador:
                  </Label>
                  <p className="text-sm bg-blue-50/50 p-3 rounded-md border border-blue-100">
                    {selectedReq.submitter_comments}
                  </p>
                </div>
              )}

              <div>
                <Label className="text-primary font-semibold mb-2 block">Arquivo Anexado:</Label>
                {selectedReq.file_url ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleDownload(selectedReq.file_url)}
                  >
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    {selectedReq.file_name || 'Abrir Documento'}
                    <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nenhum arquivo anexado.</p>
                )}
              </div>

              {selectedReq.status === 'submitted' && (
                <div className="space-y-2 pt-4 border-t">
                  <Label>Feedback para o colaborador (Obrigatório em caso de reprovação)</Label>
                  <Textarea
                    rows={3}
                    placeholder="Ex: O documento está incompleto, faltam as assinaturas..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              )}
              {selectedReq.status === 'approved' && selectedReq.reviewer_feedback && (
                <div>
                  <Label className="text-emerald-700 font-semibold mb-1 block">
                    Seu Feedback (Aprovação):
                  </Label>
                  <p className="text-sm bg-emerald-50 p-3 rounded-md border border-emerald-100">
                    {selectedReq.reviewer_feedback}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
              Fechar
            </Button>
            {selectedReq?.status === 'submitted' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleReview('rejected')}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Reprovar (Solicitar Ajuste)'
                  )}
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleReview('approved')}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Aprovar e Integrar ao SGC'
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RequestCard({ req, onAction, actionLabel, actionIcon, actionVariant = 'default' }: any) {
  return (
    <Card className="shadow-sm border-l-4 border-l-primary/60 hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-primary">{req.task_title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Responsável: <strong>{req.assignee_email}</strong>
          </p>
          <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Prazo:{' '}
              {req.deadline ? new Date(req.deadline).toLocaleDateString() : 'N/A'}
            </span>
            {req.clause_id && (
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" /> ISO {req.clause_id}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
          {req.status === 'pending' && <Badge variant="secondary">Aguardando Colaborador</Badge>}
          {req.status === 'rejected' && <Badge variant="destructive">Retornado p/ Ajustes</Badge>}
          {req.status === 'approved' && (
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
              Aprovada
            </Badge>
          )}

          {onAction && (
            <Button
              size="sm"
              variant={actionVariant}
              onClick={onAction}
              className="w-full sm:w-auto"
            >
              {actionIcon} {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
