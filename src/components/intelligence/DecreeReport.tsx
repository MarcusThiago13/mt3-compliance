import { Download, FileText, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
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
import { DECREE_ART_57 } from '@/lib/decree-data'

export function DecreeReport() {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-emerald-700">
          Relatório de Integridade (Art. 57 - Decreto 11.129/22)
        </h3>
        <Button variant="outline" className="text-emerald-700 border-emerald-700/50">
          <Download className="mr-2 h-4 w-4" /> Exportar (Formato CGU)
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Inciso</TableHead>
              <TableHead>Parâmetro de Avaliação (Art. 57)</TableHead>
              <TableHead>Mapeamento ISO</TableHead>
              <TableHead>Status SGC</TableHead>
              <TableHead className="text-right">Evidência / Acesso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DECREE_ART_57.map((inc) => (
              <TableRow key={inc.id}>
                <TableCell className="font-bold text-muted-foreground">{inc.id}</TableCell>
                <TableCell className="text-sm font-medium">{inc.desc}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {inc.isoMap.split(', ').map((iso) => (
                      <Badge key={iso} variant="secondary" className="font-mono text-[10px]">
                        {iso}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      inc.id === 'XIII'
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        : 'bg-success/10 text-success border-success/20'
                    }
                  >
                    {inc.id === 'XIII' ? 'Parcial' : 'Aderente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="link" className="h-auto p-0 text-xs text-blue-600" asChild>
                      <Link to={`/clause/${inc.isoMap.split(', ')[0]}`}>
                        <ExternalLink className="mr-1 h-3 w-3" /> Ver Módulo
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
