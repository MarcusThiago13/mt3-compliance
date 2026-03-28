import { useState, useEffect } from 'react'
import { Search, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { RegistroTecnicoForm } from './RegistroTecnicoForm'

export function RegistroTecnicoTab({ tenantId }: { tenantId: string }) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const loadLogs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('osc_inclusive_technical_logs')
      .select('*, student:osc_inclusive_students(name)')
      .eq('tenant_id', tenantId)
      .order('log_date', { ascending: false })

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os registros',
        variant: 'destructive',
      })
    } else {
      setLogs(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadLogs()
  }, [tenantId])

  const filtered = logs.filter(
    (l) =>
      l.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.professional_role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por estudante ou profissional..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <RegistroTecnicoForm tenantId={tenantId} onSaved={loadLogs} />
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Carregando registros técnicos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-slate-50">
          <p className="text-muted-foreground">Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((log) => (
            <Card key={log.id} className={log.is_secret ? 'border-amber-200 bg-amber-50/30' : ''}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base truncate flex items-center gap-2">
                      {log.student?.name}
                      {log.is_secret && <Lock className="h-3 w-3 text-amber-600" />}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{log.intervention_type}</p>
                  </div>
                  <Badge variant="outline">{log.professional_role}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {log.is_secret ? (
                  <div className="p-4 bg-amber-100/50 rounded-md border border-amber-200 text-amber-800 text-sm flex items-center gap-3">
                    <Lock className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Registro Sigiloso</p>
                      <p className="text-xs">
                        Acesso restrito ao profissional responsável e coordenação técnica.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {log.description}
                    </p>
                    {log.referrals && (
                      <div className="text-xs bg-slate-100 p-2 rounded mt-2">
                        <span className="font-semibold">Encaminhamentos:</span> {log.referrals}
                      </div>
                    )}
                  </>
                )}
                <div className="mt-4 text-xs text-muted-foreground flex justify-between">
                  <span>Por: {log.professional_name}</span>
                  <span>{new Date(log.log_date).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
