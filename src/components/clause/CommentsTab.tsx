import { MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function CommentsTab() {
  return (
    <div className="space-y-6 flex flex-col h-[400px]">
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border-b pb-4">
        <div className="text-center space-y-2">
          <MessageSquare className="h-8 w-8 mx-auto opacity-20" />
          <p>Nenhum comentário registrado ainda.</p>
        </div>
      </div>

      <div className="flex gap-2 items-start bg-background pt-2">
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
