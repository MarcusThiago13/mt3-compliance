import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { Handshake, ArrowLeft, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

import DadosGeraisTab from '@/components/osc/DadosGeraisTab'
import ChamamentoTab from '@/components/osc/ChamamentoTab'
import ExecucaoTab from '@/components/osc/ExecucaoTab'
import PrestacaoContasTab from '@/components/osc/PrestacaoContasTab'

export default function ParceriaDetalhes() {
  const { tenantId, id } = useParams<{ tenantId: string; id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [partnership, setPartnership] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const tab = searchParams.get('tab') || 'dados'

  const fetchPartnership = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('osc_partnerships' as any)
      .select('*')
      .eq('id', id)
      .single()
    if (error)
      toast({ title: 'Erro', description: 'Parceria não encontrada.', variant: 'destructive' })
    else setPartnership(data)
    setLoading(false)
  }

  useEffect(() => {
    if (id) fetchPartnership()
  }, [id])

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-700" />
      </div>
    )
  }

  if (!partnership) return null

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to={`/${tenantId}/osc/parcerias`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 truncate max-w-lg">
                {partnership.title}
              </h1>
              <Badge className="bg-purple-100 text-purple-800 border-none shadow-sm">
                {partnership.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Handshake className="h-4 w-4 mr-1.5" /> {partnership.public_entity} |{' '}
              {partnership.instrument_type}
            </p>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 max-w-4xl h-auto p-1 bg-purple-50">
          <TabsTrigger
            value="dados"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-purple-800"
          >
            Dados e Celebração
          </TabsTrigger>
          <TabsTrigger
            value="chamamento"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-purple-800"
          >
            Chamamento Público
          </TabsTrigger>
          <TabsTrigger
            value="execucao"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-purple-800"
          >
            Execução e Metas
          </TabsTrigger>
          <TabsTrigger
            value="prestacao"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-purple-800"
          >
            Prestação de Contas
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dados" className="outline-none m-0">
            <DadosGeraisTab partnership={partnership} onUpdate={fetchPartnership} />
          </TabsContent>
          <TabsContent value="chamamento" className="outline-none m-0">
            <ChamamentoTab partnership={partnership} />
          </TabsContent>
          <TabsContent value="execucao" className="outline-none m-0">
            <ExecucaoTab partnership={partnership} />
          </TabsContent>
          <TabsContent value="prestacao" className="outline-none m-0">
            <PrestacaoContasTab partnership={partnership} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
