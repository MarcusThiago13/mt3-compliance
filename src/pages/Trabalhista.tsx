import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Briefcase, Loader2, ShieldCheck, Target, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'

import { PerfilLaboralTab } from '@/components/trabalhista/PerfilLaboralTab'
import { ObrigacoesTrabalhistasTab } from '@/components/trabalhista/ObrigacoesTrabalhistasTab'
import { VinculosTab } from '@/components/trabalhista/VinculosTab'
import { JornadaTrabalhoTab } from '@/components/trabalhista/JornadaTrabalhoTab'
import { SSTTab } from '@/components/trabalhista/SSTTab'
import { TerceirizacaoTab } from '@/components/trabalhista/TerceirizacaoTab'
import { PoliticasLgpdTab } from '@/components/trabalhista/PoliticasLgpdTab'
import { AuditoriaRiscoTab } from '@/components/trabalhista/AuditoriaRiscoTab'

export default function Trabalhista() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { activeTenant } = useAppStore()
  const [tenant, setTenant] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchTenant = async () => {
    if (!tenantId) return
    setLoading(true)
    const { data } = await supabase.from('tenants').select('*').eq('id', tenantId).single()
    if (data) setTenant(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTenant()
  }, [tenantId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!tenant) return null

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Briefcase className="h-8 w-8" /> Compliance Trabalhista e Laboral
          </h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            Gestão transversal de vínculos, SST, terceirizados e eSocial. Adaptado dinamicamente
            para{' '}
            {tenant.org_type === 'poder_publico'
              ? 'Órgãos Públicos'
              : tenant.org_type === 'osc'
                ? 'OSCs'
                : 'Empresas Privadas'}
            .
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
        <Tabs defaultValue="perfil" className="w-full min-w-max">
          <TabsList className="flex w-full h-auto p-1.5 bg-slate-100/80 rounded-lg justify-start gap-1.5 border border-slate-200 overflow-x-auto">
            <TabsTrigger
              value="perfil"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Perfil Laboral
            </TabsTrigger>
            <TabsTrigger
              value="obrigacoes"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Obrigações
            </TabsTrigger>
            <TabsTrigger
              value="vinculos"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Vínculos e Contratos
            </TabsTrigger>
            <TabsTrigger
              value="jornada"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Jornada e Ponto
            </TabsTrigger>
            <TabsTrigger
              value="sst"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              SST & eSocial
            </TabsTrigger>
            <TabsTrigger
              value="terceiros"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Terceirização
            </TabsTrigger>
            <TabsTrigger
              value="politicas"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Políticas, Canal e LGPD
            </TabsTrigger>
            <TabsTrigger
              value="auditoria"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Riscos e Auditoria
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="perfil" className="outline-none m-0">
              <PerfilLaboralTab tenant={tenant} onUpdate={fetchTenant} />
            </TabsContent>
            <TabsContent value="obrigacoes" className="outline-none m-0">
              <ObrigacoesTrabalhistasTab tenant={tenant} />
            </TabsContent>
            <TabsContent value="vinculos" className="outline-none m-0">
              <VinculosTab tenant={tenant} />
            </TabsContent>
            <TabsContent value="jornada" className="outline-none m-0">
              <JornadaTrabalhoTab tenant={tenant} />
            </TabsContent>
            <TabsContent value="sst" className="outline-none m-0">
              <SSTTab tenant={tenant} />
            </TabsContent>
            <TabsContent value="terceiros" className="outline-none m-0">
              <TerceirizacaoTab tenant={tenant} />
            </TabsContent>
            <TabsContent value="politicas" className="outline-none m-0">
              <PoliticasLgpdTab tenant={tenant} />
            </TabsContent>
            <TabsContent value="auditoria" className="outline-none m-0">
              <AuditoriaRiscoTab tenant={tenant} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
