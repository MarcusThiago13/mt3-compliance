import { useParams } from 'react-router-dom'
import {
  Landmark,
  CheckCircle2,
  Circle,
  Upload,
  FileText,
  AlertTriangle,
  ShieldX,
  Building,
  Users,
  Briefcase,
  Award,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

const BLOCKS = [
  {
    id: 'a',
    title: 'Cadastro e Estrutura Organizacional',
    icon: <Building className="w-4 h-4 mr-2 text-purple-600" />,
    items: [
      { id: 'a1', name: 'Natureza Jurídica', status: 'valid', date: 'Associação Privada (399-9)' },
      { id: 'a2', name: 'Comprovante de CNPJ e Sede Ativa', status: 'valid', date: 'Ativo' },
      { id: 'a3', name: 'Cadastro de Unidades Vinculadas (Filiais)', status: 'valid', date: '2 Unidades Registradas' },
      { id: 'a4', name: 'Tempo de Existência Institucional (Lei 13.019)', status: 'valid', date: 'Comprovado (> 3 anos)' },
    ],
  },
  {
    id: 'b',
    title: 'Governança, Estatuto e Dirigentes',
    icon: <Users className="w-4 h-4 mr-2 text-purple-600" />,
    items: [
      { id: 'b1', name: 'Estatuto Social averbado (Art. 33, Lei 13.019)', status: 'valid', date: 'Aderente' },
      { id: 'b2', name: 'Ata de Eleição da Diretoria atual registrada', status: 'valid', date: 'Vigente até 12/2026' },
      { id: 'b3', name: 'Relação Nominal Atualizada dos Dirigentes', status: 'warning', date: 'Revisão Necessária' },
      { id: 'b4', name: 'Comprovante de Residência / Docs dos Dirigentes', status: 'missing', date: 'Pendente (Bloqueante)' },
    ],
  },
  {
    id: 'c',
    title: 'Aptidão Operacional e Experiência',
    icon: <Briefcase className="w-4 h-4 mr-2 text-purple-600" />,
    items: [
      { id: 'c1', name: 'Capacidade Operacional Declarada', status: 'valid', date: 'Registrada' },
      { id: 'c2', name: 'Atestados de Capacidade Técnica (Experiência)', status: 'valid', date: '3 Atestados' },
      { id: 'c3', name: 'Histórico de Parcerias Anteriores', status: 'valid', date: 'Atualizado' },
      { id: 'c4', name: 'Área de Atuação (Estatutária e Real)', status: 'valid', date: 'Educação / Assistência Social' },
    ],
  },
  {
    id: 'd',
    title: 'Certidões Fiscais, Trabalhistas e Certificações',
    icon: <Award className="w-4 h-4 mr-2 text-purple-600" />,
    items: [
      { id: 'd1', name: 'Certidão Conjunta Federal (RFB/INSS)', status: 'valid', date: 'Val: 15/08/2026' },
      { id: 'd2', name: 'Certidão Negativa Estadual e Municipal', status: 'valid', date: 'Val: 10/07/2026' },
      { id: 'd3', name: 'Certificado de Regularidade do FGTS (CRF)', status: 'missing', date: 'Expirada (Bloqueante)' },
      { id: 'd4', name: 'CNDT - Débitos Trabalhistas', status: 'valid', date: 'Val: 01/10/2026' },
      { id: 'd5', name: 'Titulação de Utilidade Pública ou CEBAS (Opcional)', status: 'valid', date: 'CEBAS Educação Vigente' },
    ],
  },
  {
    id: 'e',
    title: 'Impedimentos, Sanções e Histórico (Bloco 9)',
    icon: <ShieldX className="w-4 h-4 mr-2 text-purple-600" />,
    items: [
      { id: 'e1', name: 'Consulta ao CEIS (Inidôneas e Suspensas)', status: 'valid', date: 'Nada Consta' },
      { id: 'e2', name: 'Consulta ao CNEP (Entidades Punidas)', status: 'valid', date: 'Nada Consta' },
      { id: 'e3', name: 'Histórico de Contas Rejeitadas (TCE/TCU)', status: 'valid', date: 'Regular' },
      { id: 'e4', name: 'Declaração de não incidência de vedações', status: 'valid', date: 'Assinada' },
    ],
  },
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

  // Calculating readiness score for UI representation
  const totalItems = BLOCKS.reduce((acc, block) => acc + block.items.length, 0)
  const validItems = BLOCKS.reduce((acc, block) => acc + block.items.filter((i) => i.status === 'valid').length, 0)
  const readinessPercentage = Math.round((validItems / totalItems) * 100)

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-800 flex items-center gap-3">
            <Landmark className="h-8 w-8" /> Regularidade Institucional (Bloco 1)
          </h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            Gestão consolidada da estrutura e aptidão da OSC. Cadastro central, certidões, dirigentes e controle rigoroso de impedimentos para viabilizar e habilitar a celebração de novas parcerias.
          </p>
        </div>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white shadow-sm">
          <FileText className="mr-2 h-4 w-4" /> Relatório de Prontidão (Checklist)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm border-purple-100 h-fit sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg">Prontidão para Celebração</CardTitle>
            <CardDescription>Status geral da OSC para participar de editais e firmar termos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Conformidade Documental</span>
                <span className={readinessPercentage < 100 ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                  {readinessPercentage}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${readinessPercentage < 100 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${readinessPercentage}%` }}
                ></div>
              </div>
            </div>

            {readinessPercentage < 100 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in">
                <div className="flex items-center gap-2 text-red-800 font-bold mb-2">
                  <ShieldX className="h-5 w-5" />
                  <span>Semáforo: Bloqueado</span>
                </div>
                <p className="text-xs text-red-700">
                  O sistema detectou pendências críticas no cadastro de dirigentes e em certidões fiscais. A OSC está inabilitada temporariamente para avançar no Bloco 2 de Celebração.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="flex items-center text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Validados / Ativos
                </span>
                <span className="font-bold">{validItems}</span>
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
                <span className="font-bold">2</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-800 text-sm flex items-center">
                <Building className="w-4 h-4 mr-2 text-slate-600" /> Resumo do Cadastro
              </h4>
              <p className="text-xs text-slate-600 mt-2"><strong>CNPJ:</strong> 00.000.000/0001-00</p>
              <p className="text-xs text-slate-600 mt-1"><strong>Sede:</strong> São Paulo/SP</p>
              <p className="text-xs text-slate-600 mt-1"><strong>Presidente:</strong> João Silva (Mandato: 2026)</p>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          <Accordion type="multiple" defaultValue={['a', 'b', 'c', 'd', 'e']} className="w-full">
            {BLOCKS.map((block) => (
              <AccordionItem
                key={block.id}
                value={block.id}
                className="bg-card border rounded-lg mb-4 shadow-sm px-2 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline px-4 bg-muted/20">
                  <div className="flex items-center font-semibold text-purple-900">
                    {block.icon} {block.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-4">
                  <div className="divide-y border rounded-md">
                    {block.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 hover:bg-muted/30 transition-colors ${item.status === 'missing' ? 'bg-red-50/30' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <p className="font-medium text-sm text-foreground flex items-center gap-2">
                              {item.name}
                              {item.status === 'missing' && (
                                <Badge variant="destructive" className="text-[10px]">
                                  Bloqueante
                                </Badge>
                              )}
                            </p>
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
