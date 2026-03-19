import { Link } from 'react-router-dom'
import { Download, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react'
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
import { ISO_CLAUSES } from '@/lib/iso-data'

export function IsoChecklist() {
  const clauses = ISO_CLAUSES.filter((c) => c.parent)

  const getStatus = (id: string) => {
    if (['4.1', '5.1', '5.2', '8.3', '9.1', '10.1'].includes(id)) return 'Conforme'
    if (['4.6', '7.2', '9.2'].includes(id)) return 'Parcial'
    if (['6.3', '8.2'].includes(id)) return 'Não Conforme'
    return 'Conforme'
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary">
          Checklist de Certificação ISO 37301:2021
        </h3>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar Checklist
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Requisito</TableHead>
              <TableHead>Descrição da Norma</TableHead>
              <TableHead>Fase (PDCA)</TableHead>
              <TableHead>Status Atual</TableHead>
              <TableHead className="text-right">Acessar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clauses.map((c) => {
              const status = getStatus(c.id)
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-mono font-medium text-muted-foreground">
                    {c.id}
                  </TableCell>
                  <TableCell className="font-medium text-sm">{c.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {c.phase}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        status === 'Conforme'
                          ? 'bg-success/10 text-success border-success/20'
                          : status === 'Parcial'
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            : 'bg-destructive/10 text-destructive border-destructive/20'
                      }
                    >
                      {status === 'Conforme' && <ShieldCheck className="mr-1 h-3 w-3" />}
                      {status === 'Parcial' && <AlertCircle className="mr-1 h-3 w-3" />}
                      {status === 'Não Conforme' && <AlertCircle className="mr-1 h-3 w-3" />}
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/clause/${c.id}`}>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
