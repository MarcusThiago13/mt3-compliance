import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, Loader2, FileText, Paperclip, X } from 'lucide-react'
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
import { uploadDocument, getDocumentUrl } from '@/lib/upload'
import { extractTextFromFile } from '@/lib/document-parser'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  references?: string[]
  attachmentUrl?: string
  attachmentName?: string
}

export function ComplianceChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou o Especialista em Compliance virtual. Posso tirar dúvidas sobre o Código de Conduta e políticas internas. Você também pode anexar documentos ou imagens para eu analisar.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { activeTenant } = useAppStore()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading, isOpen, selectedFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return

    const userMsg = input.trim() || 'Analise este anexo.'
    setInput('')
    setIsLoading(true)

    let attachmentPayload: any = undefined
    let attachmentUrl: string | undefined = undefined
    let attachmentName: string | undefined = undefined

    const fileToProcess = selectedFile
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''

    if (fileToProcess && activeTenant) {
      attachmentName = fileToProcess.name
      const { path } = await uploadDocument(fileToProcess, activeTenant.id)

      if (path) {
        const url = await getDocumentUrl(path)
        if (url) attachmentUrl = url

        if (fileToProcess.type.startsWith('image/')) {
          const base64 = await fileToBase64(fileToProcess)
          let mediaType = fileToProcess.type
          if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mediaType)) {
            mediaType = 'image/jpeg'
          }
          attachmentPayload = { type: 'image', mediaType, data: base64 }
        } else {
          const text = await extractTextFromFile(fileToProcess)
          attachmentPayload = { type: 'document', text }
        }
      }
    }

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMsg, attachmentUrl, attachmentName },
    ])

    try {
      const historyTexts = messages.map((m) => ({ role: m.role, content: m.content }))
      const response = await callAnthropicChat(
        userMsg,
        historyTexts,
        activeTenant?.name || 'a organização',
        activeTenant?.id,
        attachmentPayload,
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
              IA multimodal integrada à base de conhecimento de <strong>{activeTenant.name}</strong>
              .
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
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-white border border-border/60 rounded-tl-sm text-foreground'
                    }`}
                  >
                    {msg.attachmentUrl && (
                      <div className="mb-2">
                        {msg.attachmentName?.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                          <img
                            src={msg.attachmentUrl}
                            alt="Anexo"
                            className="max-w-[200px] max-h-[200px] object-cover rounded-md border border-primary-foreground/20"
                          />
                        ) : (
                          <div className="flex items-center gap-2 bg-primary-foreground/10 p-2 rounded-md border border-primary-foreground/20">
                            <FileText className="w-4 h-4 shrink-0" />
                            <span className="truncate text-xs max-w-[150px]">
                              {msg.attachmentName}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
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
                    Analisando dados...
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            {selectedFile && (
              <div className="mb-3 inline-flex items-center gap-2 bg-slate-100 p-2.5 rounded-lg text-xs border border-border shadow-sm">
                <Paperclip className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate max-w-[200px] text-slate-700 font-medium">
                  {selectedFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2 relative"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1 bottom-1 h-10 w-10 text-slate-400 hover:text-primary z-10"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                title="Anexar arquivo ou imagem"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte ou anexe um arquivo..."
                className="flex-1 pl-12 pr-12 h-12 rounded-xl bg-slate-50 focus-visible:ring-primary/20"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={(!input.trim() && !selectedFile) || isLoading}
                className="absolute right-1 top-1 bottom-1 h-10 w-10 rounded-lg shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-muted-foreground">
                O Chat IA pode cometer erros. Consulte a documentação oficial.
              </span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
