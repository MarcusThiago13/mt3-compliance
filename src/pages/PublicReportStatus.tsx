import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Lock, Send, ShieldCheck, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { whistleblowingService } from '@/services/whistleblowing'
import { toast } from '@/hooks/use-toast'

export default function PublicReportStatus() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [protocol, setProtocol] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [reportId, setReportId] = useState<string | null>(null)

  const [report, setReport] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!protocol || !password) return
    setIsLoggingIn(true)
    try {
      const id = await whistleblowingService.checkCredentials(protocol, password)
      if (id) {
        setReportId(id)
        fetchData(id)
      } else {
        toast({
          title: 'Acesso Negado',
          description: 'Protocolo ou senha incorretos.',
          variant: 'destructive',
        })
      }
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const fetchData = async (id: string) => {
    try {
      const r = await whistleblowingService.getReportForReporter(id)
      setReport(r)
      const m = await whistleblowingService.getMessages(id)
      setMessages(m)
    } catch (e: any) {
      toast({ title: 'Erro', description: 'Falha ao carregar dados.', variant: 'destructive' })
    }
  }

  const handleSend = async () => {
    if (!newMessage.trim() || !reportId) return
    setIsSending(true)
    try {
      await whistleblowingService.sendMessage(reportId, 'reporter', newMessage)
      setNewMessage('')
      fetchData(reportId)
    } catch (e: any) {
      toast({ title: 'Erro', description: 'Falha ao enviar mensagem.', variant: 'destructive' })
    } finally {
      setIsSending(false)
    }
  }

  if (!reportId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg animate-fade-in-up">
          <CardHeader className="text-center pb-2">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl text-slate-800">Sala Segura</CardTitle>
            <p className="text-sm text-slate-500 mt-2">
              Acompanhe seu relato e interaja de forma segura com a equipe de investigação.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Protocolo (ex: DEN-...)"
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Senha de Acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Acessar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg">
            <ShieldCheck className="h-6 w-6" /> Sala Segura do Denunciante
          </div>
          <div className="text-sm opacity-90">{report?.protocol_number}</div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6">
        <Card>
          <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-lg">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Status do Relato</h2>
              <p className="text-sm text-slate-500">
                Aberto em{' '}
                {report?.created_at ? new Date(report.created_at).toLocaleDateString() : ''}
              </p>
            </div>
            <Badge className="text-sm py-1 px-3 bg-slate-100 text-slate-800 uppercase tracking-wider">
              {report?.status.replace('_', ' ')}
            </Badge>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[500px]">
          <CardHeader className="border-b py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Chat Bidirecional Sigiloso
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <p className="text-center text-slate-400 mt-10">
                Nenhuma mensagem registrada ainda. A equipe entrará em contato por aqui caso precise
                de mais informações.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender_type === 'reporter' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 mb-1 ml-1">
                  {m.sender_type === 'reporter' ? 'Você' : 'Investigador'}
                </span>
                <div
                  className={`p-3 rounded-lg max-w-[80%] text-sm shadow-sm ${m.sender_type === 'reporter' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none'}`}
                >
                  {m.message}
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t bg-white flex gap-2">
            <Textarea
              placeholder="Digite uma nova informação ou responda ao investigador..."
              className="resize-none min-h-[40px] h-12"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button onClick={handleSend} disabled={isSending} className="h-12 w-12 shrink-0">
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
