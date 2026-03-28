import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/stores/main'
import { useAuth } from '@/hooks/use-auth'

export type Role =
  | 'super_admin'
  | 'assessor_admin'
  | 'admin_tenant'
  | 'compliance_officer'
  | 'juridico'
  | 'financeiro'
  | 'rh_trabalhista'
  | 'encarregado_privacidade'
  | 'auditor_interno'
  | 'gestor_area'
  | 'colaborador'
  | 'visualizador'
  | 'admin'
  | 'editor'
  | 'auditor'
  | 'consultant'
  | 'viewer'

export function useRBAC() {
  const { activeTenant } = useAppStore()
  const { user } = useAuth()
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  const isSuperAdmin =
    user?.email === 'admin@example.com' ||
    user?.email === 'marcusthiago.adv@gmail.com' ||
    user?.app_metadata?.role === 'super_admin' ||
    user?.app_metadata?.role === 'admin' ||
    user?.user_metadata?.is_admin === true ||
    user?.user_metadata?.is_admin === 'true' ||
    role === 'super_admin'

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
            setRole((data.role as Role) || 'visualizador')
          } else {
            setRole('visualizador')
          }
        }
      } catch (err) {
        if (isMounted) setRole('visualizador')
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
    isAssessorAdmin: role === 'assessor_admin',
    isAdmin: isSuperAdmin || role === 'admin' || role === 'admin_tenant',
    isComplianceOfficer: role === 'compliance_officer',
    isJuridico: role === 'juridico',
    isFinanceiro: role === 'financeiro',
    isRH: role === 'rh_trabalhista',
    isDPO: role === 'encarregado_privacidade',
    isAuditor: role === 'auditor' || role === 'auditor_interno',
    isGestor: role === 'gestor_area',
    canEdit:
      isSuperAdmin ||
      [
        'admin',
        'admin_tenant',
        'compliance_officer',
        'editor',
        'gestor_area',
        'juridico',
        'financeiro',
        'rh_trabalhista',
        'encarregado_privacidade',
      ].includes(role || ''),
    isConsultant: role === 'consultant',
    isViewer: ['viewer', 'visualizador', 'colaborador'].includes(role || '') || role === null,
    loading,
  }
}
