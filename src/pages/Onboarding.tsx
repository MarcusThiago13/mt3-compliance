import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Step1 } from '@/components/onboarding/Step1'
import { Step2 } from '@/components/onboarding/Step2'
import { Step3 } from '@/components/onboarding/Step3'
import { Step4 } from '@/components/onboarding/Step4'
import { Step5 } from '@/components/onboarding/Step5'
import { Step6 } from '@/components/onboarding/Step6'

const steps = [
  'Identificação e Setores',
  'Governança e Estrutura',
  'Participações e Grupos',
  'Quadro de Efetivo',
  'Setor Público',
  'Sistema de Compliance',
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paramId = searchParams.get('id')

  const [currentStep, setCurrentStep] = useState(0)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [tenantData, setTenantData] = useState<any>({
    step_1: {},
    step_2: {},
    step_3: {},
    step_4: [],
    step_5: {},
    step_6: {},
  })

  useEffect(() => {
    if (paramId) {
      const fetchTenant = async () => {
        setIsProcessing(true)
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', paramId)
          .single()
        if (data && !error) {
          setTenantData({
            step_1: data.step_1 || {},
            step_2: data.step_2 || {},
            step_3: data.step_3 || {},
            step_4: data.step_4 || [],
            step_5: data.step_5 || {},
            step_6: data.step_6 || {},
          })
          setTenantId(data.id)
        }
        setIsProcessing(false)
      }
      fetchTenant()
    }
  }, [paramId])

  const updateStepData = (stepIndex: number, data: any) => {
    setTenantData((prev: any) => ({ ...prev, [`step_${stepIndex + 1}`]: data }))
  }

  const saveCurrentStep = async () => {
    let currentId = tenantId
    const currentStepData = tenantData[`step_${currentStep + 1}`]

    if (!currentId) {
      if (!tenantData.step_1.razao_social) {
        throw new Error('A Razão Social é obrigatória para iniciar o cadastro.')
      }

      const { data, error } = await supabase
        .from('tenants')
        .insert({
          name: tenantData.step_1.razao_social,
          cnpj: tenantData.step_1.cnpj || '',
          status: 'draft',
          step_1: currentStepData,
        })
        .select('id')
        .single()

      if (error) throw error
      if (data) {
        currentId = data.id
        setTenantId(data.id)
      }
    } else {
      await supabase
        .from('tenants')
        .update({
          name: tenantData.step_1.razao_social || 'Draft',
          cnpj: tenantData.step_1.cnpj || '',
          [`step_${currentStep + 1}`]: currentStepData,
        })
        .eq('id', currentId)
    }
    return currentId
  }

  const handleNext = async () => {
    setIsProcessing(true)
    try {
      const currentId = await saveCurrentStep()

      if (currentStep < steps.length - 1) {
        setCurrentStep((c) => c + 1)
      } else {
        const { data: tenant } = await supabase
          .from('tenants')
          .select('status')
          .eq('id', currentId)
          .single()

        if (tenant?.status === 'draft') {
          await supabase.from('tenants').update({ status: 'active' }).eq('id', currentId)

          const reportContent = `### Relatório de Perfil de Integridade (ISO 37301 Module 4.1)\n\n**Razão Social:** ${tenantData.step_1.razao_social}\n**CNPJ:** ${tenantData.step_1.cnpj}\n**Status:** Ativo\n\nEste relatório foi gerado automaticamente a partir dos dados consolidados no processo de onboarding.`

          await supabase.from('profile_reports').insert({
            tenant_id: currentId,
            content: reportContent,
          })

          toast({
            title: 'Onboarding Concluído',
            description: 'Ambiente isolado gerado e Relatório de Perfil emitido com sucesso.',
          })
        } else {
          toast({
            title: 'Atualização Concluída',
            description: 'Dados da organização atualizados com sucesso.',
          })
        }
        navigate('/tenants')
      }
    } catch (err: any) {
      toast({ title: 'Atenção', description: err.message, variant: 'destructive' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStepClick = async (index: number) => {
    if (index === currentStep || isProcessing) return

    if (!tenantId && !tenantData.step_1.razao_social) {
      if (index > 0) {
        toast({
          title: 'Atenção',
          description: 'Preencha a Razão Social para avançar.',
          variant: 'destructive',
        })
        return
      }
    }

    setIsProcessing(true)
    try {
      if (tenantData.step_1.razao_social) {
        await saveCurrentStep()
      }
      setCurrentStep(index)
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar o progresso',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1 data={tenantData.step_1} updateData={(d: any) => updateStepData(0, d)} />
      case 1:
        return <Step2 data={tenantData.step_2} updateData={(d: any) => updateStepData(1, d)} />
      case 2:
        return <Step3 data={tenantData.step_3} updateData={(d: any) => updateStepData(2, d)} />
      case 3:
        return <Step4 data={tenantData.step_4} updateData={(d: any) => updateStepData(3, d)} />
      case 4:
        return <Step5 data={tenantData.step_5} updateData={(d: any) => updateStepData(4, d)} />
      case 5:
        return <Step6 data={tenantData.step_6} updateData={(d: any) => updateStepData(5, d)} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">
        {tenantId ? 'Editar Cliente' : 'Onboarding de Novo Cliente'}
      </h1>

      <div className="flex items-center justify-between mb-8 relative hidden md:flex">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        {steps.map((s, i) => {
          const isClickable = tenantId || tenantData.step_1.razao_social
          return (
            <div
              key={s}
              className={`flex flex-col items-center gap-2 transition-opacity ${isClickable ? 'cursor-pointer hover:opacity-80' : 'opacity-60 cursor-not-allowed'}`}
              onClick={() => isClickable && handleStepClick(i)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${i === currentStep ? 'ring-2 ring-primary ring-offset-2' : ''} ${i <= currentStep ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'}`}
              >
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-[10px] uppercase font-semibold ${i <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {s.split(' ')[0]}
              </span>
            </div>
          )
        })}
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>
              {currentStep + 1}. {steps[currentStep]}
            </span>
            <span className="text-sm font-normal text-muted-foreground md:hidden">
              Passo {currentStep + 1} de {steps.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {isProcessing && !tenantData.step_1.razao_social && tenantId ? (
            <div className="flex justify-center items-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" /> Carregando...
            </div>
          ) : (
            renderStep()
          )}
        </CardContent>
        <CardFooter className="justify-between border-t pt-4 bg-muted/5">
          <Button
            variant="outline"
            disabled={currentStep === 0 || isProcessing}
            onClick={() => handleStepClick(currentStep - 1)}
          >
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">
              {tenantId ? 'Progresso salvo' : 'Não salvo'}
            </span>
            <Button
              onClick={handleNext}
              disabled={isProcessing}
              className={
                currentStep === steps.length - 1 ? 'bg-success hover:bg-success/90 text-white' : ''
              }
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentStep === steps.length - 1
                ? tenantId && tenantData.step_1.razao_social
                  ? 'Finalizar e Salvar'
                  : 'Finalizar e Ativar'
                : 'Salvar e Avançar'}
              {!isProcessing && currentStep < steps.length - 1 && (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
