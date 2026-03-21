import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { workflowService } from '@/services/workflow'
import { uploadDocument } from '@/lib/upload'
import { toast } from '@/hooks/use-toast'
import {
  Loader2,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'

export default function SubmitEvidence() {
  const { requestId } = useParams<{ requestId: string }>()
  const navigate = useNavigate()

  const [request, setRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [comments, setComments] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (requestId) {
      workflowService
        .getEvidenceRequest(requestId)
        .then((data) => {
          setRequest(data)
          setComments(data.submitter_comments || '')
        })
        .catch((err) => {
          console.error(err)
          toast({
            title: 'Acesso Negado',
            description: 'Solicitação não encontrada ou você não tem permissão.',
            variant: 'destructive',
          })
        })
        .finally(() => setLoading(false))
    }
  }, [requestId])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!requestId || !request) return
    if (!selectedFile && !request.file_url) {
      toast({
        title: 'Atenção',
        description: 'Você precisa anexar um arquivo de evidência.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      let fileUrl = request.file_url
      let fileName = request.file_name

      if (selectedFile) {
        const { path, error } = await uploadDocument(selectedFile, request.tenant_id)
        if (error) throw new Error(error)
        fileUrl = path
        fileName = selectedFile.name
      }

      await workflowService.updateEvidenceRequest(requestId, {
        status: 'submitted',
        file_url: fileUrl,
        file_name: fileName,
        submitter_comments: comments,
      })

      toast({
        title: 'Evidência Enviada',
        description: 'Sua evidência foi enviada e está aguardando aprovação do Compliance Officer.',
      })
      setRequest({
        ...request,
        status: 'submitted',
        file_url: fileUrl,
        file_name: fileName,
        submitter_comments: comments,
      })
      setSelectedFile(null)
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err.message || 'Falha ao enviar evidência.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  if (!request)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold">Solicitação Não Encontrada</h2>
        <Button variant="link" onClick={() => navigate('/')}>
          Voltar ao Início
        </Button>
      </div>
    )

  const isApproved = request.status === 'approved'

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-8 w-full">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-primary">{request.task_title}</CardTitle>
              <CardDescription className="mt-2 text-base">
                Organização: <strong>{request.tenant?.name || '---'}</strong>
              </CardDescription>
            </div>
            {request.status === 'pending' && (
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold shrink-0 ml-2">
                Pendente
              </span>
            )}
            {request.status === 'submitted' && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold shrink-0 ml-2">
                Em Análise
              </span>
            )}
            {request.status === 'approved' && (
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold shrink-0 ml-2">
                Aprovada
              </span>
            )}
            {request.status === 'rejected' && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold shrink-0 ml-2">
                Ajuste Necessário
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/30 p-4 rounded-md border text-sm">
            <p>
              <strong>Prazo:</strong>{' '}
              {request.deadline ? new Date(request.deadline).toLocaleDateString() : 'Não definido'}
            </p>
            {request.clause_id && (
              <p>
                <strong>Requisito ISO:</strong> {request.clause_id}
              </p>
            )}
            {request.task_description && (
              <p className="mt-2 text-muted-foreground">{request.task_description}</p>
            )}
          </div>

          {request.status === 'rejected' && request.reviewer_feedback && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md">
              <h4 className="font-semibold text-red-800 flex items-center mb-1">
                <AlertCircle className="h-4 w-4 mr-2" /> Feedback do Compliance
              </h4>
              <p className="text-sm text-red-700">{request.reviewer_feedback}</p>
            </div>
          )}

          {!isApproved && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Anexar Documento Comprobatório (Evidência)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:bg-muted/10 transition-colors text-center">
                  <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <Input
                    type="file"
                    onChange={handleFileSelect}
                    className="max-w-xs mx-auto text-xs"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                  {request.file_name && !selectedFile && (
                    <p className="text-xs text-blue-600 mt-3 font-medium">
                      Arquivo atual: {request.file_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Comentários (Opcional)</Label>
                <Textarea
                  placeholder="Descreva brevemente a ação realizada ou observações sobre o documento..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {isApproved && (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-md text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-emerald-800 text-lg">Ação Concluída e Aprovada</h3>
              <p className="text-sm text-emerald-700 mt-1">
                O Compliance Officer validou sua entrega. A evidência já faz parte do dossiê oficial
                da empresa.
              </p>
            </div>
          )}
        </CardContent>
        {!isApproved && (
          <CardFooter className="bg-muted/20 border-t p-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-2 h-4 w-4" />
              )}
              Enviar para Aprovação
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
