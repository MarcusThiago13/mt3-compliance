import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, Plus, AlertTriangle, Search, Info } from 'lucide-react'
import { ddService } from '@/services/due-diligence'
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
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'

export function DDProcessTable({
  targetTypes,
  title,
  description,
}: {
  targetTypes: string[]
  title: string
  description: string
}) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [processes, setProcesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isNewOpen, setIsNewOpen] = useState(false)

  const [name, setName] = useState('')
  const [doc, setDoc] = useState('')
  const [type, setType] = useState(targetTypes[0])
  const [isReg, setIsReg] = useState(false)
  const [hasGov, setHasGov] = useState(false)
  const [hasHist, setHasHist] = useState(false)
  const [val, setVal] = useState('low')

  const [hasIntegrationPlan, setHasIntegrationPlan] = useState(false)
  const [hasLiabilities, setHasLiabilities] = useState(false)

  const fetchProcesses = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      const data = await ddService.getProcesses(tenantId, targetTypes)
      setProcesses(data)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProcesses()
  }, [tenantId, targetTypes])

  const handleSave = async () => {
    if (!name || !tenantId) return
    setSaving(true)
    try {
      let score = 0
      if (isReg) score += 3
      if (hasGov) score += 5
      if (hasHist) score += 4
      if (val === 'high') score += 5
      else if (val === 'medium') score += 3
      else score += 1

      if (type === 'M&A') {
        if (!hasIntegrationPlan) score += 3
        if (hasLiabilities) score += 4
      }

      const risk_level = score <= 4 ? 'Baixo' : score <= 9 ? 'Médio' : 'Alto'
      const dd_level = score <= 4 ? 'SDD' : score <= 9 ? 'CDD' : 'EDD'

      await ddService.createProcess({
        tenant_id: tenantId,
        target_type: type,
        target_name: name,
        target_document: doc,
        risk_score: score,
        risk_level,
        dd_level,
      })

      toast({
        title: 'Due Diligence Iniciada',
        description: `Nível de Risco: ${risk_level} | Processo: ${dd_level}`,
      })
      setIsNewOpen(false)
      setName('')
      setDoc('')
      setIsReg(false)
      setHasGov(false)
      setHasHist(false)
      setVal('low')
      setHasIntegrationPlan(false)
      setHasLiabilities(false)
      fetchProcesses()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const getRiskColor = (level: string) => {
    if (level === 'Alto') return 'bg-red-50 text-red-700 border-red-200'
    if (level === 'Médio') return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/20 p-4 rounded-lg border gap-4">
        <div>
          <h3 className="font-bold text-lg text-primary">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={() => setIsNewOpen(true)} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Novo Processo
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alvo / Documento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Risco Inicial</TableHead>
                  <TableHead>Nível DD</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Red Flags</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhum processo encontrado.
                    </TableCell>
                  </TableRow>
                )}
                {processes.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-semibold text-primary">{p.target_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.target_document || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.target_type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRiskColor(p.risk_level)}>
                        {p.risk_level} ({p.risk_score})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-800 border-slate-300 shadow-none hover:bg-slate-200">
                        {p.dd_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          p.status === 'Aprovado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status.includes('Análise')
                              ? 'bg-blue-100 text-blue-800'
                              : ''
                        }
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {p.dd_red_flags?.length > 0 ? (
                        <span className="flex items-center text-xs font-bold text-destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" /> {p.dd_red_flags.length} Flag(s)
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium flex items-center">
                          <Search className="h-3 w-3 mr-1" /> Limpo
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Search className="h-4 w-4 mr-1" /> Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Due Diligence</DialogTitle>
            <DialogDescription>
              Preencha os dados para cálculo automático do nível de risco (Risk Scoring).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome / Razão Social</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Tech Corp"
              />
            </div>
            <div className="space-y-2">
              <Label>Documento (CNPJ/CPF)</Label>
              <Input
                value={doc}
                onChange={(e) => setDoc(e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>
            {targetTypes.length > 1 && (
              <div className="space-y-2">
                <Label>Tipo de Terceiro</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {targetTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="border-t pt-4 mt-4 space-y-4">
              <h4 className="text-sm font-semibold text-primary">Matriz de Risco Inicial</h4>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Setor altamente regulado?</Label>
                <Switch checked={isReg} onCheckedChange={setIsReg} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">
                  Interação com Governo (PEP)?
                </Label>
                <Switch checked={hasGov} onCheckedChange={setHasGov} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Histórico de Mídia Adversa?</Label>
                <Switch checked={hasHist} onCheckedChange={setHasHist} />
              </div>
              <div className="space-y-2 pt-2">
                <Label className="text-sm text-muted-foreground">Volume Financeiro Estimado</Label>
                <Select value={val} onValueChange={setVal}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixo (Até R$ 50k)</SelectItem>
                    <SelectItem value="medium">Médio (R$ 50k - R$ 500k)</SelectItem>
                    <SelectItem value="high">Alto (Acima de R$ 500k)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {type === 'M&A' && (
              <div className="border-t pt-4 mt-4 space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-primary">Campos M&A</h4>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">
                    Plano de Integração (100 Dias) Definido?
                  </Label>
                  <Switch checked={hasIntegrationPlan} onCheckedChange={setHasIntegrationPlan} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">
                    Sucessão de Passivos Trabalhistas/Fiscais?
                  </Label>
                  <Switch checked={hasLiabilities} onCheckedChange={setHasLiabilities} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Avaliar e Iniciar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
