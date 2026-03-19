import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Tenant {
  id: string
  name: string
  cnpj: string
}

interface AppState {
  activeTenant: Tenant | null
  setActiveTenant: (tenant: Tenant) => void
  tenants: Tenant[]
  userRole: 'superadmin' | 'tenantadmin'
  auditorMode: boolean
  setAuditorMode: (mode: boolean) => void
}

const AppContext = createContext<AppState | null>(null)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenants] = useState<Tenant[]>([
    { id: 't1', name: 'Acme Corp', cnpj: '12.345.678/0001-90' },
    { id: 't2', name: 'Global Tech', cnpj: '98.765.432/0001-10' },
  ])
  const [activeTenant, setActiveTenant] = useState<Tenant | null>(tenants[0])
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
