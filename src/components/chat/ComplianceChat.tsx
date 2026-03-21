import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, Loader2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { callAnthropicChat } from '@/lib/anthropic'
import { useAppStore } from '@/stores/main'

export function ComplianceChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string; references?: string[] }[]
  >([
    {
      role: 'assistant',
      content:
        'Olá! Sou o Especialista em Compliance virtual. Fui treinado com a base de conhecimento da sua organização. Posso tirar dúvidas sobre o Código de Conduta, políticas internas e procedimentos. Como posso ajudar?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { activeTenant } = useAppStore()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading, isOpen])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const response = await callAnthropicChat(
        userMsg,
        messages,
        activeTenant?.name || 'a organização',
      )
      setMessages((prev) => [...prev, response])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Desculpe, ocorreu um erro ao processar sua consulta.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Só exibe o chat se houver um tenant ativo (ambiente da organização)
  if (!activeTenant) return null

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 z-50 transition-transform hover:scale-105"
        title="Chat de Consulta de Compliance"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0 h-full border-l shadow-2xl z-[100]">
          <SheetHeader className="p-4 border-b bg-muted/30">
            <SheetTitle className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              Chat do Especialista
            </SheetTitle>
            <SheetDescription className="text-xs">
              IA de consulta (RAG) integrada à base de conhecimento da{' '}
              <strong>{activeTenant.name}</strong>.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/50" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}

                <div
                  className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-white border border-border/60 rounded-tl-sm text-foreground'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.references && msg.references.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1.5 w-full">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                        Fontes consultadas:
                      </span>
                      {msg.references.map((ref, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-white border border-border/50 shadow-sm px-2.5 py-1.5 rounded-md w-full"
                        >
                          <FileText className="h-3 w-3 text-blue-500 shrink-0" />
                          <span className="truncate">{ref}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary border flex items-center justify-center shrink-0 mt-1">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-border/60 rounded-tl-sm flex items-center gap-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Analisando base de documentos...
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2 relative"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte sobre políticas, brindes..."
                className="flex-1 pr-12 h-12 rounded-xl bg-slate-50 focus-visible:ring-primary/20"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="absolute right-1 top-1 bottom-1 h-10 w-10 rounded-lg shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-muted-foreground">
                O Chat IA pode cometer erros. Consulte sempre a documentação oficial da organização.
              </span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
