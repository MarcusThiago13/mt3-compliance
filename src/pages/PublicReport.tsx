import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom'
import { ShieldCheck, Lock, EyeOff, User, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { whistleblowingService } from '@/services/whistleblowing'
import { toast } from '@/hooks/use-toast'

export default function PublicReport() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()

  const isValidUUID = tenantId
    ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantId)
    : false

  const [tenantName, setTenantName] = useState('Organização')
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ protocol: string; pass: string } | null>(null)

  const [formData, setFormData] = useState({
    is_anonymous: true,
    reporter_name: '',
    reporter_email: '',
    reporter_phone: '',
    category: '',
    description: '',
    involved_persons: '',
    incident_date_start: '',
    incident_location: '',
  })

  useEffect(() => {
    if (isValidUUID && tenantId) {
      supabase
        .from('tenants')
        .select('name')
        .eq('id', tenantId)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            setTenantName('Organização (Não Encontrada)')
          } else {
            setTenantName(data.name)
          }
        })
    }
  }, [tenantId, isValidUUID])

  const handleNext = () => setStep((s) => s + 1)
  const handleBack = () => setStep((s) => s - 1)

  const handleSubmit = async () => {
    if (!formData.category || !formData.description) {
      toast({
        title: 'Atenção',
        description: 'Categoria e descrição são obrigatórias.',
        variant: 'destructive',
      })
      return
    }
    setIsSubmitting(true)
    try {
      const protocol =
        'DEN-' +
        new Date().getFullYear() +
        '-' +
        Math.random().toString(36).substring(2, 8).toUpperCase()

      const pass = Math.random().toString(36).substring(2, 10).padEnd(8, 'X').toUpperCase()

      await whistleblowingService.submitReport({
        tenant_id: tenantId,
        protocol_number: protocol,
        access_password_hash: pass,
        is_anonymous: formData.is_anonymous,
        reporter_name: formData.is_anonymous ? null : formData.reporter_name,
        reporter_email: formData.is_anonymous ? null : formData.reporter_email,
        reporter_phone: formData.is_anonymous ? null : formData.reporter_phone,
        category: formData.category,
        description: formData.description,
        involved_persons: formData.involved_persons,
        incident_date_start: formData.incident_date_start || null,
        incident_location: formData.incident_location,
      })
      setResult({ protocol, pass })
      setStep(3)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isValidUUID) {
    return <Navigate to="/404" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg">
            <ShieldCheck className="h-6 w-6" /> Canal de Denúncias Seguro
          </div>
          <div className="text-sm opacity-90">{tenantName}</div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-4">Bem-vindo ao Canal Seguro</h1>
              <div className="text-slate-600 text-lg">
                Este ambiente garante proteção absoluta e "Zero Tracking". Seu IP e dados de
                navegação não são registrados.
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card
                className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-slate-400"
                onClick={() => {
                  setFormData({ ...formData, is_anonymous: true })
                  handleNext()
                }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <EyeOff className="h-12 w-12 mx-auto text-slate-500" />
                  <h3 className="font-bold text-xl">Denúncia Anônima</h3>
                  <div className="text-sm text-slate-500">
                    Nenhum dado pessoal será solicitado. Sua identidade será totalmente preservada.
                  </div>
                  <Button variant="outline" className="w-full">
                    Escolher Anônima
                  </Button>
                </CardContent>
              </Card>
              <Card
                className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary"
                onClick={() => {
                  setFormData({ ...formData, is_anonymous: false })
                  handleNext()
                }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <User className="h-12 w-12 mx-auto text-primary" />
                  <h3 className="font-bold text-xl">Denúncia Identificada</h3>
                  <div className="text-sm text-slate-500">
                    Seus dados serão mantidos em sigilo pelo Comitê de Ética. Ajuda na comunicação
                    direta.
                  </div>
                  <Button className="w-full">Escolher Identificada</Button>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8 pt-8 border-t">
              <div className="text-sm text-slate-500 mb-4">
                Já possui um protocolo em andamento?
              </div>
              <Button variant="link" asChild>
                <Link to={`/r/${tenantId}/status`}>
                  Acompanhar Relato Existente <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {step === 1 && !formData.is_anonymous && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Seus Dados (Sigilo Garantido)</CardTitle>
              <CardDescription>
                Estes dados serão visíveis apenas para a equipe restrita de investigação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input
                  value={formData.reporter_name}
                  onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={formData.reporter_email}
                  onChange={(e) => setFormData({ ...formData, reporter_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={formData.reporter_phone}
                  onChange={(e) => setFormData({ ...formData, reporter_phone: e.target.value })}
                />
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                  Voltar
                </Button>
                <Button onClick={handleNext}>Avançar</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {(step === 1 && formData.is_anonymous) || step === 2 ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Detalhes do Relato</CardTitle>
              <CardDescription>
                Descreva o ocorrido com o máximo de detalhes (Metodologia 5W2H).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Categoria da Infração *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fraude">Fraude e Corrupção</SelectItem>
                    <SelectItem value="Assédio">Assédio Moral ou Sexual</SelectItem>
                    <SelectItem value="Conflito">Conflito de Interesses</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>O que aconteceu? (Descrição Detalhada) *</Label>
                <Textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Quem está envolvido? (Nomes/Cargos)</Label>
                <Input
                  value={formData.involved_persons}
                  onChange={(e) => setFormData({ ...formData, involved_persons: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quando aconteceu?</Label>
                  <Input
                    type="date"
                    value={formData.incident_date_start}
                    onChange={(e) =>
                      setFormData({ ...formData, incident_date_start: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Onde aconteceu?</Label>
                  <Input
                    value={formData.incident_location}
                    onChange={(e) =>
                      setFormData({ ...formData, incident_location: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-between pt-6 border-t">
                <Button variant="ghost" onClick={handleBack}>
                  Voltar
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Enviar
                  Denúncia
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {step === 3 && result && (
          <Card className="border-emerald-500 shadow-lg text-center py-8">
            <CardContent className="space-y-6">
              <CheckCircle2 className="h-16 w-16 mx-auto text-emerald-500" />
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Relato Enviado com Sucesso</h2>
                <div className="text-slate-600 mt-2">
                  Guarde as credenciais abaixo para acessar a Sala Segura. Elas não poderão ser
                  recuperadas se perdidas.
                </div>
              </div>
              <div className="bg-slate-100 p-6 rounded-lg max-w-sm mx-auto space-y-4">
                <div>
                  <div className="text-sm font-bold text-slate-500 uppercase">Protocolo</div>
                  <div className="text-2xl font-mono text-primary select-all">
                    {result.protocol}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-500 uppercase">Senha de Acesso</div>
                  <div className="text-2xl font-mono text-primary select-all">{result.pass}</div>
                </div>
              </div>
              <div className="pt-4 flex justify-center gap-4">
                <Button asChild>
                  <Link to={`/r/${tenantId}/status`}>
                    Acessar Sala Segura <Lock className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
