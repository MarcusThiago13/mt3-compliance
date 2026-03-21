import { useState } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { RiskMatrix } from '../../shared/RiskMatrix'
import { Download, Plus, Sparkles, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { callAnthropicMessage } from '@/lib/anthropic'

const initialRisksData = [
  {
    id: 'R01',
    cat: 'Fraude',
    event: 'Pagamento indevido',
    controls: 'Aprovação dupla',
    i: 4,
    p: 3,
    ri: 2,
    rp: 2,
    treat: 'Mitigar',
  },
  {
    id: 'R02',
    cat: 'Corrupção',
    event: 'Propina a agente',
    controls: 'Due Diligence',
    i: 5,
    p: 2,
    ri: 5,
    rp: 4,
    treat: 'Evitar',
  },
  {
    id: 'R03',
    cat: 'Trabalhista',
    event: 'Assédio moral',
    controls: 'Treinamento, Canal',
    i: 3,
    p: 4,
    ri: 2,
    rp: 2,
    treat: 'Mitigar',
  },
]

export function RiskAssessment() {
  const [view, setView] = useState('inherent')
  const [risksData, setRisksData] = useState<any[]>(initialRisksData)
  const [orgContext, setOrgContext] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSuggestRisks = async () => {
    setIsGenerating(true)
    try {
      const prompt = `Contexto da empresa: "${orgContext}". 
Identifique 3 riscos críticos de compliance aplicáveis a este contexto (baseando-se na ISO 37301).
Retorne APENAS um array JSON estrito com esta estrutura de objetos:
[
  {
    "id": "AI-R0X",
    "cat": "Categoria do risco",
    "event": "Descrição do evento de risco",
    "controls": "Controles sugeridos",
    "i": 5,
    "p": 3,
    "ri": 2,
    "rp": 2,
    "treat": "Mitigar / Evitar / Aceitar",
    "isAi": true
  }
]
NÃO retorne nenhum texto além do JSON.`

      const response = await callAnthropicMessage(prompt)
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      const jsonStr = jsonMatch ? jsonMatch[0] : response

      const data = JSON.parse(jsonStr)
      if (data && Array.isArray(data)) {
        setRisksData((prev) => [...prev, ...data])
        toast({
          title: 'Riscos Sugeridos',
          description: 'Novos riscos foram mapeados pela IA e adicionados à tabela.',
        })
      }
    } catch (e) {
      console.error(e)
      toast({
        title: 'Erro de IA',
        description: 'Falha ao sugerir riscos. Verifique o contexto e tente novamente.',
        variant: 'destructive',
      })
    }
    setIsGenerating(false)
  }

  const matrixPoints = risksData.map((r) => ({
    id: r.id,
    i: view === 'inherent' ? r.i : r.ri,
    p: view === 'inherent' ? r.p : r.rp,
  }))

  const hasCritical = risksData.some((r) => r.ri >= 4 && r.rp >= 4)
  const aiSuggestion = hasCritical
    ? 'AI Risk Agent: Detectamos alta probabilidade de R02 (Corrupção) em operações recentes. Sugerimos elevar controles (8.1) e rever Impacto Residual.'
    : undefined

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Avaliação de Riscos de Compliance</h3>
          <p className="text-sm text-muted-foreground">
            Matriz de calor, análise inerente vs residual e tratamento.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Matriz
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Risco
          </Button>
        </div>
      </div>

      <Card className="border-purple-200 bg-purple-50/50 shadow-sm">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-md flex items-center gap-2 text-purple-800">
              <Sparkles className="h-5 w-5" /> Motor de IA: Análise de Riscos
            </CardTitle>
            <CardDescription className="text-purple-700/70 max-w-2xl text-xs sm:text-sm">
              Descreva o contexto da organização (setor, porte, desafios) ou cole trechos de
              documentos para que o Claude sugira riscos direcionados.
            </CardDescription>
          </div>
          <Button
            onClick={handleSuggestRisks}
            disabled={isGenerating || !orgContext.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap w-full sm:w-auto"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? 'Analisando...' : 'Mapear Riscos com IA'}
          </Button>
        </CardHeader>
        <CardContent>
          <Textarea
            value={orgContext}
            onChange={(e) => setOrgContext(e.target.value)}
            placeholder="Ex: Somos uma empresa de logística com 500 caminhões. Temos alto turnover e contratos diretos com estatais para transporte de insumos médicos..."
            className="bg-white/80 border-purple-100 min-h-[80px]"
          />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Evento / Causa</TableHead>
                  <TableHead className="text-center">Inerente</TableHead>
                  <TableHead className="text-center">Residual</TableHead>
                  <TableHead>Tratamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risksData.map((r) => {
                  const scoreInerente = r.i * r.p
                  const scoreResidual = r.ri * r.rp
                  return (
                    <TableRow key={r.id} className={r.isAi ? 'bg-purple-50/40' : ''}>
                      <TableCell className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 pt-4">
                        {r.id}
                        {r.isAi && (
                          <Sparkles className="h-3 w-3 text-purple-600" title="Sugerido pela IA" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{r.event}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Cat: {r.cat}</div>
                        {r.isAi && (
                          <div className="text-[10px] text-purple-700/80 mt-1 flex items-center gap-1">
                            <strong>Controles sugeridos:</strong> {r.controls}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            scoreInerente > 10
                              ? 'bg-red-50 text-red-700'
                              : 'bg-orange-50 text-orange-700'
                          }
                        >
                          {scoreInerente} ({r.p}x{r.i})
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            scoreResidual <= 4
                              ? 'bg-green-50 text-green-700'
                              : scoreResidual >= 16
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-yellow-50 text-yellow-700'
                          }
                        >
                          {scoreResidual} ({r.rp}x{r.ri})
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md border shadow-sm">
                          {r.treat}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-muted/20 p-4 rounded-lg border">
          <Tabs value={view} onValueChange={setView} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="inherent">Inerente</TabsTrigger>
              <TabsTrigger value="residual">Residual</TabsTrigger>
            </TabsList>
            <div className="bg-white p-2 rounded border shadow-sm">
              <RiskMatrix points={matrixPoints} aiSuggestion={aiSuggestion} />
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
