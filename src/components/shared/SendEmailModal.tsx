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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Mail, Send } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { emailService } from '@/services/email'

const EMAIL_TEMPLATES = [
  {
    id: 'welcome',
    name: 'Boas-vindas e Acesso',
    subject: 'Bem-vindo ao mt3 Compliance',
    body: 'Olá,\n\nSeu ambiente no mt3 Compliance foi configurado com sucesso.\nPara acessar o sistema, utilize o link de convite recebido anteriormente ou acesse:\nhttps://mt3-compliance-576a5.goskip.app\n\nAtenciosamente,\nEquipe mt3',
  },
  {
    id: 'audit',
    name: 'Formalização de Auditoria',
    subject: 'Notificação: Processo de Conformidade',
    body: 'Prezados,\n\nInformamos que novas requisições de evidências foram disponibilizadas no seu painel. Solicitamos que acompanhem as pendências através da plataforma mt3 Compliance.\n\nAtenciosamente,\nEquipe de Compliance',
  },
  {
    id: 'deadline',
    name: 'Notificação de Prazo',
    subject: 'Aviso de Prazo Próximo - mt3 Compliance',
    body: 'Olá,\n\nNotamos que existem tarefas ou formulários em seu painel com prazo próximo ao vencimento. Por favor, acesse o sistema para regularizar a situação.\n\nAtenciosamente,\nEquipe mt3',
  },
]

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
  const [selectedTemplate, setSelectedTemplate] = useState<string>('none')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTo(defaultTo)
      setSubject(defaultSubject)
      setBody(defaultBody)
      setSelectedTemplate('none')
    }
  }, [isOpen, defaultSubject, defaultBody, defaultTo])

  const handleTemplateChange = (val: string) => {
    setSelectedTemplate(val)
    if (val !== 'none') {
      const tpl = EMAIL_TEMPLATES.find((t) => t.id === val)
      if (tpl) {
        setSubject(tpl.subject)
        setBody(tpl.body)
      }
    } else {
      setSubject(defaultSubject)
      setBody(defaultBody)
    }
  }

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
            <Mail className="h-5 w-5" /> Enviar Notificação por E-mail
          </DialogTitle>
          <DialogDescription>
            Dispare comunicações diversas (Boas-vindas, Alertas, Formalizações) utilizando a
            infraestrutura do mt3.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Template de Mensagem</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Mensagem Livre (Personalizada)</SelectItem>
                {EMAIL_TEMPLATES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
