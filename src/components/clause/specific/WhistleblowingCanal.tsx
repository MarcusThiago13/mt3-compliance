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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ShieldAlert, Info, ListFilter, ShieldCheck, Mail, Eye } from 'lucide-react'

const concerns = [
  {
    id: 'TKT-23-088',
    type: 'Assédio',
    origin: 'Interna',
    channel: 'Web',
    date: '16/10/2023',
    status: 'Nova',
    severity: 'Alta',
    anon: 'Anonimizado',
  },
  {
    id: 'TKT-23-087',
    type: 'Fraude',
    origin: 'Externa',
    channel: 'Email',
    date: '14/10/2023',
    status: 'Em Triagem',
    severity: 'Crítica',
    anon: 'Identificado',
  },
  {
    id: 'TKT-23-085',
    type: 'Dúvida Ética',
    origin: 'Interna',
    channel: 'Telefone',
    date: '10/10/2023',
    status: 'Encaminhada',
    severity: 'Baixa',
    anon: 'Anonimizado',
  },
]

export function WhistleblowingCanal() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">8.3 Levantamento de Preocupações</h3>
          <p className="text-sm text-muted-foreground">
            Recepção, triagem e gestão segura de denúncias e relatos.
          </p>
        </div>
      </div>

      <Tabs defaultValue="triage">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4 h-auto p-1 gap-1">
          <TabsTrigger value="triage" className="py-2">
            Triagem e Gestão (Inbox)
          </TabsTrigger>
          <TabsTrigger value="protection" className="py-2">
            Medidas de Proteção
          </TabsTrigger>
          <TabsTrigger value="preview" className="py-2">
            Formulário Público (Preview)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="triage">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <ListFilter className="h-4 w-4" /> Fila de Entrada
            </h4>
            <Button variant="outline" size="sm">
              Exportar Log Seguro
            </Button>
          </div>
          <div className="rounded-md border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Tipo / Gravidade</TableHead>
                  <TableHead>Origem / Canal</TableHead>
                  <TableHead>Data Recepção</TableHead>
                  <TableHead>Sigilo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {concerns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                      {c.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{c.type}</div>
                      <div
                        className={`text-[10px] font-bold uppercase ${c.severity === 'Crítica' ? 'text-destructive' : c.severity === 'Alta' ? 'text-orange-500' : 'text-blue-500'}`}
                      >
                        Grau: {c.severity}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.origin} ({c.channel})
                    </TableCell>
                    <TableCell className="text-sm">{c.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          c.anon === 'Anonimizado'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-blue-50 text-blue-700'
                        }
                      >
                        {c.anon}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          c.status === 'Nova'
                            ? 'bg-destructive/10 text-destructive border-destructive/20'
                            : ''
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" /> Analisar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="protection">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-3">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Política de Não-Retaliação Aplicada
            </h4>
            <p className="text-sm text-blue-800">
              A organização garante proteção integral a relatores de boa-fé. Tentativas de descobrir
              a identidade de relatores anônimos constituem falta gravíssima.
            </p>
            <ul className="text-sm text-blue-800 list-disc list-inside pl-5 space-y-1">
              <li>Criptografia de ponta-a-ponta nos anexos.</li>
              <li>Ocultação automática de metadados de arquivos.</li>
              <li>Acesso restrito via RBAC (Role-Based Access Control) exclusivo para o Comitê.</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="bg-muted/50 p-6 rounded-lg max-w-3xl mx-auto border shadow-sm mt-4">
            <div className="text-center mb-6">
              <ShieldAlert className="h-12 w-12 text-primary mx-auto mb-2" />
              <h4 className="text-xl font-bold">Relatar Incidente (Canal Seguro)</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Garantimos total confidencialidade e proteção contra retaliação.
              </p>
            </div>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>O relato será anônimo?</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm border p-3 rounded-md flex-1 cursor-pointer hover:bg-muted bg-white">
                      <input type="radio" name="anon" defaultChecked /> Sim, manter anonimato
                    </label>
                    <label className="flex items-center gap-2 text-sm border p-3 rounded-md flex-1 cursor-pointer hover:bg-muted bg-white">
                      <input type="radio" name="anon" /> Não, quero me identificar
                    </label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Tipo de Incidente</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Fraude e Corrupção</option>
                    <option>Assédio Moral/Sexual</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Descrição Detalhada</Label>
                  <Textarea
                    placeholder="O que aconteceu? Quando? Quem está envolvido?"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
              <Button className="w-full bg-primary text-primary-foreground h-12 text-md">
                Enviar Relato de Forma Segura
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
