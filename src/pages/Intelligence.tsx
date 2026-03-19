import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CockpitOverview } from '@/components/intelligence/CockpitOverview'
import { IsoChecklist } from '@/components/intelligence/IsoChecklist'
import { DecreeReport } from '@/components/intelligence/DecreeReport'
import { OrgProfiling } from '@/components/intelligence/OrgProfiling'
import { GapAnalysis } from '@/components/intelligence/GapAnalysis'
import { Activity } from 'lucide-react'

export default function Intelligence() {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col gap-2 border-b pb-4">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Activity className="h-8 w-8" /> Inteligência e Certificação
        </h1>
        <p className="text-muted-foreground">
          Cockpit central de monitoramento avançado cruzando dados da ISO 37301:2021 e do Decreto
          11.129/2022.
        </p>
      </div>

      <Tabs defaultValue="cockpit" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 gap-1">
          <TabsTrigger value="cockpit" className="py-2.5 text-xs sm:text-sm">
            Visão Global
          </TabsTrigger>
          <TabsTrigger value="iso" className="py-2.5 text-xs sm:text-sm">
            ISO 37301
          </TabsTrigger>
          <TabsTrigger value="decreto" className="py-2.5 text-xs sm:text-sm">
            Decreto 11.129/22
          </TabsTrigger>
          <TabsTrigger value="profiling" className="py-2.5 text-xs sm:text-sm">
            Perfil da Organização
          </TabsTrigger>
          <TabsTrigger value="gaps" className="py-2.5 text-xs sm:text-sm">
            Gap Analysis
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="cockpit" className="m-0 outline-none">
            <CockpitOverview />
          </TabsContent>
          <TabsContent value="iso" className="m-0 outline-none">
            <IsoChecklist />
          </TabsContent>
          <TabsContent value="decreto" className="m-0 outline-none">
            <DecreeReport />
          </TabsContent>
          <TabsContent value="profiling" className="m-0 outline-none">
            <OrgProfiling />
          </TabsContent>
          <TabsContent value="gaps" className="m-0 outline-none">
            <GapAnalysis />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
