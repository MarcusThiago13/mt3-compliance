import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Mail, Send } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { emailService } from '@/services/email'

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  defaultSubject?: string
  defaultBody?: string
  defaultTo?: string
}

export function SendEmailModal({
  isOpen,
  onOpenChange,
  defaultSubject = '',
  defaultBody = '',
  defaultTo = '',
}: Props) {
  const [to, setTo] = useState(defaultTo)
  const [subject, setSubject] = useState(defaultSubject)
  const [body, setBody] = useState(defaultBody)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTo(defaultTo)
      setSubject(defaultSubject)
      setBody(defaultBody)
    }
  }, [isOpen, defaultSubject, defaultBody, defaultTo])

  const handleSend = async () => {
    if (!to || !subject || !body) {
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos.',
        variant: 'destructive',
      })
      return
    }
    setIsSending(true)
    try {
      await emailService.sendEmail(to, subject, body)
      toast({ title: 'E-mail Enviado', description: 'Mensagem enviada com sucesso pelo sistema!' })
      onOpenChange(false)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" /> Enviar Link por E-mail
          </DialogTitle>
          <DialogDescription>
            Dispare a solicitação de forma automática e segura utilizando a infraestrutura do mt3.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>E-mail do Destinatário</Label>
            <Input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="cliente@empresa.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Assunto</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Mensagem</Label>
            <Textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Disparar E-mail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
