import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, FileText, Loader2, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { aiService } from '@/services/ai'

export default function DocumentEditor() {
  const { tenantId, docId } = useParams<{ tenantId: string; docId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [askingAi, setAskingAi] = useState(false)
  const [document, setDocument] = useState<any>(null)

  useEffect(() => {
    const fetchDoc = async () => {
      if (docId === 'new') {
        setDocument({ title: 'Novo Documento de Compliance', content: '' })
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('compliance_documents')
        .select('*')
        .eq('id', docId)
        .single()
      if (data) setDocument(data)
      setLoading(false)
    }
    if (docId) fetchDoc()
  }, [docId])

  const handleSave = async () => {
    setSaving(true)
    if (docId === 'new') {
      const { data, error } = await supabase
        .from('compliance_documents')
        .insert({
          tenant_id: tenantId!,
          title: document.title,
          content: document.content,
          status: 'draft',
          version: 1,
        })
        .select()
        .single()

      if (error) {
        toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      } else {
        toast({ title: 'Sucesso', description: 'Documento criado.' })
        navigate(`/${tenantId}/documents/${data.id}`, { replace: true })
      }
    } else {
      const { error } = await supabase
        .from('compliance_documents')
        .update({
          title: document.title,
          content: document.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', docId)

      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else toast({ title: 'Sucesso', description: 'Documento atualizado.' })
    }
    setSaving(false)
  }

  const handleAIAssist = async () => {
    setAskingAi(true)
    try {
      const response = await aiService.chat(
        `Atue como um redator de compliance experiente e DPO (baseado na ISO 37301 e LGPD). Melhore, complete e formate o seguinte documento em markdown para uso corporativo oficial:\n\nTítulo: ${document.title}\nConteúdo atual:\n${document.content || '(Vazio)'}\n\nPor favor, mantenha o tom formal, inclua as seções necessárias, cláusulas padrão e estruture adequadamente. Retorne APENAS o markdown final do documento, sem introduções ou saudações.`,
        [],
        { persona: 'Compliance', tenantId },
      )

      let newContent = response.message
      if (newContent.startsWith('```markdown')) {
        newContent = newContent.replace(/^```markdown\n/, '').replace(/\n```$/, '')
      } else if (newContent.startsWith('```')) {
        newContent = newContent.replace(/^```\n/, '').replace(/\n```$/, '')
      }

      setDocument({ ...document, content: newContent })
      toast({
        title: 'IA Concluída',
        description: 'O documento foi gerado/aprimorado. Revise antes de salvar.',
      })
    } catch (e: any) {
      toast({ title: 'Erro da IA', description: e.message, variant: 'destructive' })
    } finally {
      setAskingAi(false)
    }
  }

  if (loading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    )

  if (!document)
    return <div className="p-8 text-center text-muted-foreground">Documento não encontrado.</div>

  return (
    <div className="space-y-4 animate-fade-in pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
            <Input
              value={document.title}
              onChange={(e) => setDocument({ ...document, title: e.target.value })}
              className="font-bold text-lg border-transparent hover:border-input focus-visible:ring-1 bg-transparent px-2"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={handleAIAssist}
            disabled={askingAi}
            className="flex-1 sm:flex-none text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
          >
            {askingAi ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            IA Assistiva
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none">
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <div className="min-h-[65vh] border rounded-lg shadow-sm bg-white overflow-hidden flex flex-col">
        <div className="bg-slate-50 border-b px-4 py-2 text-xs font-medium text-slate-500 flex justify-between">
          <span>Editor Markdown Integrado</span>
          {document.updated_at && (
            <span>Última alteração: {new Date(document.updated_at).toLocaleString('pt-BR')}</span>
          )}
        </div>
        <Textarea
          value={document.content}
          onChange={(e) => setDocument({ ...document, content: e.target.value })}
          className="flex-1 min-h-[65vh] w-full p-6 border-0 focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
          placeholder="Escreva o conteúdo do documento aqui ou clique em IA Assistiva para gerar um rascunho inicial baseado no título..."
        />
      </div>
    </div>
  )
}
