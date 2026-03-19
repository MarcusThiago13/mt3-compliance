import {
  UploadCloud,
  File,
  Trash2,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { IsoClause } from '@/lib/iso-data'
import { callAnthropicMessage } from '@/lib/anthropic'

export function EvidenceTab({ clause }: { clause?: IsoClause }) {
  const [summary, setSummary] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [useSonnet, setUseSonnet] = useState(false)

  const handleGenerateSummary = async () => {
    setIsGenerating(true)
    // Simulando a extração do texto de um PDF anexado
    const extractedText =
      'Conteúdo extraído do PDF (Simulado): Política de Compliance v1. O documento estabelece as diretrizes de conduta da organização e o comprometimento da alta direção com as obrigações legais em conformidade com o exigido na norma.'
    const prompt = `Gere um sumário de conformidade cruzando o documento anexado com os requisitos do item ${clause?.id} - ${clause?.title}. Texto extraído do documento: "${extractedText}"`

    const response = await callAnthropicMessage(prompt, 1024, useSonnet)
    setSummary(response)
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
        <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-sm">Arraste arquivos ou clique para upload</h3>
        <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, Imagens (Max 10MB)</p>
        <Button variant="secondary" size="sm" className="mt-4">
          Selecionar Arquivo
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 grid gap-1.5">
          <Label htmlFor="link">Link Externo de Evidência</Label>
          <div className="flex gap-2">
            <Input id="link" placeholder="https://sharepoint..." className="flex-1" />
            <Button variant="outline">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        <h4 className="text-sm font-semibold">Evidências Anexadas</h4>
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-md bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded">
                <File className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Politica_v{i}.pdf</p>
                <p className="text-xs text-muted-foreground">Anexado por Admin em 12/10/2023</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" /> Análise de Conformidade (AI)
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
              disabled={isGenerating}
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
