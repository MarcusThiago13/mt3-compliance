import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { aiService } from '@/services/ai'
import { useParams, useLocation } from 'react-router-dom'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ComplianceChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou seu assistente especializado em ISO 37301, MROSC e Decreto 11.129/22. Como posso ajudar com a conformidade da sua organização hoje?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { tenantId, id: clauseId } = useParams<{ tenantId?: string; id?: string }>()
  const location = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Determine context automatically from current route
      let contextType = 'general'
      let contextId = tenantId

      if (location.pathname.includes('/osc/')) contextType = 'osc_mrosc'
      else if (clauseId) {
        contextType = 'iso_clause'
        contextId = clauseId
      }

      const response = await aiService.chat(userMessage, contextType, contextId)

      if (response && response.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.message }])
      } else {
        throw new Error('Resposta inválida do motor de IA')
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Houve um erro ao processar sua solicitação no motor de Inteligência Artificial. Por favor, tente novamente.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="w-80 sm:w-96 h-[500px] mb-4 shadow-2xl flex flex-col border-primary/20 animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
          <CardHeader className="p-3 border-b bg-primary/5 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-sm font-bold flex items-center text-primary">
              <Sparkles className="h-4 w-4 mr-2" /> Consultor IA
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden relative">
            <ScrollArea className="h-full w-full p-4" ref={scrollRef}>
              <div className="flex flex-col gap-3 pb-2">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted border rounded-tl-sm text-foreground'}`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2 bg-muted border flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">
                        Analisando base normativa...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t bg-background shrink-0">
            <div className="flex w-full items-center gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte sobre ISO, Leis, MROSC..."
                className="min-h-[40px] h-10 resize-none py-2 text-sm bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-background"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 shrink-0 rounded-full shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:scale-105"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  )
}
