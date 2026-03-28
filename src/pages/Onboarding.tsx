import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, Loader2, Save, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Step1 } from '@/components/onboarding/Step1'
import { Step2 } from '@/components/onboarding/Step2'
import { Step3 } from '@/components/onboarding/Step3'
import { Step4 } from '@/components/onboarding/Step4'
import { Step5 } from '@/components/onboarding/Step5'
import { Step6 } from '@/components/onboarding/Step6'
import { cn } from '@/lib/utils'
import { GenerateLinkModal } from '@/components/shared/GenerateLinkModal'

const sections = [
  {
    id: 'identificacao',
    title: 'Identificação e Setores',
    component: Step1,
    stepKey: 'step_1' as const,
  },
  {
    id: 'governanca',
    title: 'Governança e Estrutura',
    component: Step2,
    stepKey: 'step_2' as const,
  },
  {
    id: 'participacoes',
    title: 'Participações e Grupos',
    component: Step3,
    stepKey: 'step_3' as const,
  },
  { id: 'efetivo', title: 'Quadro de Efetivo', component: Step4, stepKey: 'step_4' as const },
  {
    id: 'setor-publico',
    title: 'Relação com Setor Público',
    component: Step5,
    stepKey: 'step_5' as const,
  },
  {
    id: 'sistema-compliance',
    title: 'Sistema de Compliance',
    component: Step6,
    stepKey: 'step_6' as const,
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { tenantId: paramId } = useParams<{ tenantId?: string }>()

  const [tenantId, setTenantId] = useState<string | null>(paramId || null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [activeSection, setActiveSection] = useState(sections[0].id)

  const [tenantData, setTenantData] = useState<any>({
    step_1: {},
    step_2: {},
    step_3: {},
    step_4: [],
    step_5: {},
    step_6: {},
  })

  const isFirstRender = useRef(true)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const isFetching = useRef(false)
  const tenantIdRef = useRef<string | null>(paramId || null)

  useEffect(() => {
    tenantIdRef.current = tenantId
  }, [tenantId])

  useEffect(() => {
    if (paramId) {
      const fetchTenant = async () => {
        isFetching.current = true
        setIsProcessing(true)
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', paramId)
          .single()
        if (data && !error) {
          const tenantRecord = data as any
          setTenantData({
            step_1: {
              ...(tenantRecord.step_1 || {}),
              org_type: tenantRecord.org_type,
              public_relations: tenantRecord.public_relations,
              acting_areas: tenantRecord.acting_areas || [],
            },
            step_2: tenantRecord.step_2 || {},
            step_3: tenantRecord.step_3 || {},
            step_4: tenantRecord.step_4 || [],
            step_5: tenantRecord.step_5 || {},
            step_6: tenantRecord.step_6 || {},
          })
          setTenantId(tenantRecord.id)
        }
        setIsProcessing(false)
        setTimeout(() => {
          isFetching.current = false
        }, 500)
      }
      fetchTenant()
    }
  }, [paramId])

  const saveTenant = useCallback(async (dataToSave: any) => {
    setSaveStatus('saving')
    const currentId = tenantIdRef.current
    try {
      if (!currentId) {
        if (!dataToSave.step_1.razao_social) {
          setSaveStatus('idle')
          return currentId
        }
        const { data, error } = await supabase
          .from('tenants')
          .insert({
            name: dataToSave.step_1.razao_social,
            cnpj: dataToSave.step_1.cnpj || '',
            status: 'draft',
            org_type: dataToSave.step_1.org_type || 'empresa',
            public_relations:
              dataToSave.step_1.org_type === 'poder_publico'
                ? 'oculto'
                : dataToSave.step_1.public_relations || 'nao',
            acting_areas: dataToSave.step_1.acting_areas || [],
            step_1: dataToSave.step_1,
            step_2: dataToSave.step_2,
            step_3: dataToSave.step_3,
            step_4: dataToSave.step_4,
            step_5: dataToSave.step_5,
            step_6: dataToSave.step_6,
          } as any)
          .select('id')
          .single()

        if (error) throw error
        if (data) {
          setTenantId((data as any).id)
          return (data as any).id
        }
      } else {
        await supabase
          .from('tenants')
          .update({
            name: dataToSave.step_1.razao_social || 'Draft',
            cnpj: dataToSave.step_1.cnpj || '',
            org_type: dataToSave.step_1.org_type || 'empresa',
            public_relations:
              dataToSave.step_1.org_type === 'poder_publico'
                ? 'oculto'
                : dataToSave.step_1.public_relations || 'nao',
            acting_areas: dataToSave.step_1.acting_areas || [],
            step_1: dataToSave.step_1,
            step_2: dataToSave.step_2,
            step_3: dataToSave.step_3,
            step_4: dataToSave.step_4,
            step_5: dataToSave.step_5,
            step_6: dataToSave.step_6,
          } as any)
          .eq('id', currentId)
      }
      setSaveStatus('saved')
      setTimeout(() => {
        setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev))
      }, 3000)
      return currentId || tenantIdRef.current
    } catch (error) {
      setSaveStatus('error')
      return currentId
    }
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (isFetching.current) return
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      saveTenant(tenantData)
    }, 1500)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [tenantData, saveTenant])

  const updateStepData = (stepKey: string, data: any) => {
    setTenantData((prev: any) => ({ ...prev, [stepKey]: data }))
  }

  const handleFinalize = async () => {
    if (!tenantData.step_1.razao_social) {
      toast({
        title: 'Atenção',
        description: 'A Razão Social é obrigatória.',
        variant: 'destructive',
      })
      return
    }
    setIsProcessing(true)
    try {
      let finalTenantId = tenantIdRef.current
      if (!finalTenantId) finalTenantId = await saveTenant(tenantData)
      else await saveTenant(tenantData)

      if (!finalTenantId) throw new Error('Erro ao identificar a organização')

      const { data: tenant } = await supabase
        .from('tenants')
        .select('status')
        .eq('id', finalTenantId)
        .single()

      if ((tenant as any)?.status === 'draft') {
        await supabase
          .from('tenants')
          .update({ status: 'active' } as any)
          .eq('id', finalTenantId)
        const reportContent = `### Relatório de Perfil de Integridade (ISO 37301 Module 4.1)\n\n**Razão Social:** ${tenantData.step_1.razao_social}\n**CNPJ:** ${tenantData.step_1.cnpj}\n**Status:** Ativo\n\nEste relatório foi gerado automaticamente a partir dos dados consolidados no processo de onboarding.`
        await supabase
          .from('profile_reports')
          .insert({ tenant_id: finalTenantId, content: reportContent } as any)
        toast({ title: 'Onboarding Concluído', description: 'Ambiente isolado gerado.' })
      } else {
        toast({ title: 'Atualização Concluída', description: 'Dados da organização atualizados.' })
      }
      navigate(`/${finalTenantId}/clause/4.1`)
    } catch (err: any) {
      toast({ title: 'Atenção', description: err.message, variant: 'destructive' })
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150
      let currentActive = sections[0].id
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element && element.offsetTop <= scrollPosition) currentActive = section.id
      }
      setActiveSection(currentActive)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' })
  }

  const renderSaveStatus = () => {
    if (saveStatus === 'saving')
      return (
        <span className="flex items-center text-muted-foreground text-sm font-medium">
          <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" /> Salvando...
        </span>
      )
    if (saveStatus === 'saved')
      return (
        <span className="flex items-center text-success text-sm font-medium">
          <Check className="h-4 w-4 mr-2" /> Salvo na nuvem
        </span>
      )
    if (saveStatus === 'error')
      return (
        <span className="flex items-center text-destructive text-sm font-medium">
          <AlertCircle className="h-4 w-4 mr-2" /> Erro ao salvar
        </span>
      )
    return (
      <span className="flex items-center text-muted-foreground/60 text-sm">
        <Save className="h-4 w-4 mr-2" /> Salvamento automático ativo
      </span>
    )
  }

  const getProgress = () => {
    let completed = 0
    if (tenantData.step_1?.razao_social) completed++
    if (
      tenantData.step_2?.board_members?.length > 0 ||
      tenantData.step_2?.matrix_auth_required !== undefined
    )
      completed++
    if (tenantData.step_3?.equity_participations?.length >= 0) completed++
    if (tenantData.step_4?.length > 0) completed++
    if (tenantData.step_5?.contract_history?.length >= 0) completed++
    if (tenantData.step_6?.compliance_officer_name || tenantData.step_6?.compliance_inception_date)
      completed++
    return Math.round((completed / sections.length) * 100)
  }

  if (isProcessing && isFetching.current) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            {tenantId ? 'Perfil da Organização' : 'Onboarding de Novo Cliente'}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base">
            Preencha as informações cadastrais e de governança. O formulário é contínuo e salvo
            automaticamente.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {tenantId && <GenerateLinkModal tenantId={tenantId} formType="onboarding" />}
          <div className="hidden md:flex flex-col items-end bg-muted/30 px-4 py-2 rounded-lg border h-10 justify-center">
            {renderSaveStatus()}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative items-start">
        <aside className="w-full md:w-72 shrink-0 md:sticky md:top-24 self-start order-1 md:order-1 z-10">
          <div className="border rounded-xl p-5 bg-card shadow-sm mb-6 md:mb-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Progresso
              </h3>
              <span className="text-xs font-bold text-primary">{getProgress()}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="bg-primary h-2 transition-all duration-700 ease-out"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            <nav className="hidden md:block space-y-1 relative">
              <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-muted"></div>
              {sections.map((section, index) => {
                const isActive = activeSection === section.id
                let isCompleted = false
                if (index === 0 && tenantData.step_1.razao_social) isCompleted = true
                if (
                  index === 1 &&
                  (tenantData.step_2.board_members?.length > 0 ||
                    tenantData.step_2.matrix_auth_required !== undefined)
                )
                  isCompleted = true
                if (
                  index === 5 &&
                  (tenantData.step_6.compliance_officer_name ||
                    tenantData.step_6.compliance_inception_date)
                )
                  isCompleted = true
                if (index > 0 && index < 5 && tenantId) isCompleted = true

                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      'flex items-center w-full text-left py-2.5 px-2 rounded-lg transition-all relative z-10 group',
                      isActive
                        ? 'text-primary font-medium bg-primary/5'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-[10px] mr-3 border bg-card transition-all shrink-0 shadow-sm',
                        isActive
                          ? 'border-primary text-primary ring-4 ring-primary/10'
                          : 'border-muted-foreground/30',
                        isCompleted && !isActive
                          ? 'bg-primary text-primary-foreground border-primary'
                          : '',
                      )}
                    >
                      {isCompleted && !isActive ? <Check className="w-3 h-3" /> : index + 1}
                    </div>
                    <span className="text-sm truncate">{section.title}</span>
                  </button>
                )
              })}
            </nav>
            <div className="mt-8 pt-5 border-t">
              <Button
                onClick={handleFinalize}
                disabled={isProcessing || (!tenantId && !tenantData.step_1.razao_social)}
                className="w-full shadow-md"
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {tenantId ? 'Salvar e Voltar' : 'Criar Ambiente'}
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex-1 space-y-8 order-2 md:order-2 pb-32 min-w-0">
          {!tenantId && !tenantData.step_1.razao_social && (
            <div className="bg-primary/10 border border-primary/20 text-primary px-5 py-4 rounded-xl flex items-start shadow-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Ação Necessária</h4>
                <p className="text-sm opacity-90">
                  Preencha a <strong>Razão Social</strong> para habilitar o salvamento automático.
                </p>
              </div>
            </div>
          )}

          {sections.map((section, index) => {
            const Component = section.component
            const data = tenantData[section.stepKey]
            const isActive = activeSection === section.id

            return (
              <section key={section.id} id={section.id} className="scroll-mt-24 relative">
                {index < sections.length - 1 && (
                  <div className="hidden md:block absolute left-8 top-full bottom-[-2rem] w-px bg-muted z-0"></div>
                )}
                <Card
                  className={cn(
                    'transition-all duration-500 overflow-hidden relative z-10',
                    isActive
                      ? 'ring-2 ring-primary/20 shadow-lg border-primary/40 bg-card'
                      : 'shadow-sm hover:shadow-md border-border/60 bg-card/50',
                  )}
                >
                  <CardHeader
                    className={cn(
                      'border-b px-6 py-5 transition-colors',
                      isActive ? 'bg-primary/5' : 'bg-muted/10',
                    )}
                  >
                    <CardTitle className="flex items-center text-lg md:text-xl font-bold">
                      <span
                        className={cn(
                          'w-8 h-8 rounded-md flex items-center justify-center text-sm mr-4 shadow-sm transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {index + 1}
                      </span>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    <div
                      className={cn(
                        'transition-opacity duration-300',
                        !tenantId && !tenantData.step_1.razao_social && index > 0
                          ? 'opacity-40 pointer-events-none select-none blur-[1px]'
                          : 'opacity-100',
                      )}
                    >
                      <Component
                        data={data}
                        updateData={(d: any) => updateStepData(section.stepKey, d)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
