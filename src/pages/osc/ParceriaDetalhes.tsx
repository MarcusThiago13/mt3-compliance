import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { Handshake, ArrowLeft, Loader2, FileText, ChevronRight } from 'lucide-react'
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
          <Button variant="ghost" size="icon" asChild className="rounded-full shrink-0">
            <Link to={`/${tenantId}/osc/parcerias`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1
                className="text-2xl font-bold text-slate-800 truncate max-w-lg"
                title={partnership.title}
              >
                {partnership.title}
              </h1>
              <Badge className="bg-purple-100 text-purple-800 border-none shadow-sm whitespace-nowrap">
                {partnership.status}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1 flex-wrap gap-1.5">
              <Handshake className="h-4 w-4 shrink-0 text-purple-400" />
              <span className="font-medium text-slate-700">{partnership.public_entity}</span>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <span>{partnership.instrument_type}</span>
              {partnership.instrument_number && (
                <>
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                  <span className="font-mono text-xs px-1.5 bg-slate-100 rounded">
                    {partnership.instrument_number}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="text-purple-700 border-purple-200 hover:bg-purple-50 shrink-0"
        >
          <FileText className="mr-2 h-4 w-4" /> Exportar Dossiê da Parceria
        </Button>
      </div>

      <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full min-w-max">
          <TabsList className="flex w-full h-auto p-1.5 bg-slate-100/80 rounded-lg justify-start gap-1.5">
            <TabsTrigger
              value="gestao"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-800 font-medium transition-all"
            >
              Gestão da Parceria (B5)
            </TabsTrigger>
            <TabsTrigger
              value="habilitacao"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-800 font-medium transition-all"
            >
              Habilitação & Celebração (B2)
            </TabsTrigger>
            <TabsTrigger
              value="plano"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-800 font-medium transition-all"
            >
              Plano de Trabalho (B3)
            </TabsTrigger>
            <TabsTrigger
              value="execucao"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-800 font-medium transition-all"
            >
              Execução do Objeto (B4)
            </TabsTrigger>

            <div className="w-px h-6 bg-slate-300 mx-1 self-center" />

            <TabsTrigger
              value="prestacao"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-700 font-medium border border-transparent data-[state=active]:border-amber-200 transition-all bg-amber-50/50"
            >
              Integração: Prestação de Contas
            </TabsTrigger>

            <div className="w-px h-6 bg-slate-300 mx-1 self-center" />

            <TabsTrigger
              value="transparencia"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium transition-all"
            >
              Transparência (B6)
            </TabsTrigger>
            <TabsTrigger
              value="rede"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-800 font-medium transition-all"
            >
              Atuação em Rede (B7)
            </TabsTrigger>
            <TabsTrigger
              value="encerramento"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-700 font-medium transition-all"
            >
              Bens, Saldos e Encerramento
            </TabsTrigger>
            <TabsTrigger
              value="historico"
              className="py-2.5 px-3.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-800 font-medium transition-all"
            >
              Histórico Institucional (B10)
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
