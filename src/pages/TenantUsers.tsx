import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Mail, MessageCircle, Loader2, ShieldCheck, UserPlus, Users } from 'lucide-react'
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
import { getUsers, getInvitations, createInvitation, sendInvitation } from '@/services/admin'
import { useAppStore } from '@/stores/main'
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

export default function TenantUsers() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { activeTenant } = useAppStore()
  const { user: currentUser } = useAuth()

  const isAdmin =
    currentUser?.email === 'admin@example.com' ||
    currentUser?.app_metadata?.role === 'admin' ||
    currentUser?.user_metadata?.is_admin

  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const fetchInitialData = async () => {
    if (!tenantId) return
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
          status: 'Ativo',
        })),
        ...fetchedInvites.map((i: any) => ({
          id: i.id,
          name: i.name || '-',
          email: i.email,
          phone: i.phone,
          status: i.status === 'pending' ? 'Pendente' : i.status === 'sent' ? 'Enviado' : 'Aceito',
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

  useEffect(() => {
    if (isAdmin && tenantId) fetchInitialData()
  }, [isAdmin, tenantId])

  if (!isAdmin) {
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
      await createInvitation(email, name, tenantId, phone)
      toast({ title: 'Sucesso', description: 'Convite criado. Você já pode enviá-lo.' })
      setIsDialogOpen(false)
      setEmail('')
      setName('')
      setPhone('')
      fetchInitialData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendEmail = async (invitationId: string) => {
    try {
      await sendInvitation(invitationId, 'email')
      toast({ title: 'Sucesso', description: 'E-mail de convite enviado.' })
      fetchInitialData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const handleSendWhatsApp = async (invitationId: string, phoneStr?: string) => {
    try {
      const data = await sendInvitation(invitationId, 'link')
      const message = `Olá! Você foi convidado para acessar o sistema mt3 Compliance da organização ${activeTenant?.name}. Defina sua senha através deste link para acessar o seu ambiente seguro: ${data.link}`
      const waPhone = phoneStr ? phoneStr.replace(/\D/g, '') : ''
      window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`, '_blank')
      fetchInitialData()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Users className="h-8 w-8" />
            Acessos: {activeTenant?.name || 'Carregando...'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão centralizada de usuários e convites específicos desta organização.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar para {activeTenant?.name}</DialogTitle>
              <DialogDescription>
                Crie um convite para adicionar um usuário exclusivamente a este ambiente isolado.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp (Opcional)</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="5511999999999"
                />
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> Membros Ativos e Pendentes
          </CardTitle>
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
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r, i) => (
                  <TableRow key={r.id || i} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-primary">{r.name}</TableCell>
                    <TableCell className="text-muted-foreground">{r.email}</TableCell>
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
                      {r.type === 'invitation' && r.status === 'Pendente' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendEmail(r.id)}
                            title="Enviar por E-mail"
                          >
                            <Mail className="h-4 w-4 sm:mr-1" />{' '}
                            <span className="hidden sm:inline">E-mail</span>
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-[#25D366] hover:bg-[#20bd5a] text-white border-none"
                            onClick={() => handleSendWhatsApp(r.id, r.phone)}
                            title="Enviar por WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4 sm:mr-1" />{' '}
                            <span className="hidden sm:inline">WhatsApp</span>
                          </Button>
                        </div>
                      )}
                      {r.type === 'invitation' && r.status === 'Enviado' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendEmail(r.id)}
                            title="Reenviar por E-mail"
                          >
                            <Mail className="h-4 w-4 sm:mr-1" />{' '}
                            <span className="hidden sm:inline">Reenviar</span>
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
