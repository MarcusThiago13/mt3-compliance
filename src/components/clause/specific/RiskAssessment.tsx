import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RiskDashboard } from './risk/RiskDashboard'
import { RiskInventory } from './risk/RiskInventory'
import { RiskTreatment } from './risk/RiskTreatment'
import { RiskMethodology } from './risk/RiskMethodology'
import { LayoutDashboard, ShieldAlert, ListTodo, Settings, Workflow } from 'lucide-react'

export function RiskAssessment() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" /> Motor de Gestão de Riscos
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Solução completa de núcleo transversal (ISO 37301 - 4.6). Registro, avaliação em
            camadas, integração de controles e desdobramento tático.
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4 bg-muted/50 p-1">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 py-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard Gerencial</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2 py-2">
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">Inventário (Workflows)</span>
          </TabsTrigger>
          <TabsTrigger value="treatments" className="flex items-center gap-2 py-2">
            <ListTodo className="h-4 w-4" />
            <span className="hidden sm:inline">Tratamentos e Respostas</span>
          </TabsTrigger>
          <TabsTrigger value="methodology" className="flex items-center gap-2 py-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Matriz e Metodologia</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="m-0">
            <RiskDashboard />
          </TabsContent>
          <TabsContent value="inventory" className="m-0">
            <RiskInventory />
          </TabsContent>
          <TabsContent value="treatments" className="m-0">
            <RiskTreatment />
          </TabsContent>
          <TabsContent value="methodology" className="m-0">
            <RiskMethodology />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
