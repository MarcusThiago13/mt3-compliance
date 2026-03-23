import { useParams } from 'react-router-dom'
import { Landmark, CheckCircle2, Circle, Upload, FileText, AlertTriangle, ShieldX } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const BLOCKS = [
  {
    id: 'a',
    title: 'A. Existência e Regularidade Institucional (Bloco 1)',
    items: [
      { id: 'a1', name: 'Ato constitutivo registrado e atualizado', status: 'valid', date: 'Vigente' },
      { id: 'a2', name: 'Estatuto social vigente (aderente ao art. 33 da Lei 13.019)', status: 'valid', date: 'Vigente' },
      { id: 'a3', name: 'Comprovante de Inscrição e Situação Cadastral (CNPJ)', status: 'valid', date: 'Ativo' },
      { id: 'a4', name: 'Comprovação de tempo de existência institucional', status: 'valid', date: 'Cumprido' },
    ],
  },
  {
    id: 'b',
    title: 'B. Governança e Representação',
    items: [
      { id: 'b1', name: 'Ata de eleição da diretoria atual registrada', status: 'valid', date: 'Até 12/2026' },
      {
        id: 'b2',
        name: 'Relação nominal atualizada dos dirigentes',
        status: 'warning',
        date: 'Revisão Necessária',
      },
      { id: 'b3', name: 'Documentos pessoais dos dirigentes', status: 'missing', date: 'Pendente' },
    ],
  },
  {
    id: 'c',
    title: 'C. Regularidade Fiscal, Previdenciária e Trabalhista',
    items: [
      { id: 'c1', name: 'Certidão Federal e INSS (RFB)', status: 'valid', date: 'Val: 15/08/2026' },
      { id: 'c2', name: 'Certidão Negativa Estadual', status: 'valid', date: 'Val: 20/09/2026' },
      { id: 'c3', name: 'Certidão Negativa Municipal', status: 'valid', date: 'Val: 10/07/2026' },
      {
        id: 'c4',
        name: 'Certificado de Regularidade do FGTS (CRF)',
        status: 'missing',
        date: 'Expirada',
      },
      {
        id: 'c5',
        name: 'Certidão Negativa de Débitos Trabalhistas (CNDT)',
        status: 'valid',
        date: 'Val: 01/10/2026',
      },
    ],
  },
  {
    id: 'd',
    title: 'D. Declarações Obrigatórias e Condicionais',
    items: [
      {
        id: 'd1',
        name: 'Declaração de ausência de impedimentos legais',
        status: 'valid',
        date: 'Assinada',
      },
      {
        id: 'd2',
        name: 'Declaração de não incidência de vedações (Dirigentes)',
        status: 'missing',
        date: 'Pendente',
      },
      {
        id: 'd3',
        name: 'Declaração de instalações e condições materiais',
        status: 'valid',
        date: 'Assinada',
      },
    ],
  },
  {
    id: 'e',
    title: 'E. Sanções, Impedimentos e Histórico (Bloco 9)',
    items: [
      { id: 'e1', name: 'CEIS (Empresas Inidôneas e Suspensas)', status: 'valid', date: 'Nada Consta' },
      { id: 'e2', name: 'CNEP (Entidades Punidas)', status: 'valid', date: 'Nada Consta' },
      { id: 'e3', name: 'Histórico de Contas Rejeitadas no Ente Parceiro', status: 'valid', date: 'Regular' },
    ],
  }
]

export default function RegularidadeInstitucional() {
  const { tenantId } = useParams<{ tenantId: string }>()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case 'missing':
        return <Circle className="h-5 w-5 text-muted-foreground/30" />
      default:
        return <Circle className="h-5 w-5 text-muted-foreground/30" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-800 flex items-center gap-3">
            <Landmark className="h-8 w-8" /> Regularidade Institucional
          </h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            Gestão consolidada da documentação exigida (Bloco 1) e controle do histórico de conformidade, 
            sanções e impedimentos da organização (Bloco 9).
          </p>
        </div>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white shadow-sm">
          <FileText className="mr-2 h-4 w-4" /> Gerar Relatório de Prontidão
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm border-purple-100 h-fit sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg">Prontidão para Parcerias</CardTitle>
            <CardDescription>Status geral da OSC para novos certames</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Conformidade</span>
                <span className="text-purple-700">70%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="flex items-center text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Validados / Ativos
                </span>
                <span className="font-bold">14</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="flex items-center text-amber-600">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Atenção / A Vencer
                </span>
                <span className="font-bold">1</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-2">
                <span className="flex items-center text-muted-foreground">
                  <Circle className="w-4 h-4 mr-2" /> Pendentes / Vencidos
                </span>
                <span className="font-bold">3</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 text-sm flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> Ação Necessária
              </h4>
              <p className="text-xs text-amber-700 mt-1">
                A Certidão do FGTS está expirada. A regularidade plena é impeditiva para novos repasses.
              </p>
            </div>
            
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-800 text-sm flex items-center">
                <ShieldX className="w-4 h-4 mr-2 text-emerald-600" /> Histórico Institucional Limpo
              </h4>
              <p className="text-xs text-emerald-700 mt-1">
                Sem registros de penalidades ou impedimentos vigentes (CEIS/CNEP).
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          <Accordion type="multiple" defaultValue={['a', 'c', 'e']} className="w-full">
            {BLOCKS.map((block) => (
              <AccordionItem
                key={block.id}
                value={block.id}
                className="bg-card border rounded-lg mb-4 shadow-sm px-2 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline px-4 bg-muted/20">
                  <div className="flex items-center font-semibold text-purple-900">
                    {block.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-4">
                  <div className="divide-y border rounded-md">
                    {block.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <p className="font-medium text-sm text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Status: {item.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          {item.status !== 'valid' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs text-purple-700 border-purple-200 hover:bg-purple-50"
                            >
                              <Upload className="w-3 h-3 mr-2" /> Atualizar
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-8 text-xs">
                            Ver Documento
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
