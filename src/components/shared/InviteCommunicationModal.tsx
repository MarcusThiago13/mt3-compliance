import { useState, useEffect } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, MessageCircle, Send, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { emailService } from '@/services/email'

export interface InviteCommunicationModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  userEmail: string
  userName: string
  userPhone?: string
  tenantName: string
  inviteLink: string
  isExistingUser?: boolean
  defaultTab?: 'email' | 'whatsapp'
}

export function InviteCommunicationModal({
  isOpen,
  onOpenChange,
  userEmail,
  userName,
  userPhone,
  tenantName,
  inviteLink,
  isExistingUser,
  defaultTab = 'email',
}: InviteCommunicationModalProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [waMessage, setWaMessage] = useState('')
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
      setSubject(`Convite de Acesso - mt3 Compliance`)
      setBody(
        `Olá ${userName || 'Usuário'},\n\nVocê foi convidado(a) para acessar o sistema mt3 Compliance da organização ${tenantName}.\n\n${isExistingUser ? 'Como você já possui cadastro, basta acessar o sistema com suas credenciais:' : 'Por favor, acesse o link abaixo para criar sua senha e entrar no seu ambiente seguro:'}\n${inviteLink}\n\nAtenciosamente,\nEquipe mt3 Compliance`,
      )

      setWaMessage(
        `Olá ${userName || ''}! Você foi convidado(a) para acessar o sistema mt3 Compliance da organização ${tenantName}. ${isExistingUser ? 'Como você já possui cadastro, basta acessar o sistema:' : 'Defina sua senha através deste link para acessar o seu ambiente seguro:'} ${inviteLink}`,
      )
    }
  }, [isOpen, userName, tenantName, inviteLink, isExistingUser, defaultTab])

  const handleSendClientEmail = () => {
    window.location.href = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    toast({ title: 'Aviso', description: 'Abrindo o seu cliente local de e-mail.' })
    onOpenChange(false)
  }

  const handleSendSystemEmail = async () => {
    if (!userEmail) {
      toast({
        title: 'Atenção',
        description: 'E-mail do usuário não informado.',
        variant: 'destructive',
      })
      return
    }
    setIsSending(true)
    try {
      await emailService.sendEmail(userEmail, subject, body)
      toast({ title: 'Sucesso', description: 'Convite enviado com sucesso através do sistema.' })
      onOpenChange(false)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setIsSending(false)
    }
  }

  const handleSendWhatsApp = () => {
    if (!userPhone) {
      toast({
        title: 'Atenção',
        description: 'Número de WhatsApp não informado.',
        variant: 'destructive',
      })
      return
    }
    const phoneNum = userPhone.replace(/\D/g, '')
    if (phoneNum.length < 10) {
      toast({
        title: 'Atenção',
        description: 'Número de WhatsApp inválido.',
        variant: 'destructive',
      })
      return
    }
    window.open(`https://wa.me/55${phoneNum}?text=${encodeURIComponent(waMessage)}`, '_blank')
    toast({ title: 'Sucesso', description: 'Abrindo o WhatsApp.' })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Convite de Acesso</DialogTitle>
          <DialogDescription>
            Revise a mensagem pré-cadastrada antes de disparar o convite ao usuário.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-2" /> E-mail
            </TabsTrigger>
            <TabsTrigger value="whatsapp">
              <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Assunto</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Mensagem</Label>
              <Textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Número de Destino</Label>
              <Input value={userPhone || 'Não cadastrado'} disabled />
            </div>
            <div className="space-y-2">
              <Label>Mensagem</Label>
              <Textarea rows={6} value={waMessage} onChange={(e) => setWaMessage(e.target.value)} />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancelar
          </Button>
          {activeTab === 'email' ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleSendClientEmail} disabled={isSending}>
                <ExternalLink className="w-4 h-4 mr-2" /> Abrir no meu App
              </Button>
              <Button onClick={handleSendSystemEmail} disabled={isSending}>
                {isSending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Disparar via Sistema
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleSendWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!userPhone}
            >
              <MessageCircle className="w-4 h-4 mr-2" /> Abrir WhatsApp
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
