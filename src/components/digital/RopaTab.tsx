import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { FileKey, Plus, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function RopaTab({ tenant }: any) {
  const [ropas, setRopas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRopas()
  }, [tenant.id])

  const fetchRopas = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('digital_ropa')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
    if (data) setRopas(data)
    setLoading(false)
  }

  return (
    <Card className="animate-in fade-in shadow-sm border-slate-200">
      <CardHeader className="border-b bg-slate-50/50 pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileKey className="w-5 h-5 text-primary" /> Inventário de Dados (RoPA)
          </CardTitle>
          <CardDescription>
            Mapeamento estruturado das atividades de tratamento de dados.
          </CardDescription>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Novo Processo
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : ropas.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-slate-50">
            <p>Nenhuma atividade registrada no inventário.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Processo / Atividade</TableHead>
                <TableHead>Finalidade</TableHead>
                <TableHead>Base Legal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ropas.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-slate-800">{r.process_name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{r.purpose}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.legal_basis}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{r.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
