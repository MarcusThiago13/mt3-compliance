import { Accessibility } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EstudosCasoTab } from '@/components/osc/inclusive/EstudosCasoTab'
import { PlanosTab } from '@/components/osc/inclusive/PlanosTab'
import { EquipeTab } from '@/components/osc/inclusive/EquipeTab'
import { IndicadoresTab } from '@/components/osc/inclusive/IndicadoresTab'
import { UnidadesEstudantesTab } from '@/components/osc/inclusive/UnidadesEstudantesTab'

export default function EducacaoInclusiva() {
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
            <Accessibility className="h-8 w-8" /> Educação Especial Inclusiva
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão de Estudos de Caso, PAEE, PEI e acompanhamento da equipe multiprofissional.
          </p>
        </div>
      </div>

      <Tabs defaultValue="unidades" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-5 lg:w-[900px] h-auto p-1 bg-blue-50">
          <TabsTrigger
            value="unidades"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-800"
          >
            Unidades e Estudantes
          </TabsTrigger>
          <TabsTrigger
            value="estudos"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-800"
          >
            Estudos de Caso
          </TabsTrigger>
          <TabsTrigger
            value="planos"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-800"
          >
            PAEE e PEI
          </TabsTrigger>
          <TabsTrigger
            value="equipe"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-800"
          >
            Equipe e Formação
          </TabsTrigger>
          <TabsTrigger
            value="indicadores"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-800"
          >
            Indicadores
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="unidades" className="outline-none m-0">
            <UnidadesEstudantesTab tenantId={tenantId} />
          </TabsContent>
          <TabsContent value="estudos" className="outline-none m-0">
            <EstudosCasoTab tenantId={tenantId} />
          </TabsContent>
          <TabsContent value="planos" className="outline-none m-0">
            <PlanosTab tenantId={tenantId} />
          </TabsContent>
          <TabsContent value="equipe" className="outline-none m-0">
            <EquipeTab tenantId={tenantId} />
          </TabsContent>
          <TabsContent value="indicadores" className="outline-none m-0">
            <IndicadoresTab tenantId={tenantId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
