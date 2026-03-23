import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Activity, ShieldCheck, AlertTriangle, FileKey } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function DashboardDigitalTab({ tenant }: any) {
  const [counts, setCounts] = useState({ ropa: 0, incidents: 0, requests: 0 })

  useEffect(() => {
    const loadCounts = async () => {
      const { count: c1 } = await supabase
        .from('digital_ropa')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id)
      const { count: c2 } = await supabase
        .from('digital_incidents')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id)
      const { count: c3 } = await supabase
        .from('digital_requests')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id)
      setCounts({ ropa: c1 || 0, incidents: c2 || 0, requests: c3 || 0 })
    }
    loadCounts()
  }, [tenant.id])

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm">
              <FileKey className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{counts.ropa}</p>
              <p className="text-sm font-medium text-blue-700">Processos (RoPA)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-900">0</p>
              <p className="text-sm font-medium text-emerald-700">RIPDs Concluídos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-amber-600 shadow-sm">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900">{counts.requests}</p>
              <p className="text-sm font-medium text-amber-700">Requisições Abertas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full text-red-600 shadow-sm">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-900">{counts.incidents}</p>
              <p className="text-sm font-medium text-red-700">Incidentes Ativos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-48 border-2 border-dashed rounded-lg bg-slate-50 mt-4">
            <p className="text-muted-foreground text-sm">
              Configure o Inventário de Dados para visualizar o mapa de bases legais.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-48 border-2 border-dashed rounded-lg bg-slate-50 mt-4">
            <p className="text-muted-foreground text-sm">
              As métricas de resposta aos titulares (SLA) aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
