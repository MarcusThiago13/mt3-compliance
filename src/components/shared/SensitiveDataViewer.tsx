import { useState } from 'react'
import { EyeOff, ShieldAlert, Lock, Fingerprint, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SensitiveDataViewerProps {
  content: string
  context: string
  recordId: string
  tenantId: string
  blur?: boolean
}

export function SensitiveDataViewer({
  content,
  context,
  recordId,
  tenantId,
  blur = true,
}: SensitiveDataViewerProps) {
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleReveal = async () => {
    if (revealed) {
      setRevealed(false)
      return
    }

    setLoading(true)
    try {
      // Create an audit log record for data protection tracking
      const { error } = await supabase.from('audit_logs').insert({
        tenant_id: tenantId,
        clause_id: 'lgpd_access',
        action: `Acesso LGPD: Dado sensível revelado (${context}) - Ref: ${recordId.substring(0, 8)}`,
        user_email: user?.email || 'desconhecido',
        metadata: { recordId, context, action: 'reveal', timestamp: new Date().toISOString() },
      } as any)

      if (error) throw error

      setRevealed(true)

      toast({
        title: 'Acesso Registrado',
        description:
          'A visualização destes dados sensíveis foi gravada na trilha de auditoria (LGPD).',
      })
    } catch (error) {
      toast({
        title: 'Erro de Segurança',
        description:
          'Não foi possível registrar a auditoria de acesso. A visualização foi bloqueada.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!content) return <span className="text-muted-foreground">-</span>

  if (!revealed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={handleReveal}
              className="flex items-center gap-2 group cursor-pointer w-fit"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
              )}
              <div
                className={`bg-slate-200/70 text-slate-500 select-none rounded px-2 py-0.5 text-sm ${blur ? 'filter blur-[4px] group-hover:blur-[2px]' : ''} transition-all duration-300`}
              >
                {content.length > 20 ? content.substring(0, 20) + '...' : 'Dados protegidos'}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-amber-900 border-amber-800 text-amber-50">
            <p className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              Clique para revelar. Acesso será registrado na auditoria.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-md border border-slate-200 animate-fade-in mt-1">
      <div className="flex-1 text-sm text-slate-800 break-words whitespace-pre-wrap leading-relaxed">
        {content}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 mt-0.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600"
        onClick={() => setRevealed(false)}
        title="Ocultar dados"
      >
        <EyeOff className="w-3.5 h-3.5" />
      </Button>
    </div>
  )
}
