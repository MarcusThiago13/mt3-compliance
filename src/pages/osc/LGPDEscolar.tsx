import { Shield, Lock, FileKey, Users, AlertTriangle, Download, Plus } from 'lucide-react'
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

const dataInventory = [
  {
    category: 'Dados Cadastrais e Filiação',
    type: 'Dados Pessoais',
    legalBasis: 'Obrigação Legal / Contratual',
    access: 'Secretaria, Direção',
  },
  {
    category: 'Ficha de Saúde (Alergias, Laudos)',
    type: 'Dados Sensíveis',
    legalBasis: 'Tutela da Saúde / Consentimento',
    access: 'Enfermaria, Coordenação',
  },
  {
    category: 'Imagem e Voz (Fotos em Atividades)',
    type: 'Dados Pessoais',
    legalBasis: 'Consentimento Expresso',
    access: 'Comunicação, Professores',
  },
]

export default function LGPDEscolar() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3">
            <Shield className="h-8 w-8" /> LGPD no Ambiente Escolar
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão de consentimentos, inventário de dados sensíveis de menores e segurança da
            informação.
          </p>
        </div>
      </div>

      <Tabs defaultValue="inventario" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 max-w-3xl h-auto p-1 bg-slate-100">
          <TabsTrigger value="inventario" className="py-2.5">
            Inventário de Dados
          </TabsTrigger>
          <TabsTrigger value="termos" className="py-2.5">
            Termos de Consentimento
          </TabsTrigger>
          <TabsTrigger value="incidentes" className="py-2.5">
            Incidentes de Privacidade
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="inventario" className="outline-none m-0 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <FileKey className="h-5 w-5 text-blue-600" /> Mapeamento de Tratamento de Dados
                (RoPA)
              </h4>
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Exportar RoPA
              </Button>
            </div>

            <Card className="shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Categoria de Dado Coletado</TableHead>
                    <TableHead>Classificação</TableHead>
                    <TableHead>Base Legal Predominante</TableHead>
                    <TableHead>Acesso Restrito</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataInventory.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm">{item.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.type === 'Dados Sensíveis'
                              ? 'border-red-200 text-red-700 bg-red-50'
                              : ''
                          }
                        >
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.legalBasis}
                      </TableCell>
                      <TableCell className="text-sm">
                        <Lock className="inline h-3 w-3 mr-1 text-muted-foreground" /> {item.access}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="termos" className="outline-none m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" /> Controle de Termos de Imagem
                  </CardTitle>
                  <CardDescription>
                    Percentual de estudantes com consentimento vigente para uso institucional de
                    imagem.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-bold text-blue-700">92%</span>
                    <span className="text-sm text-muted-foreground">Assinados</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 mb-4">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Revisar Pendências
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-600" /> Repositório de Documentos
                  </CardTitle>
                  <CardDescription>
                    Modelos aprovados pelo DPO para coleta de dados de responsáveis.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-md border">
                    <span className="text-sm font-medium">
                      Termo de Consentimento - Saúde e Medicações
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-200">
                      Vigente v2.0
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-md border">
                    <span className="text-sm font-medium">
                      Política de Privacidade do Aplicativo Escolar
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-200">
                      Vigente v1.1
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="incidentes" className="outline-none m-0">
            <Card className="border-dashed">
              <CardContent className="p-12 text-center text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Nenhum incidente de privacidade registrado.
                </h3>
                <p className="max-w-md mx-auto text-sm">
                  O sistema mantém um registro seguro de vazamentos ou acessos não autorizados para
                  comunicação tempestiva à ANPD e aos responsáveis legais.
                </p>
                <Button className="mt-6" variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Registrar Incidente de Segurança
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
