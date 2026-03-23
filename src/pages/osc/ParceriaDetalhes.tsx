import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { Handshake, ArrowLeft, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

import GestaoGeralTab from '@/components/osc/GestaoGeralTab'
import HabilitacaoCelebracaoTab from '@/components/osc/HabilitacaoCelebracaoTab'
import PlanoTrabalhoTab from '@/components/osc/PlanoTrabalhoTab'
import ExecucaoTab from '@/components/osc/ExecucaoTab'
import PrestacaoContasTab from '@/components/osc/PrestacaoContasTab'
import TransparenciaTab from '@/components/osc/TransparenciaTab'
import AtuacaoRedeTab from '@/components/osc/AtuacaoRedeTab'
import EncerramentoTab from '@/components/osc/EncerramentoTab'
import HistoricoComplianceTab from '@/components/osc/HistoricoComplianceTab'

export default function ParceriaDetalhes() {
  const { tenantId, id } = useParams<{ tenantId: string; id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [partnership, setPartnership] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const tab = searchParams.get('tab') || 'gestao'

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

      <div className="w-full overflow-x-auto pb-2">
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full min-w-max">
          <TabsList className="flex w-full h-auto p-1 bg-slate-100/80 rounded-lg justify-start gap-1">
            <TabsTrigger value="gestao" className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Gestão Geral (B5)
            </TabsTrigger>
            <TabsTrigger value="habilitacao" className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Habilitação (B2)
            </TabsTrigger>
            <TabsTrigger value="plano" className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Plano de Trabalho (B3)
            </TabsTrigger>
            <TabsTrigger value="execucao" className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Execução (B4)
            </TabsTrigger>
            <TabsTrigger value="prestacao" className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm border-l-2 ml-1 border-amber-200">
              Contas & Finanças
            </TabsTrigger>
            <TabsTrigger value="transparencia" className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm ml-1">
              Transparência (B6)
            </TabsTrigger>
            <TabsTrigger value="rede" className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Rede (B7)
            </TabsTrigger>
            <TabsTrigger value="encerramento" className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Encerramento (B8/9)
            </TabsTrigger>
            <TabsTrigger value="historico" className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Histórico (B10)
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="gestao" className="outline-none m-0">
              <GestaoGeralTab partnership={partnership} onUpdate={fetchPartnership} />
            </TabsContent>
            <TabsContent value="habilitacao" className="outline-none m-0">
              <HabilitacaoCelebracaoTab partnership={partnership} />
            </TabsContent>
            <TabsContent value="plano" className="outline-none m-0">
              <PlanoTrabalhoTab partnership={partnership} />
            </TabsContent>
            <TabsContent value="execucao" className="outline-none m-0">
              <ExecucaoTab partnership={partnership} />
            </TabsContent>
            <TabsContent value="prestacao" className="outline-none m-0">
              <PrestacaoContasTab partnership={partnership} />
            </TabsContent>
            <TabsContent value="transparencia" className="outline-none m-0">
              <TransparenciaTab partnership={partnership} />
            </TabsContent>
            <TabsContent value="rede" className="outline-none m-0">
              <AtuacaoRedeTab partnership={partnership} />
            </TabsContent>
            <TabsContent value="encerramento" className="outline-none m-0">
              <EncerramentoTab partnership={partnership} />
            </TabsContent>
            <TabsContent value="historico" className="outline-none m-0">
              <HistoricoComplianceTab partnership={partnership} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
