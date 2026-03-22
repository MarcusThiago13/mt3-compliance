import { useState } from 'react'
import { Link as LinkIcon, Loader2, Copy, CheckCircle2 } from 'lucide-react'
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
import { toast } from '@/hooks/use-toast'
import { collectionService } from '@/services/collection'

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
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const token = await collectionService.generateToken(tenantId, formType, 7)
      const generatedLink = `${window.location.origin}/f/${token}`
      setLink(generatedLink)
      setCopied(false)
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) setLink('')
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
            Crie um link temporário (válido por 7 dias) e de uso único para o cliente preencher os
            dados. Após o envio pelo cliente, o link expira automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {!link ? (
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LinkIcon className="mr-2 h-4 w-4" />
              )}
              Gerar Link Exclusivo
            </Button>
          ) : (
            <div className="space-y-3 animate-fade-in">
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
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
