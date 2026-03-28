import { useState, useEffect } from 'react'
import { Search, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { DiarioBordoForm } from './DiarioBordoForm'

export function DiarioBordoTab({ tenantId }: { tenantId: string }) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const loadLogs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('osc_inclusive_daily_logs')
      .select('*, student:osc_inclusive_students(name)')
      .eq('tenant_id', tenantId)
      .order('log_date', { ascending: false })

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os diários',
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
      l.activity_type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por estudante ou atividade..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DiarioBordoForm tenantId={tenantId} onSaved={loadLogs} />
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Carregando diários de bordo...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-slate-50">
          <p className="text-muted-foreground">Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((log) => (
            <Card key={log.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base truncate">{log.student?.name}</CardTitle>
                  <Badge variant={log.presence ? 'default' : 'destructive'}>
                    {log.presence ? 'Presente' : 'Ausente'}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(log.log_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-1">{log.activity_type}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{log.description}</p>
                <div className="flex flex-wrap gap-2">
                  {log.paee_adherence && (
                    <Badge variant="outline" className="text-xs">
                      PAEE OK
                    </Badge>
                  )}
                  {log.needs_referral && (
                    <Badge variant="secondary" className="text-xs">
                      Atenção/Encaminhar
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
