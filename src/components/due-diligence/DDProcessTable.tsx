import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { Loader2, ShieldCheck, AlertTriangle, ShieldAlert, Plus } from 'lucide-react'

export function DDProcessTable({
  targetTypes,
  title,
  description,
}: {
  targetTypes: string[]
  title: string
  description: string
}) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [processes, setProcesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDD = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('due_diligence_processes')
        .select('*')
        .eq('tenant_id', tenantId)
        .in('target_type', targetTypes)
        .order('created_at', { ascending: false })
      if (data) setProcesses(data)
      setLoading(false)
    }
    if (tenantId) fetchDD()
  }, [tenantId, targetTypes])

  const getRiskBadge = (level: string) => {
    if (level === 'Baixo')
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-none">
          <ShieldCheck className="w-3 h-3 mr-1" /> Baixo
        </Badge>
      )
    if (level === 'Médio')
      return (
        <Badge className="bg-amber-100 text-amber-800 border-none">
          <AlertTriangle className="w-3 h-3 mr-1" /> Médio
        </Badge>
      )
    if (level === 'Alto')
      return (
        <Badge className="bg-red-100 text-red-800 border-none">
          <ShieldAlert className="w-3 h-3 mr-1" /> Alto
        </Badge>
      )
    return <Badge variant="outline">Pendente</Badge>
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button size="sm" className="shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Iniciar Triagem
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : processes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-t">
            Nenhum processo de Due Diligence registrado nesta categoria.
          </div>
        ) : (
          <div className="overflow-x-auto border-t">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Alvo / Contraparte</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nível de Risco Identificado</TableHead>
                  <TableHead>Status da Triagem</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="font-semibold text-slate-800 text-sm">{p.target_name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">
                        {p.target_document || 'S/ Doc'}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{p.target_type}</TableCell>
                    <TableCell>{getRiskBadge(p.risk_level)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 text-slate-700">
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8">
                        Dossiê Completo
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
