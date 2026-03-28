import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  History,
  FileText,
  SplitSquareHorizontal,
  GitCommit,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { documentService } from '@/services/documents'
import { toast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function myersDiff(a: string[], b: string[]) {
  const n = a.length
  const m = b.length
  const max = n + m
  const v: Record<number, number> = { 1: 0 }
  const trace: Record<number, number>[] = []

  for (let d = 0; d <= max; d++) {
    trace.push({ ...v })
    for (let k = -d; k <= d; k += 2) {
      let x
      if (k === -d || (k !== d && v[k - 1] < v[k + 1])) {
        x = v[k + 1]
      } else {
        x = v[k - 1] + 1
      }
      let y = x - k
      while (x < n && y < m && a[x] === b[y]) {
        x++
        y++
      }
      v[k] = x
      if (x >= n && y >= m) {
        const result = []
        let currX = n
        let currY = m
        for (let d2 = d; d2 >= 0; d2--) {
          const v2 = trace[d2]
          const k2 = currX - currY
          let prevK
          if (k2 === -d2 || (k2 !== d2 && v2[k2 - 1] < v2[k2 + 1])) {
            prevK = k2 + 1
          } else {
            prevK = k2 - 1
          }
          const prevX = v2[prevK]
          const prevY = prevX - prevK
          while (currX > prevX && currY > prevY) {
            result.push({ type: 'unchanged', value: a[currX - 1] })
            currX--
            currY--
          }
          if (d2 > 0) {
            if (currX === prevX) {
              result.push({ type: 'added', value: b[currY - 1] })
              currY--
            } else {
              result.push({ type: 'removed', value: a[currX - 1] })
              currX--
            }
          }
        }
        return result.reverse()
      }
    }
  }
  return []
}

export default function DocumentEditor() {
  const { tenantId, docId } = useParams<{ tenantId: string; docId: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [doc, setDoc] = useState<any>(null)
  const [versions, setVersions] = useState<any[]>([])

  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')
  const [content, setContent] = useState('')
  const [changeReason, setChangeReason] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [v1Id, setV1Id] = useState<string>('')
  const [v2Id, setV2Id] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [docId])

  const fetchData = async () => {
    if (!docId) return
    try {
      setLoading(true)
      const d = await documentService.getDocument(docId)
      const v = await documentService.getVersions(docId)
      setDoc(d)
      setTitle(d.title)
      setStatus(d.status)
      setContent(d.content)
      setVersions(v)

      if (v.length >= 2) {
        setV2Id(v[0].id)
        setV1Id(v[1].id)
      } else if (v.length === 1) {
        setV2Id(v[0].id)
        setV1Id(v[0].id)
      }
    } catch (e: any) {
      toast({ title: 'Erro ao carregar', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!changeReason.trim() && content !== doc.content) {
      toast({
        title: 'Atenção',
        description: 'É obrigatório informar o motivo da alteração para versionamento.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    try {
      await documentService.updateDocument(
        docId!,
        { title, status, content },
        content !== doc.content ? changeReason : undefined,
      )
      toast({ title: 'Sucesso', description: 'Documento atualizado com sucesso.' })
      setChangeReason('')
      await fetchData()
    } catch (e: any) {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const diffLines = useMemo(() => {
    if (!v1Id || !v2Id || versions.length === 0) return []
    const oldV = versions.find((x) => x.id === v1Id)?.content || ''
    const newV = versions.find((x) => x.id === v2Id)?.content || ''
    return myersDiff(oldV.split('\n'), newV.split('\n'))
  }, [v1Id, v2Id, versions])

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse max-w-5xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl mx-auto mt-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to={`/${tenantId}/documents`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" /> Editor de Compliance
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              v{doc.version} • Última mod: {format(parseISO(doc.updated_at), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="editor">
            <FileText className="w-4 h-4 mr-2" /> Edição
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" /> Histórico
          </TabsTrigger>
          <TabsTrigger value="compare">
            <SplitSquareHorizontal className="w-4 h-4 mr-2" /> Comparar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle>Conteúdo do Documento</CardTitle>
              <CardDescription>
                Edite o texto e registre o motivo para criar uma nova versão auditável.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 space-y-2">
                  <Label>Título Oficial</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="font-semibold text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="review">Em Revisão</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="emitted">Emitido Oficial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Texto do Documento</Label>
                <Textarea
                  className="min-h-[400px] font-mono text-sm leading-relaxed p-4 bg-slate-50 focus:bg-white transition-colors"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-100/50 p-4 rounded-lg border border-slate-200">
                <div className="flex-1 w-full space-y-2">
                  <Label className="text-slate-700 font-semibold">
                    Motivo da Modificação (Changelog)
                  </Label>
                  <Input
                    placeholder="Ex: Adequação à nova portaria, revisão ortográfica..."
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  size="lg"
                  className="w-full md:w-auto shrink-0"
                >
                  <Save className="w-4 h-4 mr-2" />{' '}
                  {isSaving ? 'Salvando...' : 'Salvar Nova Versão'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-primary" /> Trilha de Auditoria Documental
              </CardTitle>
              <CardDescription>
                Histórico imutável de todas as edições realizadas neste documento de compliance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                {versions.map((v, i) => (
                  <div key={v.id} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-white" />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <Badge variant={i === 0 ? 'default' : 'secondary'} className="font-mono">
                          v{v.version_number}
                        </Badge>
                        <span className="text-sm font-semibold text-slate-800">
                          {format(parseISO(v.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="font-semibold text-slate-700 mr-2">Motivo:</span>
                        {v.change_reason || 'Atualização de sistema'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Search className="w-3 h-3" />
                        Autor: {v.user?.email || 'Sistema (IA)'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare" className="mt-6">
          <Card className="shadow-sm border-t-4 border-t-blue-500">
            <CardHeader className="bg-blue-50/30">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <SplitSquareHorizontal className="h-5 w-5" /> Análise de Alterações (Diff)
              </CardTitle>
              <CardDescription>
                Compare visualmente as adições e remoções entre dois snapshots históricos do
                documento.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border">
                <div className="space-y-2">
                  <Label className="text-red-700 font-semibold">
                    Versão Original (Remoções em vermelho)
                  </Label>
                  <Select value={v1Id} onValueChange={setV1Id}>
                    <SelectTrigger className="bg-white border-red-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          v{v.version_number} - {format(parseISO(v.created_at), 'dd/MM/yy HH:mm')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-emerald-700 font-semibold">
                    Versão Nova (Adições em verde)
                  </Label>
                  <Select value={v2Id} onValueChange={setV2Id}>
                    <SelectTrigger className="bg-white border-emerald-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          v{v.version_number} - {format(parseISO(v.created_at), 'dd/MM/yy HH:mm')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="font-mono text-sm whitespace-pre-wrap leading-relaxed border rounded-lg bg-white overflow-hidden shadow-inner">
                {diffLines.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhuma diferença encontrada.
                  </div>
                ) : (
                  diffLines.map((block, i) => (
                    <div
                      key={i}
                      className={cn(
                        'px-4 py-1.5 flex items-start group hover:bg-slate-50/50 transition-colors',
                        {
                          'bg-red-50 text-red-900': block.type === 'removed',
                          'bg-emerald-50 text-emerald-900 border-l-2 border-emerald-500':
                            block.type === 'added',
                          'text-slate-600': block.type === 'unchanged',
                        },
                      )}
                    >
                      <span
                        className={cn('select-none mr-4 w-6 text-center font-bold', {
                          'text-emerald-600': block.type === 'added',
                          'text-red-600': block.type === 'removed',
                          'text-slate-300 opacity-50': block.type === 'unchanged',
                        })}
                      >
                        {block.type === 'added' ? '+' : block.type === 'removed' ? '-' : i + 1}
                      </span>
                      <span
                        className={cn('flex-1 break-words', {
                          'line-through opacity-70': block.type === 'removed',
                          'bg-emerald-100/50': block.type === 'added',
                        })}
                      >
                        {block.value || ' '}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
