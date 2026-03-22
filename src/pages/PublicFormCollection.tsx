import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShieldCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { collectionService } from '@/services/collection'
import { toast } from '@/hooks/use-toast'

import { Step1 } from '@/components/onboarding/Step1'
import { Step2 } from '@/components/onboarding/Step2'
import { Step3 } from '@/components/onboarding/Step3'
import { Step4 } from '@/components/onboarding/Step4'
import { Step5 } from '@/components/onboarding/Step5'
import { Step6 } from '@/components/onboarding/Step6'
import { Textarea } from '@/components/ui/textarea'

export default function PublicFormCollection() {
  const { token } = useParams<{ token: string }>()

  const [loading, setLoading] = useState(true)
  const [tokenData, setTokenData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Context State
  const [orgContext, setOrgContext] = useState('')
  const [externalIssues, setExternalIssues] = useState<Record<string, string>>({
    Regulatório: '',
    Legal: '',
    Econômico: '',
    Político: '',
    Social: '',
    Cultural: '',
    Ambiental: '',
  })
  const [internalIssues, setInternalIssues] = useState<Record<string, string>>({
    'Estrutura Organizacional': '',
    Governança: '',
    'Políticas e Objetivos': '',
    'Processos Operacionais': '',
    'Recursos (Humanos, Fin, Tech)': '',
    'Maturidade de TI': '',
  })

  // Onboarding State
  const [onboardingData, setOnboardingData] = useState<any>({
    step_1: {},
    step_2: {},
    step_3: {},
    step_4: [],
    step_5: {},
    step_6: {},
  })

  useEffect(() => {
    if (token) {
      collectionService
        .getTokenDetails(token)
        .then((data) => setTokenData(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    } else {
      setError('Token ausente.')
      setLoading(false)
    }
  }, [token])

  const handleSubmit = async () => {
    if (!tokenData || !token) return
    setSubmitting(true)
    try {
      const payload =
        tokenData.form_type === 'onboarding'
          ? onboardingData
          : { externalIssues, internalIssues, orgContext }

      await collectionService.submitForm(token, payload)
      setSubmitted(true)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  if (error || !tokenData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center py-8">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle className="mb-2">Link Inválido</CardTitle>
          <p className="text-muted-foreground text-sm">{error}</p>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center py-8 border-emerald-200">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <CardTitle className="mb-2 text-emerald-800">Dados Enviados!</CardTitle>
          <p className="text-emerald-700/80 text-sm px-6 mt-2">
            Obrigado. Suas informações foram enviadas com sucesso e o administrador do sistema já
            foi notificado. Este link não é mais válido.
          </p>
        </Card>
      </div>
    )
  }

  const isContext = tokenData.form_type === 'context'
  const isOnboarding = tokenData.form_type === 'onboarding'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md shrink-0">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg">
            <ShieldCheck className="h-6 w-6" /> Coleta de Informações (Seguro)
          </div>
          <div className="text-sm opacity-90">{tokenData.tenants?.name || 'Cliente'}</div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 animate-fade-in pb-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            {isContext ? 'Contexto da Organização' : 'Perfil da Organização'}
          </h1>
          <p className="text-slate-600 mt-2">
            Por favor, preencha os formulários abaixo. O preenchimento é essencial para a
            estruturação do programa de integridade.
          </p>
        </div>

        {isOnboarding && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Identificação</CardTitle>
              </CardHeader>
              <CardContent>
                <Step1
                  data={onboardingData.step_1}
                  updateData={(d) => setOnboardingData({ ...onboardingData, step_1: d })}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Governança</CardTitle>
              </CardHeader>
              <CardContent>
                <Step2
                  data={onboardingData.step_2}
                  updateData={(d) => setOnboardingData({ ...onboardingData, step_2: d })}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Participações Societárias</CardTitle>
              </CardHeader>
              <CardContent>
                <Step3
                  data={onboardingData.step_3}
                  updateData={(d) => setOnboardingData({ ...onboardingData, step_3: d })}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4. Quadro de Efetivo</CardTitle>
              </CardHeader>
              <CardContent>
                <Step4
                  data={onboardingData.step_4}
                  updateData={(d) => setOnboardingData({ ...onboardingData, step_4: d })}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">5. Setor Público</CardTitle>
              </CardHeader>
              <CardContent>
                <Step5
                  data={onboardingData.step_5}
                  updateData={(d) => setOnboardingData({ ...onboardingData, step_5: d })}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">6. Sistema de Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <Step6
                  data={onboardingData.step_6}
                  updateData={(d) => setOnboardingData({ ...onboardingData, step_6: d })}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {isContext && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Descrição do Cenário</CardTitle>
                <CardDescription>
                  Resuma o mercado, porte e os principais desafios da organização.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={orgContext}
                  onChange={(e) => setOrgContext(e.target.value)}
                  placeholder="Ex: Atuamos no setor financeiro..."
                  rows={4}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Questões Externas (Oportunidades e Ameaças)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {Object.keys(externalIssues).map((topic) => (
                  <div key={topic} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">{topic}</label>
                    <Textarea
                      value={externalIssues[topic]}
                      onChange={(e) =>
                        setExternalIssues({ ...externalIssues, [topic]: e.target.value })
                      }
                      className="text-sm h-20"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questões Internas (Forças e Fraquezas)</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {Object.keys(internalIssues).map((topic) => (
                  <div key={topic} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">{topic}</label>
                    <Textarea
                      value={internalIssues[topic]}
                      onChange={(e) =>
                        setInternalIssues({ ...internalIssues, [topic]: e.target.value })
                      }
                      className="text-sm h-20"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            size="lg"
            className="w-full max-w-sm"
          >
            {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Finalizar e Enviar
          </Button>
        </div>
      </main>
    </div>
  )
}
