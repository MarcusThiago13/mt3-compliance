import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Download, Lock, CheckCircle2, Archive, GitCommit } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const documents = [
  {
    index: '5.2',
    title: 'Política de Compliance',
    version: 'v2.1',
    status: 'Vigente',
    access: 'Público Interno',
    retention: '5 anos',
    approval: 'Conselho Admin',
  },
  {
    index: '8.4',
    title: 'Relatório de Investigação #042',
    version: 'v1.0',
    status: 'Arquivado',
    access: 'Restrito (Privilégio Legal)',
    retention: '10 anos',
    approval: 'Comitê Ética',
  },
  {
    index: '6.1',
    title: 'Matriz de Riscos SGC 2024',
    version: 'v0.9',
    status: 'Em Revisão',
    access: 'Membros SGC',
    retention: 'Permanente',
    approval: 'Diretoria',
  },
]

export function DocumentedInfo75() {
  const handleExport = () => {
    toast({
      title: 'Biblioteca Exportada',
      description: 'O índice completo de informações documentadas foi gerado.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">7.5 Informação Documentada (GED)</h3>
          <p className="text-sm text-muted-foreground">
            Criação, atualização e controle de documentos essenciais com indexação normativa.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Índice Documental Completo
        </Button>
      </div>

      <Tabs defaultValue="ged">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="ged" className="text-xs sm:text-sm py-2">
            Repositório e Workflows
          </TabsTrigger>
          <TabsTrigger value="access" className="text-xs sm:text-sm py-2">
            Controle de Acesso e Retenção
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ged">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Item ISO</TableHead>
                  <TableHead>Título do Documento</TableHead>
                  <TableHead>Versão / Aprovação</TableHead>
                  <TableHead>Status (Workflow)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {doc.index}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" /> {doc.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm font-mono">
                        <GitCommit className="h-3 w-3 text-muted-foreground" /> {doc.version}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        Aprov: {doc.approval}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          doc.status === 'Vigente'
                            ? 'bg-success/10 text-success border-success/20'
                            : doc.status === 'Arquivado'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                        }
                      >
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="access">
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título do Documento</TableHead>
                  <TableHead>Nível de Acesso</TableHead>
                  <TableHead>Regra de Retenção e Descarte</TableHead>
                  <TableHead>Estado Atual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{doc.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        {doc.access.includes('Restrito') && (
                          <Lock className="h-3 w-3 text-destructive" />
                        )}
                        <span
                          className={
                            doc.access.includes('Restrito') ? 'text-destructive font-semibold' : ''
                          }
                        >
                          {doc.access}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground flex items-center gap-2">
                      <Archive className="h-4 w-4" /> Manter por {doc.retention}
                    </TableCell>
                    <TableCell>
                      {doc.status === 'Arquivado' ? (
                        <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                          Bloqueado p/ uso geral
                        </span>
                      ) : (
                        <span className="text-xs text-success font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Em Circulação
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
