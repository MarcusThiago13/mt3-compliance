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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, Loader2 } from 'lucide-react'
import { callAnthropicMessage } from '@/lib/anthropic'
import { toast } from '@/hooks/use-toast'

export interface ActionMotor5W2HModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  promptContext: string
  onSave: (plan: any) => void
}

export function ActionMotor5W2HModal({
  isOpen,
  onOpenChange,
  title = 'Motor de Ação: Plano 5W2H',
  description = 'Desdobramento automático da ação utilizando Inteligência Artificial.',
  promptContext,
  onSave,
}: ActionMotor5W2HModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [fiveWtwoH, setFiveWtwoH] = useState<any>(null)

  useEffect(() => {
    if (isOpen && promptContext) {
      generate5W2H()
    } else if (!isOpen) {
      setFiveWtwoH(null)
    }
  }, [isOpen, promptContext])

  const generate5W2H = async () => {
    setFiveWtwoH(null)
    setIsGenerating(true)
    try {
      const prompt = `Gere um plano de ação 5W2H detalhado para o seguinte cenário/contexto:
${promptContext}

Retorne APENAS um objeto JSON estrito com as chaves exatas: "what", "why", "where", "when", "who", "how", "howMuch". Nenhuma formatação markdown adicional.`
      const response = await callAnthropicMessage(prompt)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : response
      const data = JSON.parse(jsonStr)
      setFiveWtwoH(data)
    } catch (e) {
      console.error(e)
      toast({
        title: 'Erro de Inteligência Artificial',
        description: 'Não foi possível gerar o 5W2H. Tente novamente.',
        variant: 'destructive',
      })
      onOpenChange(false)
    }
    setIsGenerating(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-800">
            <Sparkles className="h-5 w-5" /> {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-purple-600" />
            <p>A IA está estruturando o plano de ação tático...</p>
          </div>
        ) : fiveWtwoH ? (
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-purple-700 font-semibold">What (O que será feito?)</Label>
              <Textarea
                value={fiveWtwoH.what || ''}
                onChange={(e) => setFiveWtwoH({ ...fiveWtwoH, what: e.target.value })}
                className="h-10 min-h-[40px] resize-none text-sm"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-purple-700 font-semibold">Why (Por que será feito?)</Label>
              <Textarea
                value={fiveWtwoH.why || ''}
                onChange={(e) => setFiveWtwoH({ ...fiveWtwoH, why: e.target.value })}
                className="h-10 min-h-[40px] resize-none text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-purple-700 font-semibold">Where (Onde será feito?)</Label>
              <Input
                value={fiveWtwoH.where || ''}
                onChange={(e) => setFiveWtwoH({ ...fiveWtwoH, where: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-purple-700 font-semibold">When (Quando será feito?)</Label>
              <Input
                value={fiveWtwoH.when || ''}
                onChange={(e) => setFiveWtwoH({ ...fiveWtwoH, when: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-purple-700 font-semibold">Who (Quem fará?)</Label>
              <Input
                value={fiveWtwoH.who || ''}
                onChange={(e) => setFiveWtwoH({ ...fiveWtwoH, who: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-purple-700 font-semibold">How Much (Quanto custará?)</Label>
              <Input
                value={fiveWtwoH.howMuch || ''}
                onChange={(e) => setFiveWtwoH({ ...fiveWtwoH, howMuch: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-purple-700 font-semibold">How (Como será feito?)</Label>
              <Textarea
                value={fiveWtwoH.how || ''}
                onChange={(e) => setFiveWtwoH({ ...fiveWtwoH, how: e.target.value })}
                className="h-16 min-h-[60px] text-sm"
              />
            </div>
          </div>
        ) : null}

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onSave(fiveWtwoH)
              onOpenChange(false)
            }}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Aprovar e Integrar Ação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
