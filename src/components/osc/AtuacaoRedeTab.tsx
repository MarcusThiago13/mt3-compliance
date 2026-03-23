import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Network, Plus, ShieldAlert } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { supabase } from '@/lib/supabase/client'

export default function AtuacaoRedeTab({ partnership }: any) {
  const [network, setNetwork] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNetwork = async () => {
      const { data } = await supabase
        .from('osc_partnership_network' as any)
        .select('*')
        .eq('partnership_id', partnership.id)
      if (data) setNetwork(data)
      setLoading(false)
    }
    fetchNetwork()
  }, [partnership.id])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-purple-50/50 p-4 rounded-lg border border-purple-100">
        <div>
          <h3 className="font-semibold text-purple-900 flex items-center">
            <Network className="h-5 w-5 mr-2 text-purple-600" />
            Atuação em Rede (Bloco 7)
          </h3>
          <p className="text-sm text-purple-800 mt-1 max-w-2xl">
            Controle de organizações executantes e não celebrantes. A OSC celebrante deve monitorar 
            os documentos e prestação de contas dos parceiros de rede, conforme o regulamento aplicável.
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 shrink-0">
          <Plus className="h-4 w-4 mr-2" /> Adicionar Entidade
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
            </div>
          ) : network.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground bg-slate-50/50">
              <ShieldAlert className="h-12 w-12 mb-4 opacity-20 text-purple-600" />
              <p className="font-medium text-slate-700 text-lg">Nenhuma atuação em rede registrada</p>
              <p className="text-sm mt-2 max-w-md">
                Se esta parceria envolve outras organizações na execução do objeto, registre-as aqui 
                para garantir a vinculação documental e financeira à prestação de contas principal.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Organização Executante</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Instrumento Próprio</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {network.map((net) => (
                    <TableRow key={net.id}>
                      <TableCell className="font-medium">{net.organization_name}</TableCell>
                      <TableCell className="font-mono text-sm">{net.cnpj}</TableCell>
                      <TableCell>{net.instrument_type}</TableCell>
                      <TableCell>{net.status}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Ver Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
