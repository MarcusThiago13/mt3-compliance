import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Roles531 } from './Roles531'
import { Roles532 } from './Roles532'
import { Roles533 } from './Roles533'
import { Roles534 } from './Roles534'

export function ResponsibilityMatrix() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">5.3 Matriz de Responsabilidades (RACI)</h3>
          <p className="text-sm text-muted-foreground">
            Atribuição e comunicação de papéis, responsabilidades e autoridades do SGC.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar Matriz Global
        </Button>
      </div>

      <Tabs defaultValue="531">
        <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-4 h-auto p-1 gap-1">
          <TabsTrigger value="531" className="text-xs sm:text-sm py-2">
            5.3.1 Governança
          </TabsTrigger>
          <TabsTrigger value="532" className="text-xs sm:text-sm py-2">
            5.3.2 Função Compliance
          </TabsTrigger>
          <TabsTrigger value="533" className="text-xs sm:text-sm py-2">
            5.3.3 Gestão
          </TabsTrigger>
          <TabsTrigger value="534" className="text-xs sm:text-sm py-2">
            5.3.4 Colaboradores
          </TabsTrigger>
        </TabsList>
        <TabsContent value="531">
          <Roles531 />
        </TabsContent>
        <TabsContent value="532">
          <Roles532 />
        </TabsContent>
        <TabsContent value="533">
          <Roles533 />
        </TabsContent>
        <TabsContent value="534">
          <Roles534 />
        </TabsContent>
      </Tabs>
    </div>
  )
}
