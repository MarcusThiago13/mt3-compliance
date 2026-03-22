import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  FileText,
  Save,
  ArrowLeft,
  Printer,
  History,
  FileDown,
  ShieldCheck,
  Loader2,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { documentService } from '@/services/documents'
import { toast } from '@/hooks/use-toast'
import { exportToText } from '@/lib/export'

export default function DocumentEditor() {
  const { tenantId, docId } = useParams<{ tenantId: string; docId: string }>()
  const navigate = useNavigate()

  const [document, setDocument] = useState<any>(null)
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('draft')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false)
  const [changeReason, setChangeReason] = useState('')
  const [versions, setVersions] = useState<any[]>([])

  useEffect(() => {
    if (docId) {
      documentService
        .getDocument(docId)
        .then((doc) => {
          setDocument(doc)
          setContent(doc.content)
          setStatus(doc.status)
        })
        .catch(() => {
          toast({
            title: 'Acesso Negado',
            description: 'Documento não encontrado ou sem permissão.',
            variant: 'destructive',
          })
          navigate(`/${tenantId}/documents`)
        })
        .finally(() => setLoading(false))
    }
  }, [docId, tenantId, navigate])

  const handleSave = async (bumpVersion: boolean = false) => {
    if (!docId) return
    if (bumpVersion && !changeReason) {
      toast({
        title: 'Atenção',
        description: 'Informe o motivo da alteração para salvar uma nova versão.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      await documentService.updateDocument(
        docId,
        {
          content,
          status,
        },
        bumpVersion ? changeReason : undefined,
      )

      const updatedDoc = await documentService.getDocument(docId)
      setDocument(updatedDoc)
      setChangeReason('')
      setIsVersionModalOpen(false)

      toast({
        title: 'Sucesso',
        description: bumpVersion ? 'Nova versão registrada.' : 'Documento atualizado.',
      })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const loadVersions = async () => {
    if (docId) {
      const data = await documentService.getVersions(docId)
      setVersions(data)
    }
  }

  const handleExportPrint = () => {
    // Improved Markdown Regex Parser for Print View
    const renderMarkdown = (md: string) => {
      return md
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
        .replace(
          /(<li>.*<\/li>)/gis,
          '<ul style="margin-top: 5px; margin-bottom: 15px; padding-left: 20px;">$1</ul>',
        )
        .replace(/\n\n/gim, '<br /><br />')
    }

    const htmlContent = renderMarkdown(content)
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${document?.title || 'Relatório de Compliance'}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 60px; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; }
              h1 { color: #111; font-size: 24px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;}
              h2 { color: #222; font-size: 20px; margin-top: 30px;}
              h3 { color: #444; font-size: 16px;}
              li { margin-bottom: 6px; }
              .meta-header { background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 40px; font-size: 12px; color: #555; }
              .meta-header p { margin: 4px 0; }
              strong { color: #000; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            <div class="meta-header">
              <p><strong>DOCUMENTO OFICIAL DE COMPLIANCE / RELATÓRIO TÉCNICO</strong></p>
              <p><strong>Título:</strong> ${document?.title}</p>
              <p><strong>Confidencialidade:</strong> ${document?.confidentiality || 'Uso Interno'}</p>
              <p><strong>Período Ref.:</strong> ${document?.period_ref || 'N/A'}</p>
              <p><strong>Audiência Alvo:</strong> ${document?.audience || 'Geral'}</p>
              <p><strong>Versão Atual:</strong> v${document?.version}</p>
              <p><strong>Gerado em:</strong> ${new Date(document?.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
            <div style="white-space: pre-wrap;">${htmlContent}</div>
            <script>setTimeout(() => { window.print(); }, 500);</script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'draft':
        return <Badge variant="secondary">Rascunho</Badge>
      case 'review':
        return <Badge className="bg-amber-100 text-amber-800">Em Revisão</Badge>
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800">Aprovado</Badge>
      case 'emitted':
        return <Badge className="bg-emerald-100 text-emerald-800">Emitido Oficial</Badge>
      default:
        return <Badge>{s}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in flex flex-col h-[calc(100vh-100px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to={`/${tenantId}/documents`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 truncate max-w-lg">
                {document?.title}
              </h1>
              {getStatusBadge(document?.status)}
              <Badge variant="outline" className="font-mono text-xs">
                v{document?.version}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1 truncate max-w-lg">
              <ShieldCheck className="h-3 w-3 mr-1" /> Modelo:{' '}
              {document?.template?.name || 'Personalizado'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportPrint} title="Imprimir ou Salvar PDF">
            <Printer className="mr-2 h-4 w-4" /> Imprimir / PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => exportToText(`${document.title}.md`, content)}
            title="Baixar Markdown (DOCX Compatível)"
          >
            <FileDown className="mr-2 h-4 w-4" /> Baixar MD
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 shadow-md"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Progresso
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 border rounded-lg shadow-inner overflow-hidden flex flex-col bg-card">
          <div className="bg-muted/30 border-b px-4 py-2 text-xs font-mono text-muted-foreground flex items-center justify-between shrink-0">
            <span>Editor Estrutural (Markdown) - Modificações manuais devem ser salvas</span>
            {document?.status === 'emitted' && (
              <span className="text-destructive font-bold flex items-center">
                <Info className="h-3 w-3 mr-1" /> Cuidado: Relatório já emitido
              </span>
            )}
          </div>
          <Textarea
            className="flex-1 w-full p-6 resize-none border-none focus-visible:ring-0 text-base shadow-none bg-transparent rounded-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ fontFamily: 'monospace', lineHeight: '1.6' }}
            spellCheck={false}
          />
        </div>

        <div className="w-full lg:w-72 shrink-0 space-y-4 overflow-y-auto">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-bold flex items-center">
                <FileText className="h-4 w-4 mr-2 text-primary" /> Metadados da Geração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Workflow / Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="review">Em Revisão (Requer Aprovação)</SelectItem>
                    <SelectItem value="approved">Aprovado Oficialmente</SelectItem>
                    <SelectItem value="emitted">Emitido / Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-slate-50 p-3 rounded text-xs space-y-2 border">
                <p>
                  <strong className="text-slate-700">Audiência:</strong>{' '}
                  {document?.audience || 'Geral'}
                </p>
                <p>
                  <strong className="text-slate-700">Confidencialidade:</strong>{' '}
                  {document?.confidentiality || 'Uso Interno'}
                </p>
                <p>
                  <strong className="text-slate-700">Período Ref.:</strong>{' '}
                  {document?.period_ref || 'Não especificado'}
                </p>
                <p>
                  <strong className="text-slate-700">Rastreabilidade:</strong> IA Baseada em RAG
                  (Dados Locais)
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  className="w-full text-xs"
                  onClick={() => setIsVersionModalOpen(true)}
                >
                  <Save className="h-3 w-3 mr-2" /> Congelar Nova Versão Histórica
                </Button>
              </div>
              <div>
                <Button
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground"
                  onClick={() => {
                    loadVersions()
                  }}
                >
                  <History className="h-3 w-3 mr-2" /> Exibir Histórico Completo
                </Button>
              </div>
            </CardContent>
          </Card>

          {versions.length > 0 && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Trilha de Revisão e Versões
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                {versions.map((v) => (
                  <div key={v.id} className="text-xs border-l-2 border-primary/40 pl-2 py-1">
                    <div className="flex justify-between items-center font-bold">
                      <span>Versão {v.version_number}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {new Date(v.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p
                      className="text-muted-foreground mt-0.5 line-clamp-2"
                      title={v.change_reason}
                    >
                      {v.change_reason || 'Modificação'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isVersionModalOpen} onOpenChange={setIsVersionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Congelar Nova Versão Histórica</DialogTitle>
            <DialogDescription>
              Isso criará um registro imutável do texto atual no histórico de versões, garantindo a
              rastreabilidade exigida em auditorias (Salvar como v{document?.version + 1}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Motivo da Revisão / Justificativa (Obrigatório)</Label>
              <Input
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Ex: Ajustes exigidos pela alta direção na seção de riscos."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsVersionModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSave(true)} disabled={saving || !changeReason}>
              Salvar como v{document?.version + 1}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
