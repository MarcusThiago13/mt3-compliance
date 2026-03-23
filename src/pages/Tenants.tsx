import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Plus,
  Building2,
  MoreVertical,
  ShieldAlert,
  Loader2,
  Edit,
  Power,
  Trash2,
  Users,
  Link as LinkIcon,
  MessageCircle,
  FileText,
  History,
  Settings,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { useAppStore } from '@/stores/main'
import { useAuth } from '@/hooks/use-auth'
import { SendCommunicationModal } from '@/components/shared/SendCommunicationModal'

export default function Tenants() {
  const navigate = useNavigate()
  const { setActiveTenant } = useAppStore()
  const { user } = useAuth()

  const isAdmin =
    user?.email === 'admin@example.com' ||
    user?.email === 'marcusthiago.adv@gmail.com' ||
    user?.app_metadata?.role === 'admin' ||
    user?.user_metadata?.is_admin === true ||
    user?.user_metadata?.is_admin === 'true'

  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tenantToDelete, setTenantToDelete] = useState<any>(null)

  const [isNewTenantOpen, setIsNewTenantOpen] = useState(false)
  const [newTenantName, setNewTenantName] = useState('')
  const [newTenantCnpj, setNewTenantCnpj] = useState('')
  const [newTenantOrgType, setNewTenantOrgType] = useState('empresa')
  const [newTenantOrgSubtype, setNewTenantOrgSubtype] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const [isEditTenantOpen, setIsEditTenantOpen] = useState(false)
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null)
  const [editTenantName, setEditTenantName] = useState('')
  const [editTenantCnpj, setEditTenantCnpj] = useState('')
  const [editTenantOrgType, setEditTenantOrgType] = useState('empresa')
  const [editTenantOrgSubtype, setEditTenantOrgSubtype] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [emailTenantId, setEmailTenantId] = useState<string | undefined>(undefined)

  const fetchTenants = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setTenants(data)
    setLoading(false)
  }

  useEffect(() => {
    setActiveTenant(null)
    if (isAdmin) fetchTenants()
  }, [isAdmin])

  const handleToggleStatus = async (tenant: any) => {
    const newStatus = tenant.status === 'active' ? 'inactive' : 'active'
    const { error } = await supabase
      .from('tenants')
      .update({ status: newStatus } as any)
      .eq('id', tenant.id)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Sucesso',
        description: `Status alterado para ${newStatus === 'active' ? 'Ativo' : 'Inativo'}.`,
      })
      fetchTenants()
    }
  }

  const handleDelete = async () => {
    if (!tenantToDelete) return
    const { error } = await supabase.from('tenants').delete().eq('id', tenantToDelete.id)
    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível excluir.', variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Excluído com sucesso.' })
      fetchTenants()
    }
    setTenantToDelete(null)
  }

  const handleCreateTenant = async () => {
    if (!newTenantName) {
      toast({
        title: 'Atenção',
        description: 'O nome da organização é obrigatório.',
        variant: 'destructive',
      })
      return
    }
    setIsCreating(true)
    const { error } = await supabase.from('tenants').insert({
      name: newTenantName,
      cnpj: newTenantCnpj,
      status: 'active',
      org_type: newTenantOrgType,
      org_subtype: newTenantOrgSubtype || null,
    } as any)

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar o cliente.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Sucesso', description: 'Cliente criado e acesso vinculado com sucesso.' })
      setIsNewTenantOpen(false)
      setNewTenantName('')
      setNewTenantCnpj('')
      setNewTenantOrgType('empresa')
      setNewTenantOrgSubtype('')
      fetchTenants()
    }
    setIsCreating(false)
  }

  const openEditModal = (t: any) => {
    setEditingTenantId(t.id)
    setEditTenantName(t.name || '')
    setEditTenantCnpj(t.cnpj || '')
    setEditTenantOrgType(t.org_type || 'empresa')
    setEditTenantOrgSubtype(t.org_subtype || '')
    setIsEditTenantOpen(true)
  }

  const handleUpdateTenant = async () => {
    if (!editTenantName) {
      toast({
        title: 'Atenção',
        description: 'O nome da organização é obrigatório.',
        variant: 'destructive',
      })
      return
    }
    setIsUpdating(true)
    const { error } = await supabase
      .from('tenants')
      .update({
        name: editTenantName,
        cnpj: editTenantCnpj,
        org_type: editTenantOrgType,
        org_subtype: editTenantOrgSubtype || null,
      } as any)
      .eq('id', editingTenantId)

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a organização.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Sucesso',
        description: 'Configurações da organização atualizadas com sucesso.',
      })
      setIsEditTenantOpen(false)
      fetchTenants()
    }
    setIsUpdating(false)
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-fade-in">
        <div className="text-center space-y-4 max-w-sm">
          <ShieldAlert className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-bold text-foreground">Acesso Restrito</h2>
          <p className="text-muted-foreground">
            Apenas administradores globais podem gerenciar a lista de organizações do sistema.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestão de Clientes</h1>
          <p className="text-muted-foreground">Administração multi-tenant do sistema</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" asChild>
            <Link to="/collection-links">
              <LinkIcon className="mr-2 h-4 w-4" /> Links de Coleta
            </Link>
          </Button>
          <Dialog open={isNewTenantOpen} onOpenChange={setIsNewTenantOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Organização</DialogTitle>
                <DialogDescription>
                  Crie um novo ambiente isolado. O administrador atual será vinculado
                  automaticamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome da Organização *</Label>
                    <Input
                      value={newTenantName}
                      onChange={(e) => setNewTenantName(e.target.value)}
                      placeholder="Ex: Acme Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input
                      value={newTenantCnpj}
                      onChange={(e) => setNewTenantCnpj(e.target.value)}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label>Tipo de Organização *</Label>
                    <Select
                      value={newTenantOrgType}
                      onValueChange={(v) => {
                        setNewTenantOrgType(v)
                        if (v === 'empresa') setNewTenantOrgSubtype('')
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empresa">Empresa Privada</SelectItem>
                        <SelectItem value="osc">Organização da Soc. Civil (OSC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newTenantOrgType === 'osc' && (
                    <div className="space-y-2 animate-in fade-in">
                      <Label>Subtipo Organizacional</Label>
                      <Select value={newTenantOrgSubtype} onValueChange={setNewTenantOrgSubtype}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="educacional">Educacional</SelectItem>
                          <SelectItem value="assistencia_social">Assistência Social</SelectItem>
                          <SelectItem value="saude">Saúde</SelectItem>
                          <SelectItem value="multissetorial">Multissetorial</SelectItem>
                          <SelectItem value="geral">Geral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewTenantOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateTenant} disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Organizações Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" /> Carregando clientes...
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Sua lista de tenants está vazia.</p>
              <Button onClick={() => setIsNewTenantOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Cadastrar Primeiro Cliente
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organização</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell
                      className="font-medium cursor-pointer text-primary hover:underline"
                      onClick={() => navigate(`/${t.id}/clause/4.1`)}
                    >
                      {t.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono">
                      {t.cnpj || '-'}
                    </TableCell>
                    <TableCell>
                      {t.org_type === 'osc' ? (
                        <div>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            OSC
                          </Badge>
                          {t.org_subtype && (
                            <div className="text-[10px] text-muted-foreground mt-1 capitalize">
                              {t.org_subtype.replace('_', ' ')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Empresa
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {t.status === 'active' ? (
                        <Badge className="bg-success hover:bg-success text-white">Ativo</Badge>
                      ) : t.status === 'inactive' ? (
                        <Badge variant="destructive">Inativo</Badge>
                      ) : (
                        <Badge variant="secondary">Rascunho</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/${t.id}/users`)}>
                            <Users className="mr-2 h-4 w-4" /> Gerenciar Usuários
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(t)}>
                            <Settings className="mr-2 h-4 w-4" /> Configurações da Organização
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/${t.id}/onboarding`)}>
                            <Edit className="mr-2 h-4 w-4" /> Formulários (Onboarding)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate(`/${t.id}/communications`)}>
                            <History className="mr-2 h-4 w-4" /> Histórico de E-mails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/${t.id}/templates`)}>
                            <FileText className="mr-2 h-4 w-4" /> Templates de E-mail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEmailTenantId(t.id)
                              setIsEmailModalOpen(true)
                            }}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" /> Nova Comunicação
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(t)}>
                            <Power className="mr-2 h-4 w-4" />{' '}
                            {t.status === 'active' ? 'Inativar' : 'Ativar'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setTenantToDelete(t)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditTenantOpen} onOpenChange={setIsEditTenantOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Configurações da Organização</DialogTitle>
            <DialogDescription>
              Ajuste o tipo, subtipo e dados principais deste cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Organização *</Label>
                <Input value={editTenantName} onChange={(e) => setEditTenantName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input value={editTenantCnpj} onChange={(e) => setEditTenantCnpj(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label>Tipo de Organização *</Label>
                <Select
                  value={editTenantOrgType}
                  onValueChange={(v) => {
                    setEditTenantOrgType(v)
                    if (v === 'empresa') setEditTenantOrgSubtype('')
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empresa">Empresa Privada</SelectItem>
                    <SelectItem value="osc">Organização da Soc. Civil (OSC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editTenantOrgType === 'osc' && (
                <div className="space-y-2 animate-in fade-in">
                  <Label>Subtipo Organizacional</Label>
                  <Select value={editTenantOrgSubtype} onValueChange={setEditTenantOrgSubtype}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="educacional">Educacional</SelectItem>
                      <SelectItem value="assistencia_social">Assistência Social</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="multissetorial">Multissetorial</SelectItem>
                      <SelectItem value="geral">Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTenantOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateTenant} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!tenantToDelete} onOpenChange={(o) => !o && setTenantToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{tenantToDelete?.name}</strong>? Ação
              irreversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SendCommunicationModal
        isOpen={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        tenantId={emailTenantId}
      />
    </div>
  )
}
