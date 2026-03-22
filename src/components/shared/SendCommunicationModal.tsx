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
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Mail, MessageCircle, Send } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { emailService } from '@/services/email'
import { supabase } from '@/lib/supabase/client'

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  defaultSubject?: string
  defaultBody?: string
  defaultToEmail?: string
  defaultToPhone?: string
  tenantId?: string
}

export function SendCommunicationModal({
  isOpen,
  onOpenChange,
  defaultSubject = '',
  defaultBody = '',
  defaultToEmail = '',
  defaultToPhone = '',
  tenantId,
}: Props) {
  const [recipientMode, setRecipientMode] = useState<'registered' | 'custom'>('registered')
  const [selectedUserId, setSelectedUserId] = useState<string>('none')

  const [customEmail, setCustomEmail] = useState('')
  const [customPhone, setCustomPhone] = useState('')

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('none')

  const [useEmail, setUseEmail] = useState(true)
  const [useWhatsapp, setUseWhatsapp] = useState(false)

  const [isSending, setIsSending] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      setCustomEmail(defaultToEmail)
      setCustomPhone(defaultToPhone)
      setSubject(defaultSubject)
      setBody(defaultBody)
      setSelectedTemplate('none')
      setSelectedUserId('none')
      setRecipientMode(defaultToEmail || defaultToPhone ? 'custom' : 'registered')

      const fetchData = async () => {
        let query = supabase.from('email_templates').select('*').order('name')
        if (tenantId) {
          query = query.or(`tenant_id.eq.${tenantId},tenant_id.is.null`)
        } else {
          query = query.is('tenant_id', null)
        }
        const { data: tpls } = await query
        if (tpls) setTemplates(tpls)

        if (tenantId) {
          const { data: usrData } = await supabase.rpc('get_tenant_users', {
            target_tenant_id: tenantId,
          })
          if (usrData) setUsers(usrData)
        }
      }
      fetchData()
    }
  }, [isOpen, defaultSubject, defaultBody, defaultToEmail, defaultToPhone, tenantId])

  const handleTemplateChange = (val: string) => {
    setSelectedTemplate(val)
    if (val !== 'none') {
      const tpl = templates.find((t) => t.id === val)
      if (tpl) {
        setSubject(tpl.subject)
        setBody(tpl.body)
      }
    } else {
      setSubject(defaultSubject)
      setBody(defaultBody)
    }
  }

  const handleUserChange = (val: string) => {
    setSelectedUserId(val)
    if (val !== 'none') {
      const user = users.find((u) => u.user_id === val)
      if (user) {
        setCustomEmail(user.email || '')
        setCustomPhone(user.contact_phone || '')
      }
    } else {
      setCustomEmail('')
      setCustomPhone('')
    }
  }

  const handleSend = async () => {
    if (!useEmail && !useWhatsapp) {
      toast({
        title: 'Atenção',
        description: 'Selecione ao menos um canal (E-mail ou WhatsApp).',
        variant: 'destructive',
      })
      return
    }

    if (useEmail && !customEmail) {
      toast({
        title: 'Atenção',
        description: 'E-mail do destinatário não informado.',
        variant: 'destructive',
      })
      return
    }
    if (useWhatsapp && !customPhone) {
      toast({
        title: 'Atenção',
        description: 'WhatsApp do destinatário não informado.',
        variant: 'destructive',
      })
      return
    }
    if (!body || (useEmail && !subject)) {
      toast({
        title: 'Atenção',
        description: 'Preencha o assunto (obrigatório para e-mail) e a mensagem.',
        variant: 'destructive',
      })
      return
    }

    setIsSending(true)
    try {
      if (useWhatsapp) {
        const phoneNum = customPhone.replace(/\D/g, '')
        if (phoneNum.length < 10) {
          throw new Error('Número de WhatsApp inválido. Utilize o formato DDD + Número.')
        }

        supabase
          .from('communication_logs')
          .insert({
            tenant_id: tenantId || null,
            channel: 'whatsapp',
            to_email: customEmail || null,
            to_phone: customPhone,
            subject: subject || 'Mensagem via WhatsApp',
            body: body,
            status: 'initiated',
          })
          .then()

        window.open(`https://wa.me/55${phoneNum}?text=${encodeURIComponent(body)}`, '_blank')
      }

      if (useEmail) {
        await emailService.sendEmail(customEmail, subject, body, tenantId)
      }

      toast({
        title: 'Comunicação Registrada',
        description: 'Mensagem processada e registrada com sucesso!',
      })
      onOpenChange(false)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" /> Enviar Comunicação
          </DialogTitle>
          <DialogDescription>
            Dispare comunicações por E-mail e/ou WhatsApp para os contatos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <Label>Canais de Envio</Label>
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="c-email"
                    checked={useEmail}
                    onCheckedChange={(c) => setUseEmail(c as boolean)}
                  />
                  <label
                    htmlFor="c-email"
                    className="text-sm flex items-center gap-1 cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <Mail className="h-4 w-4" /> E-mail
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="c-wa"
                    checked={useWhatsapp}
                    onCheckedChange={(c) => setUseWhatsapp(c as boolean)}
                  />
                  <label
                    htmlFor="c-wa"
                    className="text-sm flex items-center gap-1 cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <MessageCircle className="h-4 w-4 text-green-600" /> WhatsApp
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <Label>Modo de Destinatário</Label>
              <Select value={recipientMode} onValueChange={(v: any) => setRecipientMode(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registered">Contato Cadastrado</SelectItem>
                  <SelectItem value="custom">Informar Manualmente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {recipientMode === 'registered' && tenantId && (
            <div className="space-y-2">
              <Label>Selecione o Contato</Label>
              <Select value={selectedUserId} onValueChange={handleUserChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um usuário da organização..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecione...</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.user_id} value={u.user_id}>
                      {u.name} ({u.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label>E-mail do Destinatário</Label>
              <Input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="cliente@empresa.com"
                disabled={recipientMode === 'registered'}
              />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label>WhatsApp (DDD + Número)</Label>
              <Input
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="Ex: 11999999999"
                disabled={recipientMode === 'registered'}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <Label>Template de Mensagem</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Mensagem Livre (Personalizada)</SelectItem>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} {t.tenant_id ? '(Personalizado)' : '(Global)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assunto {useEmail ? '*' : '(Opcional para WhatsApp)'}</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Mensagem *</Label>
            <Textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
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
            Enviar Comunicação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
