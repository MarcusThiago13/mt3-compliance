import {
  UploadCloud,
  File,
  Trash2,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  FileText,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { IsoClause } from '@/lib/iso-data'
import { callAnthropicMessage } from '@/lib/anthropic'
import { complianceService } from '@/services/compliance'
import { uploadDocument, getDocumentUrl } from '@/lib/upload'
import { extractTextFromFile } from '@/lib/document-parser'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'

export function EvidenceTab({ clause }: { clause?: IsoClause }) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [summary, setSummary] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [useSonnet, setUseSonnet] = useState(false)

  const { user } = useAuth()
  const [evidence, setEvidence] = useState<any[]>([])
  const [expiryDate, setExpiryDate] = useState('')
  const [isLegal, setIsLegal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [extractedText, setExtractedText] = useState('')

  useEffect(() => {
    if (clause?.id) {
      complianceService.getEvidence(clause.id, tenantId).then(setEvidence)
    }
  }, [clause?.id, tenantId])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleAddEvidence = async () => {
    if (!clause?.id) return
    if (!selectedFile) {
      toast({
        title: 'Atenção',
        description: 'Selecione um arquivo para upload.',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)

    try {
      const { path, error } = await uploadDocument(selectedFile, tenantId || 'default')

      if (error) {
        toast({ title: 'Erro no Upload', description: error, variant: 'destructive' })
        setIsUploading(false)
        return
      }

      // Simular extração de texto para permitir leitura pela IA
      const text = await extractTextFromFile(selectedFile)
      setExtractedText(text)

      const newEv = await complianceService.addEvidence({
        clause_id: clause.id,
        file_name: selectedFile.name,
        file_url: path,
        expiry_date: expiryDate || null,
        is_legally_valid: isLegal,
        uploaded_by: user?.email,
        tenant_id: tenantId,
      })

      if (newEv) {
        setEvidence([newEv, ...evidence])
        toast({
          title: 'Upload Concluído',
          description: 'Evidência anexada. A IA já realizou a leitura inicial do documento.',
        })
        setSelectedFile(null)
        setExpiryDate('')
        setIsLegal(false)
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erro inesperado',
        description: 'Falha ao processar o documento.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async (path: string | null) => {
    if (!path) {
      toast({
        title: 'Link indisponível',
        description: 'O documento não possui arquivo armazenado no sistema ou é um link externo.',
        variant: 'destructive',
      })
      return
    }
    const url = await getDocumentUrl(path)
    if (url) {
      window.open(url, '_blank')
    } else {
      toast({
        title: 'Erro de Acesso',
        description: 'Não foi possível gerar o link seguro para download.',
        variant: 'destructive',
      })
    }
  }

  const handleGenerateSummary = async () => {
    setIsGenerating(true)
    const textToAnalyze =
      extractedText ||
      'Nenhum texto recente extraído no cache. Análise baseada apenas nos metadados.'
    const prompt = `Gere um sumário de conformidade cruzando o documento recém anexado com os requisitos do item ${clause?.id} - ${clause?.title}. Texto extraído do documento: "${textToAnalyze}"`

    const response = await callAnthropicMessage(prompt, 1024, useSonnet)
    setSummary(response)
    setIsGenerating(false)
  }

  const getStatusInfo = (dateStr: string | null) => {
    if (!dateStr)
      return { color: 'text-slate-500', bg: 'bg-slate-100', icon: File, label: 'Sem Validade' }
    const expiry = new Date(dateStr).getTime()
    const now = new Date().getTime()
    const days30 = 30 * 24 * 60 * 60 * 1000

    if (expiry < now)
      return {
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        icon: AlertCircle,
        label: 'Expirado',
      }
    if (expiry < now + days30)
      return {
        color: 'text-amber-500',
        bg: 'bg-amber-100',
        icon: AlertTriangle,
        label: 'Expira em breve',
      }
    return { color: 'text-success', bg: 'bg-success/10', icon: CheckCircle2, label: 'Válido' }
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:bg-muted/30 transition-colors">
        <div className="text-center mb-6">
          <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-sm">Selecione um arquivo para upload seguro</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">PDF, DOCX, Imagens (Max 10MB)</p>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileSelect}
            className="max-w-xs mx-auto text-xs"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            disabled={isUploading}
          />
          {selectedFile && (
            <p className="text-xs text-primary mt-2 font-medium">
              Arquivo pronto para upload: {selectedFile.name}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto bg-card p-4 rounded-md border shadow-sm">
          <div className="space-y-2">
            <Label className="text-xs">Data de Validade (Expiração)</Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="h-8 text-xs"
              disabled={isUploading}
            />
          </div>
          <div className="space-y-2 flex flex-col justify-end">
            <div className="flex items-center space-x-2 border p-1.5 rounded-md bg-muted/50">
              <Switch
                id="legal-validity"
                checked={isLegal}
                onCheckedChange={setIsLegal}
                disabled={isUploading}
              />
              <Label
                htmlFor="legal-validity"
                className="text-xs cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="h-3 w-3 text-primary" /> Assinatura Digital Legal
              </Label>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="sm:col-span-2"
            onClick={handleAddEvidence}
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4 mr-2" />
            )}
            {isUploading ? 'Processando e Extraindo Texto...' : 'Realizar Upload Seguro e Auditar'}
          </Button>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        <h4 className="text-sm font-semibold">Repositório de Evidências</h4>
        {evidence.map((ev) => {
          const status = getStatusInfo(ev.expiry_date)
          const StatusIcon = status.icon
          return (
            <div
              key={ev.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md bg-card gap-4"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded shrink-0 ${status.bg}`}>
                  <StatusIcon className={`h-5 w-5 ${status.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {ev.file_name}
                    {ev.is_legally_valid && (
                      <ShieldCheck
                        className="h-3.5 w-3.5 text-primary"
                        title="Assinado Digitalmente"
                      />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Anexado por {ev.uploaded_by} em {new Date(ev.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-semibold ${status.color} mr-2`}>{status.label}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs flex items-center gap-1 text-primary border-primary/20 hover:bg-primary/5"
                  onClick={() => handleDownload(ev.file_url)}
                >
                  <Download className="h-3 w-3" /> Baixar
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
        {evidence.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma evidência registrada.</p>
        )}
      </div>

      <div className="pt-6 border-t mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" /> Análise de Conformidade Documental (IA)
          </h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="sonnet-summary" checked={useSonnet} onCheckedChange={setUseSonnet} />
              <Label htmlFor="sonnet-summary" className="text-xs cursor-pointer">
                Usar Sonnet
              </Label>
            </div>
            <Button
              onClick={handleGenerateSummary}
              disabled={isGenerating || evidence.length === 0}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Gerar Sumário de Conformidade
            </Button>
          </div>
        </div>

        {summary && (
          <Card className="bg-purple-50/50 border-purple-200 shadow-sm animate-fade-in-up">
            <CardContent className="p-4 prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {summary}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
