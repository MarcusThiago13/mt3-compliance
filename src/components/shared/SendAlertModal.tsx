import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bell, Mail, MessageCircle, Loader2 } from 'lucide-react'
import { getUsers } from '@/services/admin'
import { toast } from '@/hooks/use-toast'

export interface SendAlertModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  actionId?: string
  actionTitle?: string
  actionDeadline?: string
}

export function SendAlertModal({
  isOpen,
  onOpenChange,
  actionId,
  actionTitle,
  actionDeadline,
}: SendAlertModalProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  useEffect(() => {
    if (isOpen && tenantId) {
      fetchUsers()
    }
  }, [isOpen, tenantId])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers(tenantId)
      setUsers(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const selectedUser = users.find((u) => u.id === selectedUserId)

  const handleSendEmail = () => {
    if (!selectedUser?.email) return
    const subject = `[ALERTA DE PRAZO] Ação 5W2H: ${actionId || 'Compliance'}`
    const body = `Olá ${selectedUser.name},\n\nEste é um lembrete do Sistema de Gestão de Compliance sobre a seguinte ação sob sua responsabilidade:\n\nAção: ${actionTitle}\nPrazo Previsto: ${actionDeadline || 'Não definido'}\n\nPor favor, acesse o sistema para atualizar o status e anexar as evidências necessárias.\n\nAtenciosamente,\nEquipe de Compliance`

    window.location.href = `mailto:${selectedUser.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    toast({ title: 'Alerta Preparado', description: 'Cliente de e-mail aberto para envio.' })
    onOpenChange(false)
  }

  const handleSendWhatsApp = () => {
    if (!selectedUser?.phone) {
      toast({
        title: 'Atenção',
        description: 'Usuário não possui WhatsApp cadastrado.',
        variant: 'destructive',
      })
      return
    }
    const phoneNum = selectedUser.phone.replace(/\D/g, '')
    if (phoneNum.length < 10) {
      toast({
        title: 'Atenção',
        description: 'Número de WhatsApp inválido. Verifique o cadastro.',
        variant: 'destructive',
      })
      return
    }
    const message = `*ALERTA DE COMPLIANCE*\n\nOlá ${selectedUser.name}, lembrete da ação sob sua responsabilidade:\n\n*Ação:* ${actionTitle}\n*Prazo:* ${actionDeadline || 'Não definido'}\n\nPor favor, atualize o sistema com as evidências.`

    window.open(`https://wa.me/55${phoneNum}?text=${encodeURIComponent(message)}`, '_blank')
    toast({ title: 'Alerta Preparado', description: 'WhatsApp aberto para envio.' })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <Bell className="h-5 w-5" /> Disparar Alerta de Ação 5W2H
          </DialogTitle>
          <DialogDescription>
            Selecione o responsável para notificar sobre o prazo desta ação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 p-3 rounded-md text-sm border">
            <p>
              <strong>Ação:</strong> {actionTitle}
            </p>
            <p>
              <strong>Prazo:</strong> {actionDeadline || 'Não definido'}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Responsável (Usuário do Sistema)</Label>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Carregando usuários...
              </div>
            ) : (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedUser && (
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-md space-y-2 mt-4">
              <p className="text-sm font-medium text-blue-900">
                Canais Disponíveis para {selectedUser.name}:
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Mail className="h-4 w-4" /> {selectedUser.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <MessageCircle className="h-4 w-4" />{' '}
                {selectedUser.phone || 'Nenhum WhatsApp cadastrado'}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={!selectedUserId || !selectedUser?.email}
            onClick={handleSendEmail}
            className="bg-slate-800 hover:bg-slate-700 text-white"
          >
            <Mail className="mr-2 h-4 w-4" /> E-mail
          </Button>
          <Button
            disabled={!selectedUserId || !selectedUser?.phone}
            onClick={handleSendWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
