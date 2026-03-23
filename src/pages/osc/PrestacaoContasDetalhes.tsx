import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FileCheck, ArrowLeft, Loader2, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

import DiligenciasTab from '@/components/osc/DiligenciasTab'
import ContasBancariasTab from '@/components/osc/ContasBancariasTab'
import ConciliacaoBancariaTab from '@/components/osc/ConciliacaoBancariaTab'
import RelatoriosPrestacaoTab from '@/components/osc/RelatoriosPrestacaoTab'
import FechamentoMensalTab from '@/components/osc/FechamentoMensalTab'
import PCVisaoGeralTab from '@/components/osc/PCVisaoGeralTab'

export default function PrestacaoContasDetalhes() {
  const { tenantId, id } = useParams<{ tenantId: string; id: string }>()
  const [partnership, setPartnership] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  if (!partnership) return null

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-full shrink-0">
            <Link to={`/${tenantId}/osc/prestacao-contas`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 truncate max-w-lg">
                Prestação de Contas: {partnership.title}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Módulo Financeiro Detalhado | {partnership.public_entity}
            </p>
          </div>
        </div>
        <Button variant="outline" asChild className="text-slate-600 shrink-0">
          <Link to={`/${tenantId}/osc/parcerias/${id}`}>
            <ExternalLink className="mr-2 h-4 w-4" /> Gestão Geral da Parceria
          </Link>
        </Button>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <Tabs defaultValue="overview" className="w-full min-w-max">
          <TabsList className="flex w-full h-auto p-1 bg-amber-50 rounded-lg justify-start gap-1 border border-amber-100">
            <TabsTrigger
              value="overview"
              className="py-2 px-4 text-sm data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="contas"
              className="py-2 px-4 text-sm data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm"
            >
              Contas Bancárias
            </TabsTrigger>
            <TabsTrigger
              value="conciliacao"
              className="py-2 px-4 text-sm data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm"
            >
              Conciliação (OCR)
            </TabsTrigger>
            <TabsTrigger
              value="relatorios"
              className="py-2 px-4 text-sm data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm"
            >
              Demonstrativos (DID)
            </TabsTrigger>
            <TabsTrigger
              value="diligencias"
              className="py-2 px-4 text-sm data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:shadow-sm"
            >
              Diligências e Pareceres
            </TabsTrigger>
            <TabsTrigger
              value="fechamento"
              className="py-2 px-4 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm ml-auto"
            >
              Fechamento de Competência
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview" className="outline-none m-0">
              <PCVisaoGeralTab partnership={partnership} />
            </TabsContent>
            <TabsContent value="contas" className="outline-none m-0">
              <ContasBancariasTab partnership={partnership} />
            </TabsContent>
            <TabsContent value="conciliacao" className="outline-none m-0">
              <ConciliacaoBancariaTab partnership={partnership} />
            </TabsContent>
            <TabsContent value="relatorios" className="outline-none m-0">
              <RelatoriosPrestacaoTab partnership={partnership} />
            </TabsContent>
            <TabsContent value="diligencias" className="outline-none m-0">
              <DiligenciasTab partnership={partnership} accountabilityId={null} />
            </TabsContent>
            <TabsContent value="fechamento" className="outline-none m-0">
              <FechamentoMensalTab partnership={partnership} accountability={{ id: 'dynamic' }} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
