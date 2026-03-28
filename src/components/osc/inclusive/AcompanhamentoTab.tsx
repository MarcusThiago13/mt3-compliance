import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DiarioBordoTab } from './acompanhamento/DiarioBordoTab'
import { RegistroTecnicoTab } from './acompanhamento/RegistroTecnicoTab'
import { ClipboardList, Stethoscope } from 'lucide-react'

export function AcompanhamentoTab({ tenantId }: { tenantId?: string }) {
  if (!tenantId) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Acompanhamento e Monitoramento</h2>
          <p className="text-muted-foreground mt-1">
            Registros diários de profissionais de apoio e acompanhamento multiprofissional da equipe
            técnica.
          </p>
        </div>
      </div>

      <Tabs defaultValue="diario" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[500px]">
          <TabsTrigger value="diario" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Diário de Bordo
          </TabsTrigger>
          <TabsTrigger value="tecnico" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Registro Técnico
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="diario" className="m-0 outline-none">
            <DiarioBordoTab tenantId={tenantId} />
          </TabsContent>
          <TabsContent value="tecnico" className="m-0 outline-none">
            <RegistroTecnicoTab tenantId={tenantId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
