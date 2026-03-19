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
import { Download, Plus } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const stakeholdersData = [
  {
    id: 1,
    name: 'Órgãos Reguladores',
    cat: 'Externo',
    inf: 5,
    imp: 5,
    int: 'Alto',
    req: 'Conformidade legal contínua',
    dec: 'Sim',
  },
  {
    id: 2,
    name: 'Conselho Administrativo',
    cat: 'Interno',
    inf: 5,
    imp: 4,
    int: 'Alto',
    req: 'Relatórios de risco',
    dec: 'Sim',
  },
  {
    id: 3,
    name: 'Colaboradores',
    cat: 'Interno',
    inf: 3,
    imp: 4,
    int: 'Alto',
    req: 'Ambiente seguro e ético',
    dec: 'Sim',
  },
  {
    id: 4,
    name: 'Fornecedores Críticos',
    cat: 'Externo',
    inf: 4,
    imp: 3,
    int: 'Médio',
    req: 'Contratos claros',
    dec: 'Parcial',
  },
  {
    id: 5,
    name: 'Comunidade Local',
    cat: 'Externo',
    inf: 2,
    imp: 2,
    int: 'Baixo',
    req: 'Sustentabilidade',
    dec: 'Sim',
  },
]

export function Stakeholders() {
  const exportData = () => {
    toast({
      title: 'Matriz Exportada',
      description: 'Matriz de partes interessadas gerada com sucesso.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Partes Interessadas (Stakeholders)</h3>
          <p className="text-sm text-muted-foreground">
            Necessidades, expectativas e requisitos do SGC.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" /> Matriz
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Parte
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parte Interessada</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-center">Inf. / Imp.</TableHead>
              <TableHead>Requisito Principal</TableHead>
              <TableHead>Atendido?</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stakeholdersData.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      s.cat === 'Interno'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-orange-50 text-orange-700'
                    }
                  >
                    {s.cat}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1 text-xs font-mono">
                    <span className="bg-muted px-1 rounded" title="Influência">
                      {s.inf}
                    </span>
                    <span className="text-muted-foreground">x</span>
                    <span className="bg-muted px-1 rounded" title="Impacto">
                      {s.imp}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs truncate max-w-[200px]">{s.req}</TableCell>
                <TableCell>
                  <Badge className={s.dec === 'Sim' ? 'bg-success' : 'bg-amber-500'}>{s.dec}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 bg-muted/30 rounded-lg text-sm flex gap-4 items-center">
        <div className="h-10 w-10 bg-primary/10 rounded flex items-center justify-center shrink-0">
          <span className="font-bold text-primary">i</span>
        </div>
        <p className="text-muted-foreground">
          O mapeamento de partes interessadas ajuda a definir o escopo do SGC. Partes com alta
          Influência e alto Impacto devem ter seus requisitos obrigatoriamente endereçados na matriz
          de riscos e obrigações.
        </p>
      </div>
    </div>
  )
}
