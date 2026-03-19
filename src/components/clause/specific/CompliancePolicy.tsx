import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileText, Link as LinkIcon, AlertCircle, CheckCircle2, FileSignature } from 'lucide-react'

export function CompliancePolicy() {
  const versions = [
    { v: 'v2.0', date: '10/10/2023', status: 'Vigente', approver: 'Conselho Administrativo' },
    { v: 'v1.1', date: '15/05/2022', status: 'Arquivada', approver: 'Conselho Administrativo' },
    { v: 'v1.0', date: '10/01/2021', status: 'Arquivada', approver: 'Diretoria' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">5.2 Política de Compliance</h3>
          <p className="text-sm text-muted-foreground">
            Gestão do ciclo de vida, aprovação formal e vínculos normativos.
          </p>
        </div>
        <Button>
          <FileSignature className="mr-2 h-4 w-4" /> Nova Versão (Draft)
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-l-4 border-l-primary shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Política Geral de Compliance
                  <Badge className="bg-success hover:bg-success ml-2">Vigente</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Versão 2.0 • Aprovada em 10/10/2023
                </p>
              </div>
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/30 rounded-md text-sm border space-y-3">
                <p className="flex items-center gap-2 font-medium text-success">
                  <CheckCircle2 className="h-4 w-4" /> Aprovada formalmente pelo Órgão de Governança
                </p>
                <p className="text-muted-foreground">
                  A política está alinhada ao propósito da organização e fornece a estrutura para o
                  estabelecimento dos objetivos de compliance. Está disponível como informação
                  documentada.
                </p>
                <div className="pt-3 flex gap-3">
                  <Button variant="outline" size="sm">
                    Visualizar PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    Histórico de Aceites
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md">Histórico de Versões</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Versão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aprovador</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((v) => (
                    <TableRow key={v.v}>
                      <TableCell className="font-medium">{v.v}</TableCell>
                      <TableCell>
                        <Badge
                          variant={v.status === 'Vigente' ? 'default' : 'secondary'}
                          className={v.status === 'Vigente' ? 'bg-success hover:bg-success' : ''}
                        >
                          {v.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{v.approver}</TableCell>
                      <TableCell className="text-sm">{v.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Comparar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" /> Vínculos Normativos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Obrigações Atendidas (4.5)
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Lei Anticorrupção
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Código de Ética
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Riscos Mitigados (4.6)
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 border-orange-200"
                  >
                    R01 - Fraude
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 border-orange-200"
                  >
                    R02 - Corrupção
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-md flex items-start gap-2 text-xs text-blue-800">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  A norma exige vínculo explícito da política com o contexto, obrigações e riscos
                  (Módulo 4).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
