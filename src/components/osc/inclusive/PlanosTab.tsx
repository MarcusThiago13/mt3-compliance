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
import { supabase } from '@/lib/supabase/client'
import { Loader2, FileText, CheckCircle2, AlertCircle } from 'lucide-react'

export function PlanosTab({ tenantId }: { tenantId: string }) {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPlans = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('osc_inclusive_plans')
      .select('*, osc_inclusive_cases(student_name)')
      .eq('tenant_id', tenantId)

    if (data) setPlans(data)
    setLoading(false)
  }

  useEffect(() => {
    if (tenantId) fetchPlans()
  }, [tenantId])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" /> Acompanhamento de PAEE e PEI
        </h3>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Criar Plano</Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum plano (PEI ou PAEE) elaborado ainda. Crie o primeiro plano a partir de um
              Estudo de Caso.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Tipo de Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsáveis (AEE/Docente)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.osc_inclusive_cases?.student_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.plan_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {p.status === 'Vigente' ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-none">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Vigente
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 border-none">
                          <AlertCircle className="h-3 w-3 mr-1" /> Em Elaboração
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.responsibles || 'Não atribuído'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
