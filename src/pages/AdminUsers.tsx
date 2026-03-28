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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { USER_CLASSIFICATIONS } from '@/lib/constants'
import { ALL_ROLES, SYSTEM_ROLES, TENANT_ROLES } from '@/lib/roles'
import { InviteCommunicationModal } from '@/components/shared/InviteCommunicationModal'
import { format } from 'date-fns'

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const isAdmin =
    currentUser?.email === 'admin@example.com' ||
    currentUser?.email === 'marcusthiago.adv@gmail.com' ||
    currentUser?.app_metadata?.role === 'super_admin' ||
    currentUser?.app_metadata?.role === 'admin' ||
    currentUser?.user_metadata?.is_admin === true ||
    currentUser?.user_metadata?.is_admin === 'true'

  const [activeTab, setActiveTab] = useState('by-tenant')
  const [tenants, setTenants] = useState<any[]>([])
  const [selectedTenantId, setSelectedTenantId] = useState<string>('')

  const [records, setRecords] = useState<any[]>([])
  const [globalUsers, setGlobalUsers] = useState<any[]>([])
  const [systemErrors, setSystemErrors] = useState<any[]>([])

  const [loading, setLoading] = useState(false)
  const [loadingGlobal, setLoadingGlobal] = useState(false)
  const [loadingTenants, setLoadingTenants] = useState(true)
  const [loadingErrors, setLoadingErrors] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('visualizador')
  const [classification, setClassification] = useState(USER_CLASSIFICATIONS[11])

  const [editingUser, setEditingUser] = useState<any>(null)
  const [editRole, setEditRole] = useState('visualizador')
  const [editClassification, setEditClassification] = useState('')
  const [editPhone, setEditPhone] = useState('')

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteData, setInviteData] = useState<any>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    if (isAdmin) fetchTenants()
  }, [isAdmin])

  useEffect(() => {
    if (activeTab === 'global') {
      fetchGlobalUsers()
    } else if (activeTab === 'by-tenant' && selectedTenantId) {
      fetchTenantUsers(selectedTenantId)
    } else if (activeTab === 'logs') {
      fetchSystemErrors()
    }
  }, [activeTab, selectedTenantId])

  const fetchSystemErrors = async () => {
    setLoadingErrors(true)
    try {
      const { data, error } = await supabase
        .from('system_errors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setSystemErrors(data || [])
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Falha ao buscar logs de sistema.',
        variant: 'destructive',
      })
    } finally {
      setLoadingErrors(false)
    }
  }

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
        getUsers(tenantId),
        getInvitations(tenantId),
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
      toast({
        title: 'Atenção',
        description: error.message || 'Falha ao buscar usuários do sistema.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchGlobalUsers = async () => {
    setLoadingGlobal(true)
    try {
      const [fetchedUsers, fetchedInvites] = await Promise.all([getUsers(), getInvitations()])

      const userMap = new Map()
      fetchedUsers.forEach((u: any) => {
        if (!userMap.has(u.email)) {
          userMap.set(u.email, {
            id: u.id,
            email: u.email,
            name: u.name,
            phone: u.phone,
            tenants: [],
            type: 'active',
          })
        }
        if (u.tenant?.id) {
          userMap.get(u.email).tenants.push({
            tenantId: u.tenant.id,
            tenantName: u.tenant.name,
            role: u.role,
            classification: u.classification,
          })
        }
      })

      fetchedInvites.forEach((i: any) => {
        if (i.status === 'accepted') return
        if (!userMap.has(i.email)) {
          userMap.set(i.email, {
            id: i.id,
            email: i.email,
            name: i.name,
            phone: i.phone,
            last_sign_in_at: null,
            tenants: [],
            type: 'invitation',
          })
        }
        if (i.tenant?.id) {
          userMap.get(i.email).tenants.push({
            tenantId: i.tenant.id,
            tenantName: i.tenant.name,
            role: i.role,
            classification: i.classification,
            isPending: true,
          })
        }
      })

      setGlobalUsers(Array.from(userMap.values()))
    } catch (error: any) {
      toast({
        title: 'Atenção',
        description: error.message || 'Falha ao buscar visão global.',
        variant: 'destructive',
      })
    } finally {
      setLoadingGlobal(false)
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

    const cleanEmail = email.trim().toLowerCase()
    const alreadyActive = records.find(
      (r) => r.type === 'active' && r.email?.trim().toLowerCase() === cleanEmail,
    )

    if (alreadyActive) {
      toast({
        title: 'Atenção',
        description: 'Este usuário já possui acesso ativo nesta organização.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createInvitation(cleanEmail, name, selectedTenantId, phone, role, classification)
      toast({ title: 'Sucesso', description: 'Convite criado. Você já pode enviá-lo.' })
      setIsDialogOpen(false)
      setEmail('')
      setName('')
      setPhone('')
      setRole('visualizador')
      setClassification(USER_CLASSIFICATIONS[11])

      if (activeTab === 'global') fetchGlobalUsers()
      else fetchTenantUsers(selectedTenantId)
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
          contact_phone: editPhone,
        })
      } else {
        await updateInvitation(editingUser.id, {
          role: editRole,
          classification: editClassification,
          phone: editPhone,
        })
      }
      toast({ title: 'Sucesso', description: 'Usuário atualizado.' })
      setIsEditDialogOpen(false)

      if (activeTab === 'global') fetchGlobalUsers()
      else fetchTenantUsers(selectedTenantId)
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

      if (activeTab === 'global') fetchGlobalUsers()
      else fetchTenantUsers(selectedTenantId)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId)

  const handlePrepareInvite = async (
    invitationId: string,
    userEmail: string,
    userName: string,
    userPhone: string,
    channel: 'email' | 'whatsapp',
  ) => {
    try {
      if (channel === 'whatsapp') {
        const waPhone = userPhone ? userPhone.replace(/\D/g, '') : ''
        if (!waPhone) {
          toast({
            title: 'Atenção',
            description: 'O usuário não possui um número de WhatsApp cadastrado.',
            variant: 'destructive',
          })
          return
        }
      }

      const data = await sendInvitation(invitationId, 'link')

      setInviteData({
        userEmail,
        userName,
        userPhone,
        tenantName: selectedTenant?.name || '',
        inviteLink: data.link || window.location.origin,
        isExistingUser: !!data.message,
        defaultTab: channel,
      })
      setInviteModalOpen(true)

      if (activeTab === 'global') fetchGlobalUsers()
      else fetchTenantUsers(selectedTenantId)
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const formatLastAccess = (dateString?: string) => {
    if (!dateString) return 'Nunca acessou'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
    } catch {
      return 'Data inválida'
    }
  }

  const getRoleBadge = (roleValue: string) => {
    const roleObj = ALL_ROLES.find((r) => r.value === roleValue)
    const label = roleObj ? roleObj.label : roleValue

    if (['super_admin', 'admin', 'admin_tenant'].includes(roleValue)) {
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-none">
          {label}
        </Badge>
      )
    }
    if (['compliance_officer', 'encarregado_privacidade'].includes(roleValue)) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">{label}</Badge>
      )
    }
    if (['auditor_interno', 'auditor', 'assessor_admin'].includes(roleValue)) {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">
          {label}
        </Badge>
      )
    }
    if (['juridico', 'financeiro', 'rh_trabalhista', 'gestor_area'].includes(roleValue)) {
      return (
        <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 border-none">{label}</Badge>
      )
    }

    return (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-none">
        {label || 'Apenas Leitura'}
      </Badge>
    )
  }

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      !searchTerm ||
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || r.role === roleFilter
    return matchesSearch && matchesRole
  })

  const filteredGlobal = globalUsers.filter((u) => {
    const matchesSearch =
      !searchTerm ||
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.tenants.some((t: any) => t.role === roleFilter)
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Users className="h-8 w-8" />
            Gestão Global de Usuários
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle de acessos, convites e permissões granulares (RBAC) centralizado.
          </p>
        </div>
      </div>

      {activeTab !== 'logs' && (
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Perfis</SelectItem>
              {ALL_ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="w-full">
        <TabsList className="grid w-full sm:w-[600px] grid-cols-3 mb-6">
          <TabsTrigger value="by-tenant">Por Organização</TabsTrigger>
          <TabsTrigger value="global">Matriz Global de Acessos</TabsTrigger>
          <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="by-tenant" className="m-0 space-y-6 outline-none">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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
                      <Label>WhatsApp (Brasil - DDD + Número)</Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: 11999999999"
                      />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <Label>Nível de Acesso (RBAC) *</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_ROLES.map((r) => (
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

          {!selectedTenantId && !loadingTenants ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-lg bg-muted/20">
              <Search className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">Selecione uma organização</p>
              <p className="text-sm">
                Escolha um cliente no menu acima para gerenciar seus usuários.
              </p>
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
                        <TableHead>Último Acesso</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            Nenhum usuário encontrado para os filtros aplicados.
                          </TableCell>
                        </TableRow>
                      )}
                      {filteredRecords.map((r, i) => (
                        <TableRow key={r.id || i} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="font-medium text-primary">{r.name}</div>
                            <div className="text-sm text-muted-foreground">{r.email}</div>
                            {r.phone && (
                              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" /> {r.phone}
                              </div>
                            )}
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
                            <span className="text-xs text-muted-foreground">
                              {r.type === 'active' ? formatLastAccess(r.last_sign_in_at) : '-'}
                            </span>
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
                                        onClick={() =>
                                          handlePrepareInvite(
                                            r.id,
                                            r.email,
                                            r.name,
                                            r.phone || '',
                                            'email',
                                          )
                                        }
                                      >
                                        <Mail className="mr-2 h-4 w-4" /> Enviar E-mail
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handlePrepareInvite(
                                            r.id,
                                            r.email,
                                            r.name,
                                            r.phone || '',
                                            'whatsapp',
                                          )
                                        }
                                      >
                                        <MessageCircle className="mr-2 h-4 w-4" /> Enviar WhatsApp
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingUser(r)
                                    setEditRole(r.role || 'visualizador')
                                    setEditClassification(
                                      r.classification || USER_CLASSIFICATIONS[11],
                                    )
                                    setEditPhone(r.phone || '')
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
        </TabsContent>

        <TabsContent value="global" className="m-0 space-y-6 outline-none">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Matriz de Permissões
              </CardTitle>
              <CardDescription>
                Visão consolidada de todos os usuários e seus respectivos acessos por organização.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingGlobal ? (
                <div className="flex justify-center items-center py-12 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" /> Mapeando acessos
                  globais...
                </div>
              ) : globalUsers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum usuário encontrado no sistema.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Vínculos e Permissões (Tenants)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGlobal.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          Nenhum usuário encontrado para os filtros aplicados.
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredGlobal.map((u, i) => (
                      <TableRow key={u.id || i} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="font-medium text-primary">{u.name}</div>
                          <div className="text-sm text-muted-foreground">{u.email}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {formatLastAccess(u.last_sign_in_at)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {u.tenants.length === 0 && (
                              <span className="text-xs text-muted-foreground italic">
                                Sem vínculos
                              </span>
                            )}
                            {u.tenants.map((t: any, idx: number) => (
                              <Badge
                                key={idx}
                                variant={t.isPending ? 'secondary' : 'outline'}
                                className={
                                  t.isPending ? 'bg-amber-50 text-amber-700' : 'bg-slate-50'
                                }
                              >
                                <span className="font-semibold mr-1">{t.tenantName}:</span>{' '}
                                {ALL_ROLES.find((r) => r.value === t.role)?.label || t.role}
                                {t.isPending && ' (Pendente)'}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="m-0 space-y-6 outline-none">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Logs e Erros do Sistema (Tempo Real)
              </CardTitle>
              <CardDescription>
                Auditoria de falhas de backend, requisições HTTP e erros de sistema capturados
                automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingErrors ? (
                <div className="flex justify-center items-center py-12 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" /> Buscando logs
                  recentes...
                </div>
              ) : systemErrors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum erro registrado no sistema.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Erro / Mensagem</TableHead>
                      <TableHead>Contexto</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemErrors.map((err) => (
                      <TableRow key={err.id} className="hover:bg-muted/30">
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(err.created_at), 'dd/MM/yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          <div
                            className="font-medium text-destructive max-w-md truncate"
                            title={err.error_message}
                          >
                            {err.error_message}
                          </div>
                          {err.user_id && (
                            <div className="text-xs text-muted-foreground">
                              Usuário ID: {err.user_id}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground font-mono bg-muted p-1 rounded max-w-[200px] truncate">
                            {err.context ? JSON.stringify(err.context) : '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={err.status === 'new' ? 'bg-amber-50 text-amber-700' : ''}
                          >
                            {err.status || 'Novo'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Acesso de {editingUser?.name || 'Usuário'}</DialogTitle>
            <DialogDescription>
              Altere a permissão, classificação e contato do usuário nesta organização.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>WhatsApp (Brasil - DDD + Número)</Label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Ex: 11999999999"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissão (RBAC) *</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ROLES.map((r) => (
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

      {inviteData && (
        <InviteCommunicationModal
          isOpen={inviteModalOpen}
          onOpenChange={setInviteModalOpen}
          userEmail={inviteData.userEmail}
          userName={inviteData.userName}
          userPhone={inviteData.userPhone}
          tenantName={inviteData.tenantName}
          inviteLink={inviteData.inviteLink}
          isExistingUser={inviteData.isExistingUser}
          defaultTab={inviteData.defaultTab}
        />
      )}
    </div>
  )
}
