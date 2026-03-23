import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import {
  Loader2,
  FileCheck,
  Play,
  AlertTriangle,
  ShieldCheck,
  Save,
  Receipt,
  MessageSquareWarning,
  Landmark,
  FileSpreadsheet,
  Lock,
} from 'lucide-react'

import DiligenciasTab from './DiligenciasTab'
import ContasBancariasTab from './ContasBancariasTab'
import ConciliacaoBancariaTab from './ConciliacaoBancariaTab'
import RelatoriosPrestacaoTab from './RelatoriosPrestacaoTab'
import FechamentoMensalTab from './FechamentoMensalTab'

export default function PrestacaoContasTab({ partnership }: any) {
  const [accountability, setAccountability] = useState<any>(null)
  const [execution, setExecution] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const [formData, setFormData] = useState({
    report_type: 'Anual',
    status: 'Em Elaboração',
    deadline: '',
    submission_date: '',
    diligence_notes: '',
    final_decision: '',
  })

  const fetchData = async () => {
    setLoading(true)

    const { data: accData } = await supabase
      .from('osc_partnership_accountability' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .maybeSingle()

    if (accData) {
      setAccountability(accData)
      setFormData({
        report_type: accData.report_type || 'Anual',
        status: accData.status || 'Em Elaboração',
        deadline: accData.deadline || '',
        submission_date: accData.submission_date || '',
        diligence_notes: accData.diligence_notes || '',
        final_decision: accData.final_decision || '',
      })
    }

    const { data: execData } = await supabase
      .from('osc_partnership_execution' as any)
      .select('*')
      .eq('partnership_id', partnership.id)
      .maybeSingle()

    setExecution(execData)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [partnership.id])

  const handleStart = async () => {
    setSaving(true)
    const { data, error } = await supabase
      .from('osc_partnership_accountability' as any)
      .insert({ partnership_id: partnership.id })
      .select()
      .single()

    if (data) {
      setAccountability(data)
      toast({ title: 'Sucesso', description: 'Módulo de Prestação de Contas iniciado.' })
    }
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    setSaving(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('osc_partnership_accountability' as any)
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', accountability.id)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Dados gerais atualizados.' })
    setSaving(false)
  }

  const renderRiskMotor = () => {
    if (!execution) return null

    const physical = execution.physical_progress || 0
    const financial = execution.financial_progress || 0
    const discrepancy = financial - physical

    const risks = []

    if (discrepancy > 20) {
      risks.push({
        level: 'Alto',
        title: 'Descompasso Físico-Financeiro Grave',
        desc: `Execução financeira (${financial}%) está muito acima da execução física (${physical}%). Risco iminente de glosa e rejeição de contas.`,
      })
    } else if (discrepancy > 10) {
      risks.push({
        level: 'Médio',
        title: 'Descompasso Físico-Financeiro Moderado',
        desc: `Atenção: A utilização de recursos (${financial}%) está acima das metas atingidas (${physical}%). Necessário justificar desvios.`,
      })
    }

    if (financial > 90 && physical < 100) {
      risks.push({
        level: 'Médio',
        title: 'Risco de Insuficiência de Saldo',
        desc: 'Recursos quase esgotados, mas o objeto ainda não foi totalmente concluído.',
      })
    }

    if (risks.length === 0) {
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-900">Nenhum Risco Estrutural Detectado</h4>
            <p className="text-sm text-emerald-700">
              A relação entre execução física ({physical}%) e financeira ({financial}%) está
              equilibrada no motor de conformidade.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-800 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          Motor de Conformidade (Nexo Causal)
        </h4>
        {risks.map((r, i) => (
          <div
            key={i}
            className={`border rounded-lg p-4 flex items-start gap-3 ${r.level === 'Alto' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}
          >
            <AlertTriangle
              className={`h-5 w-5 mt-0.5 ${r.level === 'Alto' ? 'text-red-600' : 'text-amber-600'}`}
            />
            <div>
              <h4 className={`font-bold ${r.level === 'Alto' ? 'text-red-900' : 'text-amber-900'}`}>
                {r.title}
              </h4>
              <p
                className={`text-sm mt-1 ${r.level === 'Alto' ? 'text-red-800' : 'text-amber-800'}`}
              >
                {r.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
      </div>
    )
  }

  if (!accountability) {
    return (
      <Card className="border-amber-100 bg-amber-50/30 text-center py-12">
        <CardContent className="space-y-4">
          <FileCheck className="h-12 w-12 text-amber-400 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-amber-900">
              Prestação de Contas e Gestão Financeira
            </h3>
            <p className="text-sm text-amber-700 max-w-md mx-auto mt-2">
              Inicie a estruturação da prestação de contas (Blocos 4 e 6) habilitando a conciliação
              extrato-cêntrica, controle de restituições e geração de demonstrativos automáticos.
            </p>
          </div>
          <Button
            onClick={handleStart}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700 mt-4"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Iniciar Módulo Integrado
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap w-full h-auto p-1 bg-slate-100 rounded-lg justify-start gap-1">
          <TabsTrigger
            value="overview"
            className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm"
          >
            <FileCheck className="w-4 h-4 mr-1 sm:mr-2" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="contas"
            className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm"
          >
            <Landmark className="w-4 h-4 mr-1 sm:mr-2" /> Contas (B4)
          </TabsTrigger>
          <TabsTrigger
            value="conciliacao"
            className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1 sm:mr-2" /> Conciliação
          </TabsTrigger>
          <TabsTrigger
            value="relatorios"
            className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
          >
            <Receipt className="w-4 h-4 mr-1 sm:mr-2" /> Demonstrativos
          </TabsTrigger>
          <TabsTrigger
            value="diligencias"
            className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm"
          >
            <MessageSquareWarning className="w-4 h-4 mr-1 sm:mr-2" /> Diligências (B6)
          </TabsTrigger>
          <TabsTrigger
            value="fechamento"
            className="py-2 px-3 text-xs sm:text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm ml-auto"
          >
            <Lock className="w-4 h-4 mr-1 sm:mr-2" /> Fechamento
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6 m-0 outline-none">
            {renderRiskMotor()}

            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">
                  Status da Prestação de Contas (Bloco 6)
                </CardTitle>
                <CardDescription>Controle de prazos e pareceres do ente parceiro.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Tipo de Relatório (conforme regulamento)</Label>
                    <Select
                      value={formData.report_type}
                      onValueChange={(v) => setFormData({ ...formData, report_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Parcial">Parcial / Intermediária</SelectItem>
                        <SelectItem value="Anual">Anual</SelectItem>
                        <SelectItem value="Final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status de Envio na Plataforma do Ente</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => setFormData({ ...formData, status: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Em Elaboração">Em Elaboração (Interno)</SelectItem>
                        <SelectItem value="Enviada">Enviada para Análise</SelectItem>
                        <SelectItem value="Em Diligência">Em Diligência / Saneamento</SelectItem>
                        <SelectItem value="Aprovada">Aprovada (Regular)</SelectItem>
                        <SelectItem value="Aprovada com Ressalvas">
                          Aprovada com Ressalvas
                        </SelectItem>
                        <SelectItem value="Rejeitada">Rejeitada (Irregular)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Prazo Limite Legal/Contratual</Label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Protocolo Efetivo</Label>
                    <Input
                      type="date"
                      value={formData.submission_date}
                      onChange={(e) =>
                        setFormData({ ...formData, submission_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Decisão Final / Parecer Conclusivo</Label>
                    <Input
                      value={formData.final_decision}
                      onChange={(e) => setFormData({ ...formData, final_decision: e.target.value })}
                      placeholder="Ex: Contas julgadas regulares conforme Parecer nº 123..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-slate-800 hover:bg-slate-900"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar Visão Geral
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contas" className="m-0 outline-none">
            <ContasBancariasTab partnership={partnership} />
          </TabsContent>

          <TabsContent value="conciliacao" className="m-0 outline-none">
            <ConciliacaoBancariaTab partnership={partnership} />
          </TabsContent>

          <TabsContent value="relatorios" className="m-0 outline-none">
            <RelatoriosPrestacaoTab partnership={partnership} />
          </TabsContent>

          <TabsContent value="diligencias" className="m-0 outline-none">
            <DiligenciasTab partnership={partnership} accountabilityId={accountability.id} />
          </TabsContent>

          <TabsContent value="fechamento" className="m-0 outline-none">
            <FechamentoMensalTab partnership={partnership} accountability={accountability} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
