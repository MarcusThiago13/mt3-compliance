import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import {
  Mail,
  MessageCircle,
  Loader2,
  ShieldCheck,
  UserPlus,
  Users,
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
import { useAppStore } from '@/stores/main'
import { useRBAC } from '@/hooks/use-rbac'
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
import { USER_CLASSIFICATIONS } from '@/lib/constants'
import { TENANT_ROLES, ALL_ROLES } from '@/lib/roles'
import { InviteCommunicationModal } from '@/components/shared/InviteCommunicationModal'
import { SendCommunicationModal } from '@/components/shared/SendCommunicationModal'

export default function TenantUsers() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { activeTenant } = useAppStore()
  const { isAdmin, isComplianceOfficer, loading: rbacLoading } = useRBAC()

  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('visualizador')
  const [classification, setClassification] = useState(USER_CLASSIFICATIONS[11])

  const [editingUser, setEditingUser] = useState<any>(null)
  const [editRole, setEditRole] = useState('')
  const [editClassification, setEditClassification] = useState('')
  const [editPhone, setEditPhone] = useState('')

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteData, setInviteData] = useState<any>(null)

  const [genericModalOpen, setGenericModalOpen] = useState(false)
  const [genericData, setGenericData] = useState<{
    email: string
    phone: string
    name: string
  } | null>(null)

  const fetchInitialData = async () => {
    if (!tenantId) return
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
        description: error.message || 'Falha ao buscar usuários da organização.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if ((isAdmin || isComplianceOfficer) && tenantId) fetchInitialData()
  }, [isAdmin, isComplianceOfficer, tenantId])

  if (rbacLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mr-2" /> Validando permissões...
      </div>
    )
  }

  if (!isAdmin && !isComplianceOfficer) {
    return <Navigate to={`/${tenantId}/clause/4.1`} replace />
  }

  const handleCreateUser = async () => {
    if (!email || !name) {
      toast({
        title: 'Atenção',
        description: 'Preencha os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }
    if (!tenantId) return

    setIsSubmitting(true)
    try {
      await createInvitation(email, name, tenantId, phone, role, classification)
      toast({ title: 'Sucesso', description: 'Convite criado. Você já pode enviá-lo.' })
      setIsDialogOpen(false)
      setEmail('')
      setName('')
      setPhone('')
      setRole('visualizador')
      setClassification(USER_CLASSIFICATIONS[11])
      fetchInitialData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = async () => {
    if (!editingUser || !tenantId) return
    setIsSubmitting(true)
    try {
      if (editingUser.type === 'active') {
        await updateUser(editingUser.id, tenantId, {
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
      toast({ title: 'Sucesso', description: 'Usuário atualizado com sucesso.' })
      setIsEditDialogOpen(false)
      fetchInitialData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (user: any) => {
    if (!tenantId) return
    if (!confirm(`Deseja realmente remover o acesso de ${user.name || user.email}?`)) return

    try {
      if (user.type === 'active') {
        await removeUser(user.id, tenantId)
      } else {
        await removeInvitation(user.id)
      }
      toast({ title: 'Sucesso', description: 'Usuário removido da organização.' })
      fetchInitialData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

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
        tenantName: activeTenant?.name || '',
        inviteLink: data.link || window.location.origin,
        isExistingUser: !!data.message,
        defaultTab: channel,
      })
      setInviteModalOpen(true)
      fetchInitialData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
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

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Users className="h-8 w-8" />
            Permissões e Acessos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão granular de usuários (RBAC) e convites desta organização.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Convidar para {activeTenant?.name}</DialogTitle>
              <DialogDescription>
                Adicione um usuário e defina seu nível de acesso granular.
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
                      {TENANT_ROLES.map((r) => (
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
              <Label>Nível de Acesso (RBAC) *</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TENANT_ROLES.map((r) => (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> Membros Ativos e Pendentes
          </CardTitle>
          <CardDescription>
            Todos os usuários listados abaixo possuem acesso estrito aos dados deste tenant,
            conforme suas permissões de leitura ou escrita.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
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
                  <TableHead>Perfil de Acesso (RBAC)</TableHead>
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
                                  <Mail className="mr-2 h-4 w-4" /> Enviar Convite (E-mail)
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
                                  <MessageCircle className="mr-2 h-4 w-4" /> Enviar Convite
                                  (WhatsApp)
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                          <DropdownMenuItem
                            onClick={() => {
                              setGenericData({ email: r.email, phone: r.phone || '', name: r.name })
                              setGenericModalOpen(true)
                            }}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" /> Enviar Comunicação
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingUser(r)
                              setEditRole(r.role || 'visualizador')
                              setEditClassification(r.classification || USER_CLASSIFICATIONS[11])
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
          tenantId={tenantId}
        />
      )}

      {genericData && (
        <SendCommunicationModal
          isOpen={genericModalOpen}
          onOpenChange={setGenericModalOpen}
          defaultToEmail={genericData.email}
          defaultToPhone={genericData.phone}
          tenantId={tenantId}
        />
      )}
    </div>
  )
}
