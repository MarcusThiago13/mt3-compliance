import { useState } from 'react'
import { Link as LinkIcon, Loader2, Copy, CheckCircle2, Calendar, Mail, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { collectionService } from '@/services/collection'
import { emailService } from '@/services/email'
import { useAuth } from '@/hooks/use-auth'

interface Props {
  tenantId: string
  formType: 'onboarding' | 'context'
  buttonLabel?: string
}

export function GenerateLinkModal({
  tenantId,
  formType,
  buttonLabel = 'Gerar Link de Coleta',
}: Props) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [validityDays, setValidityDays] = useState(3)

  // Email form state
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emailTo, setEmailTo] = useState('')
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const token = await collectionService.generateToken(
        tenantId,
        formType,
        validityDays,
        user?.id,
      )
      const generatedLink = `${window.location.origin}/f/${token}`
      setLink(generatedLink)
      setCopied(false)
      setShowEmailForm(false)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: 'Copiado', description: 'Link copiado para a área de transferência.' })
  }

  const handleSendEmail = async () => {
    if (!emailTo) {
      toast({
        title: 'Atenção',
        description: 'Informe o e-mail de destino.',
        variant: 'destructive',
      })
      return
    }
    setIsSendingEmail(true)
    try {
      const formName =
        formType === 'onboarding' ? 'Perfil da Organização' : 'Contexto da Organização'
      const subject = `Solicitação de Dados - ${formName}`
      const body = `Olá,\n\nSolicitamos o preenchimento seguro das informações de ${formName} através da nossa plataforma de compliance.\n\nPor favor, acesse o link único e seguro abaixo para enviar os dados:\n${link}\n\nEste link tem validade de ${validityDays} dias e expira automaticamente após o envio ou prazo.\n\nAtenciosamente,\nEquipe mt3 Compliance`

      await emailService.sendEmail(emailTo, subject, body)
      toast({ title: 'Enviado', description: `O link foi enviado com sucesso para ${emailTo}` })
      setShowEmailForm(false)
      setEmailTo('')
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          setLink('')
          setShowEmailForm(false)
          setEmailTo('')
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 text-primary border-primary/30 hover:bg-primary/5"
        >
          <LinkIcon className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar Link de Coleta Externa</DialogTitle>
          <DialogDescription>
            Crie um link seguro para o cliente preencher os dados. Após o envio pelo cliente, o link
            expira automaticamente (uso único).
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {!link ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Validade (em dias)</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={validityDays}
                    onChange={(e) => setValidityDays(parseInt(e.target.value) || 1)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  O padrão de segurança recomendado é de 3 dias.
                </p>
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LinkIcon className="mr-2 h-4 w-4" />
                )}
                Gerar Link Exclusivo
              </Button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-sm text-emerald-800">
                  <p className="font-semibold">Link gerado com sucesso!</p>
                  <p>
                    Envie este link para o cliente. Ele será notificado que o acesso é seguro e
                    único.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input value={link} readOnly className="font-mono text-xs bg-muted" />
                <Button onClick={handleCopy} variant="secondary" className="shrink-0">
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {!showEmailForm ? (
                <Button variant="outline" className="w-full" onClick={() => setShowEmailForm(true)}>
                  <Mail className="mr-2 h-4 w-4" /> Disparar link por E-mail
                </Button>
              ) : (
                <div className="bg-muted/30 p-4 rounded-lg border space-y-3 animate-fade-in-up">
                  <Label>E-mail do Cliente</Label>
                  <Input
                    type="email"
                    placeholder="exemplo@cliente.com"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmailForm(false)}
                      disabled={isSendingEmail}
                    >
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleSendEmail} disabled={isSendingEmail}>
                      {isSendingEmail ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Enviar Convite
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
