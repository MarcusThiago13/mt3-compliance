import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Library, Loader2, Plus, FileText, BrainCircuit, Calendar, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { documentService } from '@/services/documents'
import { generateComplianceDocument } from '@/lib/anthropic'
import { toast } from '@/hooks/use-toast'

export default function TenantDocuments() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('list')
  const [documents, setDocuments] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Generator State
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [title, setTitle] = useState('')
  const [audience, setAudience] = useState('')
  const [confidentiality, setConfidentiality] = useState('')
  const [period, setPeriod] = useState('')
  const [instructions, setInstructions] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchData = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      const [docs, tpls] = await Promise.all([
        documentService.getDocuments(tenantId),
        documentService.getTemplates(tenantId),
      ])
      setDocuments(docs)
      setTemplates(tpls)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tenantId])

  const handleGenerate = async () => {
    if (!selectedTemplate || !title || !tenantId) {
      toast({
        title: 'Atenção',
        description: 'Selecione um template e defina um título para o documento.',
        variant: 'destructive',
      })
      return
    }

    const tpl = templates.find((t) => t.id === selectedTemplate)
    setIsGenerating(true)
    try {
      const content = await generateComplianceDocument(tenantId, tpl, {
        title,
        audience,
        confidentiality,
        period_ref: period,
        additional_instructions: instructions,
      })

      const newDoc = await documentService.createDocument({
        tenant_id: tenantId,
        template_id: tpl.id,
        title,
        content,
        audience,
        confidentiality,
        period_ref: period,
        status: 'draft',
      })

      toast({
        title: 'Documento Gerado',
        description: 'A minuta inicial foi produzida com sucesso pelo motor de IA.',
      })
      navigate(`/${tenantId}/documents/${newDoc.id}`)
    } catch (e: any) {
      toast({ title: 'Erro na Geração', description: e.message, variant: 'destructive' })
    } finally {
      setIsGenerating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Rascunho</Badge>
      case 'review':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">
            Em Revisão
          </Badge>
        )
      case 'approved':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">
            Aprovado
          </Badge>
        )
      case 'emitted':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
            Emitido Oficial
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
            <Library className="h-8 w-8" /> Documentos Inteligentes
          </h1>
          <p className="text-muted-foreground mt-1">
            Motor de elaboração documental e relatórios de compliance com RAG isolado.
          </p>
        </div>
        <Button onClick={() => setActiveTab('new')}>
          <Plus className="mr-2 h-4 w-4" /> Novo Documento (IA)
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md h-auto p-1">
          <TabsTrigger value="list" className="py-2">
            Meus Documentos
          </TabsTrigger>
          <TabsTrigger value="new" className="py-2">
            Gerador
          </TabsTrigger>
          <TabsTrigger value="templates" className="py-2">
            Biblioteca
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6 outline-none">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Documentos</CardTitle>
              <CardDescription>
                Rastreabilidade de todas as minutas e relatórios gerados nesta organização.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12 text-primary">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>Nenhum documento gerado ainda.</p>
                  <Button variant="link" onClick={() => setActiveTab('new')}>
                    Começar a primeira elaboração
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Template Base</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Versão</TableHead>
                      <TableHead className="text-right">Última Atualização</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow
                        key={doc.id}
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => navigate(`/${tenantId}/documents/${doc.id}`)}
                      >
                        <TableCell className="font-semibold text-primary">{doc.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {doc.template?.name || 'Personalizado'}
                        </TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell className="text-center font-mono text-xs text-muted-foreground">
                          v{doc.version}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(doc.updated_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="mt-6 outline-none">
          <Card className="border-t-4 border-t-purple-500 shadow-md">
            <CardHeader className="bg-purple-50/30">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <BrainCircuit className="h-5 w-5" /> Motor de Geração Documental (RAG)
              </CardTitle>
              <CardDescription>
                A Inteligência Artificial irá analisar os dados cadastrados neste tenant para
                preencher o template selecionado de forma confiável e sem invenções.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 md:col-span-2">
                  <Label>Template Base *</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="h-12 border-primary/20 bg-primary/5">
                      <SelectValue placeholder="Selecione o modelo estrutural desejado..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.category} - {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Título do Documento *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Relatório Anual 2026"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Período de Referência</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      placeholder="Ex: Exercício 2025"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Audiência Alvo</Label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Opcional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta Direção (Executiva)">
                        Alta Direção / Conselho
                      </SelectItem>
                      <SelectItem value="Público Externo (Institucional)">
                        Público Externo
                      </SelectItem>
                      <SelectItem value="Técnico/Operacional">
                        Equipe Técnica / Operacional
                      </SelectItem>
                      <SelectItem value="Órgãos Fiscalizadores">
                        Regulador / Fiscalização
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Nível de Confidencialidade</Label>
                  <Select value={confidentiality} onValueChange={setConfidentiality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Opcional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Público">Público (Sem restrições)</SelectItem>
                      <SelectItem value="Interno">Interno (Somente Colaboradores)</SelectItem>
                      <SelectItem value="Restrito">Restrito (Áreas específicas)</SelectItem>
                      <SelectItem value="Confidencial Estratégico">
                        Confidencial (Alta Direção)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label>Instruções Adicionais para a IA (Opcional)</Label>
                  <Textarea
                    rows={4}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Ex: Focar na análise do processo de fusão, dar ênfase aos gaps de treinamento, usar tom mais severo, etc..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto shadow-md"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analisando Dados do Tenant e
                      Gerando...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="mr-2 h-5 w-5" /> Iniciar Elaboração Inteligente
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6 outline-none">
          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((t) => (
              <Card key={t.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-bold text-slate-800">{t.name}</CardTitle>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {t.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{t.description}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedTemplate(t.id)
                      setActiveTab('new')
                    }}
                  >
                    Usar este Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
