import {
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Stethoscope,
  BookOpen,
  Users,
  HelpCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Cebas() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-800 flex items-center gap-3">
            <Award className="h-8 w-8" /> Módulo CEBAS
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão da Certificação de Entidade Beneficente de Assistência Social e monitoramento de
            requisitos legais por área.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-purple-700 border-purple-200 hover:bg-purple-50 shadow-sm"
          >
            <FileText className="mr-2 h-4 w-4" /> Exportar Dossiê CEBAS
          </Button>
        </div>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 lg:w-[800px] h-auto p-1 bg-purple-50">
          <TabsTrigger
            value="geral"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-purple-800"
          >
            Visão Geral e Prazos
          </TabsTrigger>
          <TabsTrigger
            value="educacao"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-700"
          >
            Educação (Bolsas)
          </TabsTrigger>
          <TabsTrigger
            value="saude"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-emerald-700"
          >
            Saúde (SUS)
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-amber-700"
          >
            Assistência Social
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="geral" className="m-0 outline-none space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border-purple-100 shadow-sm">
                <CardHeader>
                  <CardTitle>Status da Certificação</CardTitle>
                  <CardDescription>
                    Visão geral da certificação ativa e prazos legais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-emerald-50 border border-emerald-200 rounded-xl gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-100 rounded-full shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-900 text-lg">Certificação Ativa</h3>
                        <p className="text-sm text-emerald-700">Portaria MEC nº 1.234/2023</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right bg-white/60 p-3 rounded-lg border border-emerald-100 w-full sm:w-auto">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Vencimento
                      </p>
                      <p className="font-bold text-xl text-emerald-900">31/12/2026</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 bg-muted/10">
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                        Área Preponderante
                      </p>
                      <p className="font-medium text-foreground">Educação</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted/10">
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                        Data de Concessão original
                      </p>
                      <p className="font-medium text-foreground">01/01/2024</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted/10">
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                        Processo SIPEC
                      </p>
                      <p className="font-medium font-mono text-sm text-foreground">
                        23000.012345/2023-99
                      </p>
                    </div>
                    <div className="border border-amber-200 rounded-lg p-4 bg-amber-50/50">
                      <p className="text-xs text-amber-700 font-semibold uppercase mb-1">
                        Prazo para Pedido de Renovação
                      </p>
                      <p className="font-semibold text-amber-700 flex items-center">
                        <Clock className="w-4 h-4 mr-1.5" /> Até 31/12/2025 (360 dias antes)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-t-4 border-t-purple-600">
                <CardHeader>
                  <CardTitle className="text-lg">Requisitos Gerais (Art. 3º)</CardTitle>
                  <CardDescription>Obrigações contínuas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">Remuneração de Dirigentes</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Em conformidade com teto do executivo.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">Segregação Contábil por Área</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Centros de custo separados aplicados.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Demonstrações Contábeis e Auditoria
                      </p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Auditoria independente pendente para o ano corrente (Receita {'>'} R$ 4.8M).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="educacao" className="m-0 outline-none">
            <Card className="border-blue-100 shadow-sm">
              <CardHeader className="bg-blue-50/50 pb-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                  <BookOpen className="h-5 w-5 text-blue-600" /> Requisitos CEBAS Educação (MEC)
                </CardTitle>
                <CardDescription>
                  Acompanhamento da proporção de bolsas de estudo integrais e parciais.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-slate-50 text-center">
                    <p className="text-sm text-muted-foreground font-semibold uppercase mb-1">
                      Mínimo Legal Exigido
                    </p>
                    <p className="text-2xl font-bold text-slate-800">20%</p>
                    <p className="text-xs text-muted-foreground mt-1">Gratuidade na Receita</p>
                  </div>
                  <div className="p-4 border border-emerald-200 rounded-lg bg-emerald-50 text-center">
                    <p className="text-sm text-emerald-800 font-semibold uppercase mb-1">
                      Proporção Atingida (Atual)
                    </p>
                    <p className="text-2xl font-bold text-emerald-700">22.4%</p>
                    <p className="text-xs text-emerald-600 mt-1">Seguro</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-slate-50 text-center">
                    <p className="text-sm text-muted-foreground font-semibold uppercase mb-1">
                      Alunos Bolsistas
                    </p>
                    <p className="text-2xl font-bold text-slate-800">142</p>
                    <p className="text-xs text-muted-foreground mt-1">100% integrais</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold text-slate-800">Checklist Anual de Comprovação</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/20 border rounded">
                      <span className="text-sm font-medium">
                        Cadastro Regular no Censo Escolar (INEP)
                      </span>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/20 border rounded">
                      <span className="text-sm font-medium">
                        Termos de Ajuste de Gratuidade (TAG)
                      </span>
                      <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">
                        Não Aplicável
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 border border-amber-200 rounded">
                      <span className="text-sm font-medium text-amber-900">
                        Comprovação do Perfil Socioeconômico dos Bolsistas
                      </span>
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saude" className="m-0 outline-none">
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader className="bg-emerald-50/50 pb-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                  <Stethoscope className="h-5 w-5 text-emerald-600" /> Requisitos CEBAS Saúde (MS)
                </CardTitle>
                <CardDescription>
                  Acompanhamento da prestação de serviços ao SUS e gratuidade.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center">
                <HelpCircle className="h-12 w-12 text-emerald-200 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">Área não predominante</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-2">
                  Esta organização não possui a Saúde como área de atuação registrada. Se a
                  organização for mútlipla, cadastre os estabelecimentos de saúde para habilitar o
                  monitoramento de 60% de prestação ao SUS.
                </p>
                <Button variant="outline" className="mt-4 border-emerald-200 text-emerald-700">
                  Habilitar Monitoramento de Saúde
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="m-0 outline-none">
            <Card className="border-amber-100 shadow-sm">
              <CardHeader className="bg-amber-50/50 pb-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                  <Users className="h-5 w-5 text-amber-600" /> Requisitos CEBAS Assistência Social
                  (MDS)
                </CardTitle>
                <CardDescription>
                  Inscrição nos conselhos e ofertas socioassistenciais gratuitas.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center">
                <HelpCircle className="h-12 w-12 text-amber-200 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">Área não predominante</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-2">
                  Esta organização atua com Assistência Social de forma secundária. O controle
                  rigoroso foca na Educação, mas se necessário, você pode habilitar o acompanhamento
                  do CMAS aqui.
                </p>
                <Button variant="outline" className="mt-4 border-amber-200 text-amber-700">
                  Habilitar Monitoramento CMAS/CNAS
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
