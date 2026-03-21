import { useEffect, useState } from 'react'
import { useParams, Outlet, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { Loader2 } from 'lucide-react'

export default function TenantContext() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { setActiveTenant } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const isValidUUID = tenantId
    ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantId)
    : false

  useEffect(() => {
    const fetchTenant = async () => {
      if (!isValidUUID || !tenantId) {
        setError(true)
        setActiveTenant(null)
        setLoading(false)
        return
      }

      setLoading(true)
      const { data, error } = await supabase.from('tenants').select('*').eq('id', tenantId).single()

      if (error || !data) {
        setError(true)
        setActiveTenant(null)
      } else {
        setActiveTenant(data as any)
        setError(false)
      }
      setLoading(false)
    }

    fetchTenant()

    return () => {
      // Optional: Cleanup when leaving tenant context completely
      // setActiveTenant(null) is handled by the Tenants list page mount
    }
  }, [tenantId, isValidUUID, setActiveTenant])

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center animate-fade-in">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p>Carregando ambiente isolado...</p>
        </div>
      </div>
    )
  }

  if (error || !isValidUUID) {
    return <Navigate to="/tenants" replace />
  }

  return <Outlet />
}
