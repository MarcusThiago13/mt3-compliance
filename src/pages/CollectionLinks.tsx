import { useEffect, useState } from 'react'
import {
  Link as LinkIcon,
  Loader2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Ban,
  Clock,
  ExternalLink,
  Plus,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { collectionService } from '@/services/collection'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useAuth } from '@/hooks/use-auth'

export default function CollectionLinks() {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // New link modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tenants, setTenants] = useState<any[]>([])
  const [selectedTenant, setSelectedTenant] = useState('')
  const [formType, setFormType] = useState('onboarding')
  const [validity, setValidity] = useState(3)
  const [isGenerating, setIsGenerating] = useState(false)
  const [newLink, setNewLink] = useState('')

  const { user } = useAuth()

  const fetchTokens = async () => {
    setLoading(true)
    try {
      const data = await collectionService.getTokens()
      setTokens(data || [])
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const fetchTenants = async () => {
    const { data } = await supabase.from('tenants').select('id, name').order('name')
    if (data) setTenants(data)
  }

  useEffect(() => {
    fetchTokens()
    fetchTenants()
  }, [])

  const handleCopy = (token: string, id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/f/${token}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast({ title: 'Copiado', description: 'Link copiado para a área de transferência.' })
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Tem certeza que deseja revogar este link? O cliente não poderá mais acessá-lo.'))
      return
    try {
      await collectionService.revokeToken(id)
      toast({ title: 'Link Revogado', description: 'O acesso foi bloqueado com sucesso.' })
      fetchTokens()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const handleGenerate = async () => {
    if (!selectedTenant) {
      toast({ title: 'Atenção', description: 'Selecione uma organização.', variant: 'destructive' })
      return
    }
    setIsGenerating(true)
    try {
      const token = await collectionService.generateToken(
        selectedTenant,
        formType,
        validity,
        user?.id,
      )
      setNewLink(`${window.location.origin}/f/${token}`)
      fetchTokens()
      toast({ title: 'Link Gerado', description: 'Novo link de coleta criado.' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setIsGenerating(false)
    }
  }

  const getStatus = (t: any) => {
    if (t.is_revoked)
      return {
        label: 'Revogado',
        color: 'bg-destructive/10 text-destructive border-destructive/20',
        icon: Ban,
      }
    if (t.is_used)
      return {
        label: 'Utilizado',
        color: 'bg-success/10 text-success border-success/20',
        icon: CheckCircle2,
      }
    if (new Date(t.expires_at) < new Date())
      return { label: 'Expirado', color: 'bg-muted text-muted-foreground', icon: Clock }
    return {
      label: 'Pendente',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      icon: AlertCircle,
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <LinkIcon className="h-8 w-8" /> Painel de Links de Coleta
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão centralizada de formulários externos enviados aos clientes (Uso Único).
          </p>
        </div>

        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open)
            if (!open) setNewLink('')
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Link de Coleta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerar Novo Link Externo</DialogTitle>
              <DialogDescription>
                Selecione o cliente e o módulo para gerar um link de preenchimento seguro.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!newLink ? (
                <>
                  <div className="space-y-2">
                    <Label>Organização / Cliente</Label>
                    <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente..." />
                      </SelectTrigger>
                      <SelectContent>
                        {tenants.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Formulário / Módulo</Label>
                    <Select value={formType} onValueChange={setFormType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onboarding">
                          Perfil da Organização (Onboarding)
                        </SelectItem>
                        <SelectItem value="context">Contexto da Organização (SWOT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Validade (Dias)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={validity}
                      onChange={(e) => setValidity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LinkIcon className="mr-2 h-4 w-4" />
                    )}
                    Gerar Link Seguro
                  </Button>
                </>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <p className="text-emerald-800 font-medium mb-2 flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5" /> Link gerado e pronto para envio!
                    </p>
                    <div className="flex gap-2">
                      <Input value={newLink} readOnly className="font-mono text-xs bg-white" />
                      <Button
                        variant="secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(newLink)
                          toast({ title: 'Copiado', description: 'Link copiado com sucesso!' })
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setNewLink('')
                      setIsModalOpen(false)
                    }}
                  >
                    Fechar
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Links</CardTitle>
          <CardDescription>Acompanhe os envios, validades e submissões recebidas.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <LinkIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Nenhum link de coleta foi gerado ainda.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organização</TableHead>
                  <TableHead>Módulo / Form</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map((t) => {
                  const status = getStatus(t)
                  const StatusIcon = status.icon
                  const isActive = status.label === 'Pendente'
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium text-primary">
                        {t.tenants?.name || 'Desconhecida'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="uppercase text-[10px]">
                          {t.form_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(t.expires_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`border-transparent ${status.color} font-medium`}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" /> {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isActive && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Copiar Link"
                                onClick={() => handleCopy(t.token, t.id)}
                              >
                                {copiedId === t.id ? (
                                  <CheckCircle2 className="h-4 w-4 text-success" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10"
                                title="Revogar Acesso"
                                onClick={() => handleRevoke(t.id)}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {!isActive && (
                            <Button variant="ghost" size="icon" disabled>
                              <ExternalLink className="h-4 w-4 opacity-30" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
