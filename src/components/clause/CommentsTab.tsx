import { MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function CommentsTab() {
  return (
    <div className="space-y-6 flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://img.usecurling.com/ppl/thumbnail?seed=${i}`} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 bg-muted p-3 rounded-lg rounded-tl-none text-sm w-full">
              <div className="flex justify-between font-semibold">
                <span>{i === 1 ? 'Auditor Interno' : 'Gestor de Compliance'}</span>
                <span className="text-xs text-muted-foreground font-normal">Ontem 14:30</span>
              </div>
              <p>
                Por favor, revisar a última versão da política de brindes para garantir aderência a
                este requisito.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-start bg-background pt-2 border-t">
        <Textarea
          placeholder="Adicione um comentário ou observação para a auditoria..."
          className="resize-none h-10 min-h-[40px]"
        />
        <Button
          size="icon"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
