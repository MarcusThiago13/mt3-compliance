import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CockpitOverview } from '@/components/intelligence/CockpitOverview'
import { IsoChecklist } from '@/components/intelligence/IsoChecklist'
import { DecreeReport } from '@/components/intelligence/DecreeReport'
import { OrgProfiling } from '@/components/intelligence/OrgProfiling'
import { GapAnalysis } from '@/components/intelligence/GapAnalysis'
import { Activity, FileText, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate, useParams } from 'react-router-dom'

export default function Intelligence() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Activity className="h-8 w-8" /> Inteligência e Certificação
          </h1>
          <p className="text-muted-foreground">
            Cockpit central de monitoramento avançado cruzando dados da ISO 37301:2021 e do Decreto
            11.129/2022.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Button
            onClick={() => navigate(`/${tenantId}/inbox`)}
            variant="outline"
            className="border-primary/30 text-primary shadow-sm whitespace-nowrap shrink-0 hover:bg-primary/5"
          >
            <Inbox className="mr-2 h-4 w-4" />
            Inbox de Validação
          </Button>
          <Button
            onClick={() => navigate(`/${tenantId}/dossier`)}
            className="bg-primary hover:bg-primary/90 shadow-md whitespace-nowrap shrink-0"
          >
            <FileText className="mr-2 h-4 w-4" />
            Gerar Dossiê Oficial
          </Button>
        </div>
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
