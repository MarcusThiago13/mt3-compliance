import {
  Baby,
  AlertCircle,
  HeartHandshake,
  ShieldCheck,
  Plus,
  FileText,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const incidents = [
  {
    id: 'INC-2026-001',
    type: 'Suspeita de maus-tratos familiares',
    student: 'A. B. C. (Sigiloso)',
    date: '10/03/2026',
    status: 'Notificado ao Conselho Tutelar',
    severity: 'Alta',
  },
  {
    id: 'INC-2026-002',
    type: 'Conflito entre alunos com agressão física',
    student: 'Múltiplos (Sigiloso)',
    date: '15/03/2026',
    status: 'Em Apuração Interna',
    severity: 'Média',
  },
]

const inclusions = [
  {
    name: 'J. P. M. (TEA)',
    plan: 'Plano de Ensino Individualizado (PEI) v2',
    support: 'Profissional de Apoio Escolar Atribuído',
    status: 'Conforme',
  },
  {
    name: 'M. S. L. (TDAH)',
    plan: 'Adaptação Curricular em Desenvolvimento',
    support: 'Aguardando Avaliação Multidisciplinar',
    status: 'Atenção',
  },
]

export default function ProtecaoInfantil() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
            <Baby className="h-8 w-8" /> Proteção Infantil e Inclusão
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão de incidentes, proteção integral da criança (ECA) e conformidade com políticas de
            acessibilidade e inclusão.
          </p>
        </div>
      </div>

      <Tabs defaultValue="incidentes" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 max-w-2xl h-auto p-1 bg-blue-50">
          <TabsTrigger
            value="incidentes"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-800"
          >
            Registro de Incidentes
          </TabsTrigger>
          <TabsTrigger
            value="inclusao"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-800"
          >
            Inclusão e Acessibilidade
          </TabsTrigger>
          <TabsTrigger
            value="protocolos"
            className="py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-800"
          >
            Protocolos Institucionais
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="incidentes" className="outline-none m-0 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" /> Acompanhamento de Casos Sensíveis
              </h4>
              <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" /> Novo Incidente
              </Button>
            </div>

            <Card className="border-red-100 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-red-50/50">
                  <TableRow>
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Classificação do Incidente</TableHead>
                    <TableHead>Estudante(s)</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status e Providências</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((inc) => (
                    <TableRow key={inc.id}>
                      <TableCell className="font-mono text-xs font-semibold">{inc.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{inc.type}</div>
                        <Badge
                          variant="outline"
                          className={`mt-1 text-[10px] ${inc.severity === 'Alta' ? 'border-red-300 text-red-700 bg-red-50' : 'border-amber-300 text-amber-700 bg-amber-50'}`}
                        >
                          Severidade {inc.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{inc.student}</TableCell>
                      <TableCell className="text-sm">{inc.date}</TableCell>
                      <TableCell>
                        <Badge className="bg-slate-100 text-slate-800 border-none hover:bg-slate-200">
                          {inc.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="inclusao" className="outline-none m-0 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold flex items-center gap-2 text-blue-900">
                <HeartHandshake className="h-5 w-5 text-blue-600" /> Planos de Apoio e Inclusão
              </h4>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Registrar Plano
              </Button>
            </div>

            <Card className="border-blue-100 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-blue-50/50">
                  <TableRow>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Planejamento Pedagógico (PEI)</TableHead>
                    <TableHead>Suporte Especializado</TableHead>
                    <TableHead className="text-right">Conformidade Legal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inclusions.map((inc, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm">{inc.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{inc.plan}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{inc.support}</TableCell>
                      <TableCell className="text-right">
                        {inc.status === 'Conforme' ? (
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Conforme
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-amber-300 text-amber-700 bg-amber-50"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" /> Requer Atenção
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="protocolos" className="outline-none m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-emerald-100 bg-emerald-50/30">
                <CardContent className="p-6 flex items-start gap-4">
                  <ShieldCheck className="h-10 w-10 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-emerald-900">Política de Proteção à Criança</h3>
                    <p className="text-sm text-emerald-800 mt-1 mb-3">
                      Diretrizes institucionais aprovadas para prevenção de violências e abusos no
                      ambiente escolar.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    >
                      <FileText className="h-4 w-4 mr-2" /> Visualizar Documento
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100 bg-blue-50/30">
                <CardContent className="p-6 flex items-start gap-4">
                  <AlertCircle className="h-10 w-10 text-blue-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900">
                      Fluxo de Comunicação ao Conselho Tutelar
                    </h3>
                    <p className="text-sm text-blue-800 mt-1 mb-3">
                      Procedimento operacional padrão (POP) para acionamento das autoridades em
                      casos de suspeita.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-700 border-blue-200 hover:bg-blue-100"
                    >
                      <FileText className="h-4 w-4 mr-2" /> Revisar Fluxo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
