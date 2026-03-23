import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, Lock } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'

import { DashboardDigitalTab } from '@/components/digital/DashboardDigitalTab'
import { PerfilDigitalTab } from '@/components/digital/PerfilDigitalTab'
import { RopaTab } from '@/components/digital/RopaTab'
import { TitularesTab } from '@/components/digital/TitularesTab'
import { IncidentesTab } from '@/components/digital/IncidentesTab'
import { GovernancaDigitalTab } from '@/components/digital/GovernancaDigitalTab'

export default function DigitalCompliance() {
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
            <Lock className="h-8 w-8" /> Compliance Digital e LGPD
          </h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            Governança de privacidade, proteção de dados e segurança da informação integrada ao
            ecossistema do{' '}
            {tenant.org_type === 'poder_publico'
              ? 'Órgão Público'
              : tenant.org_type === 'osc'
                ? 'OSC'
                : 'Empresa Privada'}
            .
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
        <Tabs defaultValue="dashboard" className="w-full min-w-max">
          <TabsList className="flex w-full h-auto p-1.5 bg-slate-100/80 rounded-lg justify-start gap-1.5 border border-slate-200 overflow-x-auto">
            <TabsTrigger
              value="dashboard"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="perfil"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Perfil & Encarregado (DPO)
            </TabsTrigger>
            <TabsTrigger
              value="ropa"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Inventário de Dados (RoPA)
            </TabsTrigger>
            <TabsTrigger
              value="titulares"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Direitos dos Titulares
            </TabsTrigger>
            <TabsTrigger
              value="incidentes"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Incidentes de Segurança
            </TabsTrigger>
            <TabsTrigger
              value="governanca"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all shrink-0"
            >
              Governança, RIPD e Terceiros
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="dashboard" className="outline-none m-0">
              <DashboardDigitalTab tenant={tenant} />
            </TabsContent>
            <TabsContent value="perfil" className="outline-none m-0">
              <PerfilDigitalTab tenant={tenant} onUpdate={fetchTenant} />
            </TabsContent>
            <TabsContent value="ropa" className="outline-none m-0">
              <RopaTab tenant={tenant} />
            </TabsContent>
            <TabsContent value="titulares" className="outline-none m-0">
              <TitularesTab tenant={tenant} />
            </TabsContent>
            <TabsContent value="incidentes" className="outline-none m-0">
              <IncidentesTab tenant={tenant} />
            </TabsContent>
            <TabsContent value="governanca" className="outline-none m-0">
              <GovernancaDigitalTab tenant={tenant} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
