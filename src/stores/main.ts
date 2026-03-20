import React, { createContext, useContext, useState } from 'react'

export interface Tenant {
  id: string
  name: string
  cnpj: string
}

interface AppState {
  activeTenant: Tenant | null
  setActiveTenant: (tenant: Tenant | null) => void
  tenants: Tenant[]
  userRole: 'superadmin' | 'tenantadmin'
  auditorMode: boolean
  setAuditorMode: (mode: boolean) => void
}

const AppContext = createContext<AppState | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenants] = useState<Tenant[]>([])
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null)
  const [userRole] = useState<'superadmin' | 'tenantadmin'>('superadmin')
  const [auditorMode, setAuditorMode] = useState(false)

  return React.createElement(
    AppContext.Provider,
    { value: { activeTenant, setActiveTenant, tenants, userRole, auditorMode, setAuditorMode } },
    children,
  )
}

export const useAppStore = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
