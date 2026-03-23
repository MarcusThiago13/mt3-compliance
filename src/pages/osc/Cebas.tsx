import { Award, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Cebas() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-800 flex items-center gap-3">
            <Award className="h-8 w-8" /> Módulo CEBAS
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão da Certificação de Entidade Beneficente de Assistência Social.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-purple-700 border-purple-200 hover:bg-purple-50"
          >
            <FileText className="mr-2 h-4 w-4" /> Exportar Dossiê CEBAS
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-purple-100 shadow-sm">
          <CardHeader>
            <CardTitle>Status da Certificação</CardTitle>
            <CardDescription>Visão geral da certificação ativa e prazos legais</CardDescription>
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
                  Área de Atuação
                </p>
                <p className="font-medium text-foreground">Educação (Primária)</p>
              </div>
              <div className="border rounded-lg p-4 bg-muted/10">
                <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">
                  Data de Concessão
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
                  Prazo para Renovação
                </p>
                <p className="font-semibold text-amber-700 flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" /> Até 31/12/2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-purple-600">
          <CardHeader>
            <CardTitle className="text-lg">Requisitos de Manutenção</CardTitle>
            <CardDescription>Obrigações contínuas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Bolsas de Estudo (20%)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Proporção atingida: 22.4% no último exercício.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Cadastro no Censo Escolar</p>
                <p className="text-xs text-muted-foreground mt-0.5">Atualizado anualmente.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Demonstrações Contábeis</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Auditoria pendente para o ano corrente.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t mt-2">
              <Button
                variant="outline"
                className="w-full text-purple-700 hover:bg-purple-50 hover:text-purple-800"
              >
                Ver Todos os Requisitos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
