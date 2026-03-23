import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2, Sparkles, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { aiService } from '@/services/ai'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ComplianceChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { tenantId, id: routeId } = useParams<{ tenantId?: string; id?: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  // Safely get auth without breaking if used outside standard context
  const auth = useAuth()
  const user = auth?.user

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            'Olá! Sou o Claude, seu assistente de IA especialista no mt3 Compliance. Compreendo todo o contexto da tela em que você está. Como posso ajudar com MROSC, ISO 37301 ou guiar você pelo sistema agora?',
        },
      ])
    }
  }, [messages.length])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const extractPageContext = () => {
    const mainElement = document.querySelector('main')
    const text = mainElement ? mainElement.innerText : ''
    return {
      path: location.pathname,
      tenantId,
      routeId,
      userEmail: user?.email,
      pageText: text.substring(0, 2500), // Capture first 2500 chars for context
    }
  }

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return

    const userMessage = text.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const contextData = extractPageContext()

      const response = await aiService.chat(
        userMessage,
        messages.filter((m) => m.role === 'assistant' || m.role === 'user'),
        contextData,
      )

      if (response && response.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.message }])

        if (response.actions && response.actions.length > 0) {
          for (const action of response.actions) {
            if (action.action === 'NAVIGATE' && action.path) {
              toast({
                title: 'Ação Automática IA',
                description: `Executando redirecionamento solicitado para: ${action.path}`,
              })
              navigate(action.path)
            }
          }
        }
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

  const getQuickPrompts = () => {
    if (location.pathname.includes('/report') || location.pathname.includes('/status')) {
      return [
        'O que é considerado fraude e corrupção?',
        'Como o sistema garante meu anonimato total?',
        'Qual o prazo médio para apuração de um relato?',
      ]
    }
    if (location.pathname.includes('/osc')) {
      return [
        'Quais as regras do MROSC para elaboração do plano de trabalho?',
        'Como devo classificar uma despesa bancária no Demonstrativo (DID)?',
        'Quais as diretrizes para prestação de contas financeiras com a Administração Pública?',
        'Navegar para Central de Prestações de Contas',
      ]
    }
    return [
      'Quais são os principais requisitos da ISO 37301:2021?',
      'Como avaliar adequadamente um risco de compliance na matriz?',
      'Navegar para o Dashboard Global de Organizações',
    ]
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="w-[340px] sm:w-[400px] h-[550px] mb-4 shadow-2xl flex flex-col border-primary/20 animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
          <CardHeader className="p-3 border-b bg-primary/5 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-sm font-bold flex items-center text-primary">
              <Sparkles className="h-4 w-4 mr-2" /> Consultor IA (Onipresente)
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
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm whitespace-pre-wrap leading-relaxed ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted border rounded-tl-sm text-foreground'}`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2 bg-muted border flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">
                        Analisando tela e conhecimento normativo...
                      </span>
                    </div>
                  </div>
                )}

                {!isLoading && messages.length === 1 && (
                  <div className="mt-4 flex flex-col gap-2">
                    <span className="text-xs font-semibold text-muted-foreground px-1 uppercase tracking-wider">
                      Sugestões com base no contexto atual:
                    </span>
                    {getQuickPrompts().map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="text-left text-xs bg-background border hover:bg-muted/50 p-2.5 rounded-lg text-foreground transition-colors flex items-center gap-2"
                      >
                        {prompt.startsWith('Navegar') ? (
                          <Navigation className="h-3 w-3 text-primary shrink-0" />
                        ) : (
                          <MessageSquare className="h-3 w-3 text-primary shrink-0" />
                        )}
                        <span className="leading-tight">{prompt}</span>
                      </button>
                    ))}
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
                placeholder="Pergunte sobre a tela, leis ou peça para navegar..."
                className="min-h-[40px] h-12 resize-none py-3 text-sm bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:bg-background"
              />
              <Button
                size="icon"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="h-12 w-12 shrink-0 rounded-full shadow-sm"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:scale-105 group"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
        )}
      </Button>
    </div>
  )
}
