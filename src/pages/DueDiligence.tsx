import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileSearch } from 'lucide-react'
import { DDProcessTable } from '@/components/due-diligence/DDProcessTable'
import { InternalDD } from '@/components/due-diligence/InternalDD'

export default function DueDiligence() {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <FileSearch className="h-8 w-8" />
            Due Diligence (KYC/KYS)
          </h1>
          <p className="text-muted-foreground mt-1">
            Abordagem baseada em risco para terceiros, colaboradores e operações de M&A.
          </p>
        </div>
      </div>

      <Tabs defaultValue="third-party" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 lg:w-[700px] h-auto p-1">
          <TabsTrigger value="third-party" className="py-2.5">
            Terceiros (Fornecedores)
          </TabsTrigger>
          <TabsTrigger value="internal" className="py-2.5">
            Interna (Colaboradores)
          </TabsTrigger>
          <TabsTrigger value="mna" className="py-2.5">
            M&A (Fusões/Aquisições)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="third-party" className="mt-6 outline-none">
          <DDProcessTable
            targetTypes={['Fornecedor', 'Parceiro']}
            title="Due Diligence de Terceiros"
            description="Avaliação de fornecedores e parceiros de negócios baseada no nível de risco inicial (Risk Scoring)."
          />
        </TabsContent>

        <TabsContent value="internal" className="mt-6 outline-none">
          <InternalDD />
        </TabsContent>

        <TabsContent value="mna" className="mt-6 outline-none">
          <DDProcessTable
            targetTypes={['M&A']}
            title="Due Diligence em M&A"
            description="Workflow e triagem específica para operações de Fusões e Aquisições (Decreto 11.129/2022)."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
