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
import { FileKey, Plus, Loader2, CalendarClock } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

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

  const simulateRopa = async () => {
    // Generate a date close to expiration for the AI Health Check to pick up
    const nextMonth = new Date()
    nextMonth.setDate(nextMonth.getDate() + 15)

    const { error } = await supabase.from('digital_ropa').insert({
      tenant_id: tenant.id,
      process_name: 'Campanhas de Marketing E-mail',
      purpose: 'Envio de promoções, newsletters e convites para eventos',
      legal_basis: 'Consentimento',
      next_review_date: nextMonth.toISOString().split('T')[0],
      status: 'Ativo',
    })

    if (!error) {
      toast({
        title: 'Atividade Inserida',
        description: 'Registro de tratamento criado para demonstração.',
      })
      fetchRopas()
    }
  }

  return (
    <Card className="animate-in fade-in shadow-sm border-slate-200">
      <CardHeader className="border-b bg-slate-50/50 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileKey className="w-5 h-5 text-primary" /> Inventário de Dados (RoPA)
          </CardTitle>
          <CardDescription>
            Mapeamento estruturado das atividades de tratamento de dados e suas bases legais.
          </CardDescription>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="secondary" onClick={simulateRopa}>
            <CalendarClock className="w-4 h-4 mr-2" /> Simular Tratamento
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" /> Novo Processo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : ropas.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-slate-50">
            <p>Nenhuma atividade registrada no inventário.</p>
            <p className="text-sm mt-1">
              Utilize o botão "Simular Tratamento" para adicionar um exemplo.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Processo / Atividade</TableHead>
                <TableHead>Finalidade</TableHead>
                <TableHead>Base Legal</TableHead>
                <TableHead>Próxima Revisão</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ropas.map((r) => {
                const isExpiringSoon =
                  r.next_review_date &&
                  new Date(r.next_review_date) <
                    new Date(new Date().setDate(new Date().getDate() + 30))
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-slate-800">{r.process_name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.purpose}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.legal_basis || 'Não Definida'}</Badge>
                    </TableCell>
                    <TableCell>
                      {r.next_review_date ? (
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isExpiringSoon ? 'text-amber-600' : 'text-slate-600',
                          )}
                        >
                          {new Date(r.next_review_date).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge>{r.status}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
