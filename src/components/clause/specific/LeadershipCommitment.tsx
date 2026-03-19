import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Workspace511 } from './Workspace511'
import { Culture512 } from './Culture512'
import { Governance513 } from './Governance513'

export function LeadershipCommitment() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">5.1 Liderança e Comprometimento</h3>
          <p className="text-sm text-muted-foreground">
            Demonstração de liderança, desenvolvimento da cultura e estrutura de governança.
          </p>
        </div>
      </div>
      <Tabs defaultValue="511">
        <TabsList className="mb-4 grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="511" className="text-xs sm:text-sm py-2">
            5.1.1 Alta Direção
          </TabsTrigger>
          <TabsTrigger value="512" className="text-xs sm:text-sm py-2">
            5.1.2 Cultura
          </TabsTrigger>
          <TabsTrigger value="513" className="text-xs sm:text-sm py-2">
            5.1.3 Governança
          </TabsTrigger>
        </TabsList>
        <TabsContent value="511">
          <Workspace511 />
        </TabsContent>
        <TabsContent value="512">
          <Culture512 />
        </TabsContent>
        <TabsContent value="513">
          <Governance513 />
        </TabsContent>
      </Tabs>
    </div>
  )
}
