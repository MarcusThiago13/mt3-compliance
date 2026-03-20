import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  Mail,
  MessageCircle,
  Loader2,
  ShieldCheck,
  UserPlus,
  Users,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
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
import { toast } from '@/hooks/use-toast'
import {
  getUsers,
  getInvitations,
  createInvitation,
  sendInvitation,
  updateUser,
  removeUser,
  updateInvitation,
  removeInvitation,
} from '@/services/admin'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { USER_CLASSIFICATIONS, USER_ROLES } from '@/lib/constants'

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const isAdmin =
    currentUser?.email === 'admin@example.com' ||
    currentUser?.app_metadata?.role === 'admin' ||
    currentUser?.user_metadata?.is_admin

  const [tenants, setTenants] = useState<any[]>([])
  const [selectedTenantId, setSelectedTenantId] = useState<string>('')
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingTenants, setLoadingTenants] = useState(true)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('viewer')
  const [classification, setClassification] = useState(USER_CLASSIFICATIONS[11])

  const [editingUser, setEditingUser] = useState<any>(null)
  const [editRole, setEditRole] = useState('')
  const [editClassification, setEditClassification] = useState('')

  useEffect(() => {
    if (isAdmin) fetchTenants()
  }, [isAdmin])

  useEffect(() => {
    if (selectedTenantId) {
      fetchTenantUsers(selectedTenantId)
    } else {
      setRecords([])
    }
  }, [selectedTenantId])

  const fetchTenants = async () => {
    setLoadingTenants(true)
    try {
      const { data, error } = await supabase.from('tenants').select('id, name').order('name')
      if (error) throw error
      if (data) {
        setTenants(data)
        if (data.length > 0 && !selectedTenantId) {
          setSelectedTenantId(data[0].id)
        }
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar organizações.',
        variant: 'destructive',
      })
    } finally {
      setLoadingTenants(false)
    }
  }

  const fetchTenantUsers = async (tenantId: string) => {
    setLoading(true)
    try {
      const [fetchedUsers, fetchedInvites] = await Promise.all([
        getUsers(tenantId).catch(() => []),
        getInvitations(tenantId).catch(() => []),
      ])

      const combined = [
        ...fetchedUsers.map((u: any) => ({
          ...u,
          type: 'active',
        })),
        ...fetchedInvites
          .filter((i: any) => i.status !== 'accepted')
          .map((i: any) => ({
            id: i.id,
            name: i.name || '-',
            email: i.email,
            phone: i.phone,
            role: i.role,
            classification: i.classification,
            status:
              i.status === 'pending' ? 'Pendente' : i.status === 'sent' ? 'Enviado' : 'Aceito',
            type: 'invitation',
          })),
      ]

      setRecords(combined)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const handleCreateUser = async () => {
    if (!email || !name || !selectedTenantId) {
      toast({
        title: 'Atenção',
        description: 'Preencha os campos obrigatórios e selecione uma organização.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createInvitation(email, name, selectedTenantId, phone, role, classification)
      toast({ title: 'Sucesso', description: 'Convite criado. Você já pode enviá-lo.' })
      setIsDialogOpen(false)
      setEmail('')
      setName('')
      setPhone('')
      setRole('viewer')
      setClassification(USER_CLASSIFICATIONS[11])
      fetchTenantUsers(selectedTenantId)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = async () => {
    if (!editingUser) return
    setIsSubmitting(true)
    try {
      if (editingUser.type === 'active') {
        await updateUser(editingUser.id, selectedTenantId, {
          role: editRole,
          classification: editClassification,
        })
      } else {
        await updateInvitation(editingUser.id, {
          role: editRole,
          classification: editClassification,
        })
      }
      toast({ title: 'Sucesso', description: 'Usuário atualizado.' })
      setIsEditDialogOpen(false)
      fetchTenantUsers(selectedTenantId)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (user: any) => {
    if (!confirm(`Deseja realmente remover o acesso de ${user.name || user.email}?`)) return

    try {
      if (user.type === 'active') {
        await removeUser(user.id, selectedTenantId)
      } else {
        await removeInvitation(user.id)
      }
      toast({ title: 'Sucesso', description: 'Usuário removido da organização.' })
      fetchTenantUsers(selectedTenantId)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId)

  const handleSendEmail = async (invitationId: string, userEmail: string, userName: string) => {
    try {
      const data = await sendInvitation(invitationId, 'link')
      if (data.message) {
        toast({ title: 'Vínculo Automático', description: data.message })
        fetchTenantUsers(selectedTenantId)
        return
      }

      const tenantName = selectedTenant?.name || ''
      const subject = `Convite de Acesso - mt3 Compliance`
      const body = `Olá ${userName || 'Usuário'},

Você foi convidado(a) para acessar o sistema mt3 Compliance da organização ${tenantName}.

Por favor, acesse o link abaixo para criar sua senha e entrar no seu ambiente seguro:
${data.link}

Atenciosamente,
Equipe mt3 Compliance`

      window.location.href = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

      toast({ title: 'Sucesso', description: 'Abrindo o cliente de e-mail para envio do convite.' })
      fetchTenantUsers(selectedTenantId)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const handleSendWhatsApp = async (invitationId: string, phoneStr: string, userName: string) => {
    try {
      const data = await sendInvitation(invitationId, 'link')
      if (data.message) {
        toast({ title: 'Vínculo Automático', description: data.message })
        fetchTenantUsers(selectedTenantId)
        return
      }

      const tenantName = selectedTenant?.name || ''
      const message = `Olá ${userName || ''}! Você foi convidado(a) para acessar o sistema mt3 Compliance da organização ${tenantName}. Defina sua senha através deste link para acessar o seu ambiente seguro: ${data.link}`
      const waPhone = phoneStr ? phoneStr.replace(/\D/g, '') : ''
      window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`, '_blank')
      fetchTenantUsers(selectedTenantId)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const getRoleBadge = (roleValue: string) => {
    const roleObj = USER_ROLES.find((r) => r.value === roleValue)
    const label = roleObj ? roleObj.label : roleValue
    if (roleValue === 'admin')
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-none">
          {label}
        </Badge>
      )
    if (roleValue === 'editor')
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">{label}</Badge>
      )
    return (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-none">
        {label || 'Apenas Leitura'}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Users className="h-8 w-8" />
            Gestão de Usuários
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle de acessos, convites e permissões (RBAC) centralizado.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Select
              value={selectedTenantId}
              onValueChange={setSelectedTenantId}
              disabled={loadingTenants}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma organização..." />
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedTenantId}>
                <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Convidar para {selectedTenant?.name}</DialogTitle>
                <DialogDescription>
                  Adicione um usuário e defina seu nível de acesso. Se o e-mail já possuir conta,
                  ele será vinculado automaticamente a este cliente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Nome Completo *</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>E-mail *</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="joao@empresa.com"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>WhatsApp (Opcional)</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="5511999999999"
                    />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Permissão (RBAC) *</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Classificação *</Label>
                    <Select value={classification} onValueChange={setClassification}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_CLASSIFICATIONS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Acesso de {editingUser?.name || 'Usuário'}</DialogTitle>
            <DialogDescription>
              Altere a permissão e classificação do usuário nesta organização.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Permissão (RBAC) *</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Classificação *</Label>
              <Select value={editClassification} onValueChange={setEditClassification}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_CLASSIFICATIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!selectedTenantId && !loadingTenants ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-lg bg-muted/20">
          <Search className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">Selecione uma organização</p>
          <p className="text-sm">Escolha um cliente no menu acima para gerenciar seus usuários.</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Membros Ativos e Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading || loadingTenants ? (
              <div className="flex justify-center items-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" /> Buscando dados de
                acesso...
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum usuário ou convite encontrado para esta organização.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Perfil de Acesso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r, i) => (
                    <TableRow key={r.id || i} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="font-medium text-primary">{r.name}</div>
                        <div className="text-sm text-muted-foreground">{r.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-1">
                          {getRoleBadge(r.role)}
                          <span className="text-xs text-muted-foreground">
                            {r.classification || '-'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {r.status === 'Ativo' ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
                            Ativo
                          </Badge>
                        ) : r.status === 'Enviado' ? (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">
                            Enviado
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none"
                          >
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {r.type === 'invitation' &&
                              (r.status === 'Pendente' || r.status === 'Enviado') && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleSendEmail(r.id, r.email, r.name)}
                                  >
                                    <Mail className="mr-2 h-4 w-4" /> Enviar E-mail
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleSendWhatsApp(r.id, r.phone || '', r.name)}
                                  >
                                    <MessageCircle className="mr-2 h-4 w-4" /> Enviar WhatsApp
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingUser(r)
                                setEditRole(r.role || 'viewer')
                                setEditClassification(r.classification || USER_CLASSIFICATIONS[11])
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Editar Acesso
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(r)}
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Remover Usuário
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
      )}
    </div>
  )
}
