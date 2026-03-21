import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, Plus, Sparkles, UserCheck } from 'lucide-react'
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
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { callAnthropicMessage } from '@/lib/anthropic'
import { toast } from '@/hooks/use-toast'

export function InternalDD() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [declarations, setDeclarations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState<string | null>(null)

  const [isNewOpen, setIsNewOpen] = useState(false)
  const [name, setName] = useState('')
  const [hasConflict, setHasConflict] = useState(false)
  const [details, setDetails] = useState('')

  const fetchDeclarations = async () => {
    if (!tenantId) return
    setLoading(true)
    try {
      const data = await ddService.getDeclarations(tenantId)
      setDeclarations(data)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeclarations()
  }, [tenantId])

  const handleSave = async () => {
    if (!name || !tenantId) return
    try {
      await ddService.createDeclaration({
        tenant_id: tenantId,
        employee_name: name,
        year: new Date().getFullYear(),
        has_conflict: hasConflict,
        details_json: { description: details },
        status: hasConflict ? 'Em Análise' : 'Aprovado',
      })
      toast({ title: 'Sucesso', description: 'Declaração registrada.' })
      setIsNewOpen(false)
      setName('')
      setHasConflict(false)
      setDetails('')
      fetchDeclarations()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const handleAI = async (dec: any) => {
    setAiLoading(dec.id)
    try {
      const prompt = `Aja como Especialista em Compliance. O colaborador ${dec.employee_name} declarou conflito de interesse com os detalhes: "${dec.details_json?.description || 'Nenhum detalhe'}". Recomende mitigação (ISO 37301) em um parágrafo direto.`
      const res = await callAnthropicMessage(prompt)
      toast({ title: 'Análise de Conflito (IA)', description: res, duration: 8000 })
    } catch (e: any) {
      toast({ title: 'Erro de IA', description: e.message, variant: 'destructive' })
    } finally {
      setAiLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'Aprovado')
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
          Sem Conflito
        </Badge>
      )
    if (status === 'Em Análise')
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">
          Em Análise
        </Badge>
      )
    return <Badge variant="secondary">{status}</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/20 p-4 rounded-lg border gap-4">
        <div>
          <h3 className="font-bold text-lg text-primary">Due Diligence Interna</h3>
          <p className="text-sm text-muted-foreground">
            Monitoramento e declarações anuais de Conflito de Interesses dos colaboradores.
          </p>
        </div>
        <Button onClick={() => setIsNewOpen(true)} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Registrar Declaração
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
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Situação Declarada</TableHead>
                  <TableHead>Status / Risco</TableHead>
                  <TableHead className="text-right">Motor de IA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {declarations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Nenhuma declaração encontrada.
                    </TableCell>
                  </TableRow>
                )}
                {declarations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-semibold text-primary flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" /> {d.employee_name}
                    </TableCell>
                    <TableCell>{d.year}</TableCell>
                    <TableCell>
                      {d.has_conflict ? (
                        <div
                          className="text-sm max-w-[250px] truncate text-muted-foreground"
                          title={d.details_json?.description}
                        >
                          {d.details_json?.description}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Nada a declarar</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(d.status)}</TableCell>
                    <TableCell className="text-right">
                      {d.has_conflict && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAI(d)}
                          disabled={aiLoading === d.id}
                          className="h-8 text-[11px] text-purple-700 border-purple-200 hover:bg-purple-50"
                        >
                          {aiLoading === d.id ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <Sparkles className="mr-1 h-3 w-3" />
                          )}
                          Cruzar Dados
                        </Button>
                      )}
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
            <DialogTitle>Registrar Declaração</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Colaborador / Cargo</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva (Gerente)"
              />
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <Label>Possui Conflito de Interesses?</Label>
              <Switch checked={hasConflict} onCheckedChange={setHasConflict} />
            </div>
            {hasConflict && (
              <div className="space-y-2 animate-fade-in">
                <Label>Detalhes do Conflito</Label>
                <Textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Descreva as empresas ou pessoas relacionadas..."
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Declaração</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
