import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Circle,
  FileText,
  Upload,
  School,
} from 'lucide-react'
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
    title: 'A. Autorizações e Credenciamentos Pedagógicos',
    items: [
      { id: 'a1', name: 'Autorização de Funcionamento (SEDUC)', status: 'valid', date: 'Vigente' },
      {
        id: 'a2',
        name: 'Credenciamento no Conselho Municipal de Educação',
        status: 'warning',
        date: 'Em Renovação',
      },
      {
        id: 'a3',
        name: 'Projeto Político Pedagógico (PPP) Atualizado',
        status: 'valid',
        date: 'Aprovado 2026',
      },
      { id: 'a4', name: 'Regimento Escolar Homologado', status: 'valid', date: 'Vigente' },
    ],
  },
  {
    id: 'b',
    title: 'B. Segurança, Saúde e Infraestrutura',
    items: [
      {
        id: 'b1',
        name: 'Alvará de Prevenção e Proteção Contra Incêndios (PPCI)',
        status: 'valid',
        date: 'Até 12/2026',
      },
      { id: 'b2', name: 'Alvará de Localização e Funcionamento', status: 'valid', date: 'Vigente' },
      {
        id: 'b3',
        name: 'Licença da Vigilância Sanitária (Refeitório e Instalações)',
        status: 'missing',
        date: 'Pendente - Risco Alto',
      },
      { id: 'b4', name: 'Laudo de Limpeza de Caixa d’Água', status: 'valid', date: 'Renovado' },
    ],
  },
  {
    id: 'c',
    title: 'C. Quadro de Pessoal e Exigências Legais',
    items: [
      {
        id: 'c1',
        name: 'Comprovação de Habilitação de Docentes (Diplomas)',
        status: 'valid',
        date: '100% Conforme',
      },
      {
        id: 'c2',
        name: 'Treinamento de Primeiros Socorros (Lei Lucas)',
        status: 'warning',
        date: '75% Treinados',
      },
      {
        id: 'c3',
        name: 'Certidão Negativa de Débitos Trabalhistas (CNDT)',
        status: 'valid',
        date: 'Val: 01/10/2026',
      },
    ],
  },
]

export default function ConformidadeEducacional() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />
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
          <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
            <BookOpen className="h-8 w-8" /> Conformidade Educacional
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle e monitoramento de autorizações, conselhos e segurança das unidades escolares.
          </p>
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800 text-white shadow-sm">
          <FileText className="mr-2 h-4 w-4" /> Gerar Parecer de Conformidade
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm border-blue-100">
          <CardHeader className="bg-blue-50/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <School className="h-5 w-5 text-blue-700" /> Prontidão Escolar
            </CardTitle>
            <CardDescription>Status geral das licenças e exigências pedagógicas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Nível de Adequação</span>
                <span className="text-blue-700">82%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: '82%' }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="flex items-center text-blue-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Validados
                </span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="flex items-center text-amber-600">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Em Atenção
                </span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-2">
                <span className="flex items-center text-muted-foreground">
                  <Circle className="w-4 h-4 mr-2" /> Pendentes
                </span>
                <span className="font-bold">1</span>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 text-sm flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> Risco de Interdição
              </h4>
              <p className="text-xs text-red-700 mt-1">
                A Licença da Vigilância Sanitária está pendente. A ausência deste documento
                inviabiliza o fornecimento de merenda escolar de forma regular.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          <Accordion type="multiple" defaultValue={['a', 'b']} className="w-full">
            {BLOCKS.map((block) => (
              <AccordionItem
                key={block.id}
                value={block.id}
                className="bg-card border rounded-lg mb-4 shadow-sm px-2 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline px-4 bg-blue-50/30">
                  <div className="flex items-center font-semibold text-blue-900">{block.title}</div>
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
                              className="h-8 text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
                            >
                              <Upload className="w-3 h-3 mr-2" /> Anexar Evidência
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-8 text-xs">
                            Ver Detalhes
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
