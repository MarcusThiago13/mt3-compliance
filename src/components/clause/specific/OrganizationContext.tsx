import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Download, Loader2, FileText, Sparkles, Save } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { complianceService } from '@/services/compliance'
import { callAnthropicMessage } from '@/lib/anthropic'
import { exportToText } from '@/lib/export'
import { supabase } from '@/lib/supabase/client'
import { GenerateLinkModal } from '@/components/shared/GenerateLinkModal'

export function OrganizationContext() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [profileReport, setProfileReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [orgContext, setOrgContext] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [externalIssues, setExternalIssues] = useState<Record<string, string>>({
    Regulatório: '',
    Legal: '',
    Econômico: '',
    Político: '',
    Social: '',
    Cultural: '',
    Ambiental: '',
  })

  const [internalIssues, setInternalIssues] = useState<Record<string, string>>({
    'Estrutura Organizacional': '',
    Governança: '',
    'Políticas e Objetivos': '',
    'Processos Operacionais': '',
    'Recursos (Humanos, Fin, Tech)': '',
    'Maturidade de TI': '',
  })

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const reports = await complianceService.getProfileReports(tenantId)
        if (reports && reports.length > 0) setProfileReport(reports[0])

        if (tenantId) {
          const { data } = await supabase
            .from('tenants')
            .select('context_data')
            .eq('id', tenantId)
            .single()
          if (data?.context_data) {
            const ctx = data.context_data as any
            if (ctx.externalIssues) setExternalIssues(ctx.externalIssues)
            if (ctx.internalIssues) setInternalIssues(ctx.internalIssues)
            if (ctx.orgContext) setOrgContext(ctx.orgContext)
          }
        }
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchData()
  }, [tenantId])

  const handleSave = useCallback(async () => {
    if (!tenantId) return
    setIsSaving(true)
    try {
      await supabase
        .from('tenants')
        .update({
          context_data: { externalIssues, internalIssues, orgContext },
        })
        .eq('id', tenantId)
    } catch (e) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }, [tenantId, externalIssues, internalIssues, orgContext])

  useEffect(() => {
    if (loading) return
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      handleSave()
    }, 2000)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [externalIssues, internalIssues, orgContext])

  const exportReport = () => {
    let content = `RELATÓRIO DE CONTEXTO DA ORGANIZAÇÃO\nGerado em: ${new Date().toLocaleString()}\n\n`
    if (profileReport) content += `--- PERFIL DE INTEGRIDADE ---\n${profileReport.content}\n\n`
    content += `--- QUESTÕES EXTERNAS ---\n`
    Object.entries(externalIssues).forEach(
      ([k, v]) => (content += `${k}: ${v || 'Não preenchido'}\n`),
    )
    content += `\n--- QUESTÕES INTERNAS ---\n`
    Object.entries(internalIssues).forEach(
      ([k, v]) => (content += `${k}: ${v || 'Não preenchido'}\n`),
    )

    exportToText(`contexto_organizacao_${tenantId}_${Date.now()}`, content)
    toast({ title: 'Relatório Exportado', description: 'O Contexto da Organização foi baixado.' })
  }

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    try {
      const prompt = `Contexto da Organização: "${orgContext}". 
Gere uma análise de questões internas e externas (Matriz SWOT) aplicáveis a um sistema de gestão de compliance ISO 37301 considerando este contexto.
Retorne APENAS um objeto JSON estrito (sem formatação markdown) com a estrutura:
{"external":{"Regulatório":"","Legal":"","Econômico":"","Político":"","Social":"","Cultural":"","Ambiental":""},"internal":{"Estrutura Organizacional":"","Governança":"","Políticas e Objetivos":"","Processos Operacionais":"","Recursos (Humanos, Fin, Tech)":"","Maturidade de TI":""}}`

      const response = await callAnthropicMessage(prompt, 1024, false, tenantId)

      // Robust JSON extraction to prevent crashes if Anthropic adds markdown or preambles
      let jsonStr = response
      const jsonBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (jsonBlockMatch) {
        jsonStr = jsonBlockMatch[1]
      } else {
        const curlyMatch = response.match(/\{[\s\S]*\}/)
        if (curlyMatch) jsonStr = curlyMatch[0]
      }

      const data = JSON.parse(jsonStr)

      if (data) {
        if (data.external) setExternalIssues((prev) => ({ ...prev, ...data.external }))
        if (data.internal) setInternalIssues((prev) => ({ ...prev, ...data.internal }))
        toast({ title: 'Análise Gerada', description: 'Matriz SWOT preenchida com IA.' })
      }
    } catch (e) {
      toast({
        title: 'Erro de IA',
        description: 'Não foi possível gerar a análise. A IA retornou um formato inesperado.',
        variant: 'destructive',
      })
    }
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Contexto da Organização (SWOT e Cultura)
            {isSaving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />}
          </h3>
          <p className="text-sm text-muted-foreground">
            Mapeamento de questões internas, externas e ambiente de compliance.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {tenantId && <GenerateLinkModal tenantId={tenantId} formType="context" />}
          <Button onClick={exportReport} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : profileReport ? (
        <Card className="mb-6 border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Relatório de Perfil de Integridade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {profileReport.content}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-purple-200 bg-purple-50/50 shadow-sm mb-6">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-md flex items-center gap-2 text-purple-800">
              <Sparkles className="h-5 w-5" /> Motor de IA: Matriz SWOT
            </CardTitle>
            <CardDescription className="text-purple-700/70 max-w-2xl text-xs sm:text-sm">
              Descreva o cenário atual da organização (setor, porte, desafios) para que o Claude
              preencha automaticamente as questões.
            </CardDescription>
          </div>
          <Button
            onClick={handleGenerateAI}
            disabled={isGenerating || !orgContext.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap w-full sm:w-auto"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? 'Analisando...' : 'Preencher SWOT com IA'}
          </Button>
        </CardHeader>
        <CardContent>
          <Textarea
            value={orgContext}
            onChange={(e) => setOrgContext(e.target.value)}
            placeholder="Ex: Atuamos no setor financeiro, nossa cultura é focada em inovação..."
            className="bg-white/80 border-purple-100 min-h-[80px]"
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="external">
        <TabsList className="mb-4 w-full flex overflow-x-auto justify-start sm:justify-center">
          <TabsTrigger value="external">Questões Externas</TabsTrigger>
          <TabsTrigger value="internal">Questões Internas</TabsTrigger>
          <TabsTrigger value="culture">Cultura de Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="external" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.keys(externalIssues).map((topic) => (
              <Card key={topic}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{topic}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <Textarea
                    value={externalIssues[topic]}
                    onChange={(e) =>
                      setExternalIssues((prev) => ({ ...prev, [topic]: e.target.value }))
                    }
                    placeholder={`Descreva ameaças e oportunidades do ambiente ${topic.toLowerCase()}...`}
                    className="min-h-[80px] text-sm"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="internal" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.keys(internalIssues).map((topic) => (
              <Card key={topic}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{topic}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <Textarea
                    value={internalIssues[topic]}
                    onChange={(e) =>
                      setInternalIssues((prev) => ({ ...prev, [topic]: e.target.value }))
                    }
                    placeholder={`Descreva forças e fraquezas relacionadas a ${topic.toLowerCase()}...`}
                    className="min-h-[80px] text-sm"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="culture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Avaliação Qualitativa do Ambiente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Apoio da Alta Direção (Tone at the Top)</Label>
                  <span className="text-sm font-bold text-primary">80%</span>
                </div>
                <Slider defaultValue={[80]} max={100} step={1} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Percepção de Integridade pelos Colaboradores</Label>
                  <span className="text-sm font-bold text-primary">65%</span>
                </div>
                <Slider defaultValue={[65]} max={100} step={1} />
              </div>
              <div className="pt-4 border-t">
                <Label className="mb-2 block">Parecer Geral da Cultura</Label>
                <Textarea placeholder="Resumo analítico do ambiente de compliance..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
