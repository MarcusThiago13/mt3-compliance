import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { useAuth } from '@/hooks/use-auth'

export type Role = 'admin' | 'editor' | 'auditor' | 'consultant' | 'viewer'

export function useRBAC() {
  const { activeTenant } = useAppStore()
  const { user } = useAuth()
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  const isSuperAdmin =
    user?.email === 'admin@example.com' ||
    user?.email === 'marcusthiago.adv@gmail.com' ||
    user?.app_metadata?.role === 'admin' ||
    user?.user_metadata?.is_admin === true ||
    user?.user_metadata?.is_admin === 'true'

  useEffect(() => {
    let isMounted = true

    async function fetchRole() {
      if (isSuperAdmin) {
        if (isMounted) {
          setRole('admin')
          setLoading(false)
        }
        return
      }

      if (!activeTenant?.id || !user?.id) {
        if (isMounted) {
          setRole(null)
          setLoading(false)
        }
        return
      }

      setLoading(true)

      try {
        const { data, error } = await supabase
          .from('user_tenants')
          .select('role')
          .eq('user_id', user.id)
          .eq('tenant_id', activeTenant.id)
          .single()

        if (isMounted) {
          if (!error && data) {
            setRole((data.role as Role) || 'viewer')
          } else {
            setRole('viewer')
          }
        }
      } catch (err) {
        if (isMounted) setRole('viewer')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchRole()

    return () => {
      isMounted = false
    }
  }, [activeTenant?.id, user?.id, isSuperAdmin])

  return {
    role,
    isSuperAdmin,
    isAdmin: isSuperAdmin || role === 'admin',
    canEdit: isSuperAdmin || role === 'admin' || role === 'editor',
    isAuditor: role === 'auditor',
    isConsultant: role === 'consultant',
    isViewer: role === 'viewer' || role === null,
    loading,
  }
}
