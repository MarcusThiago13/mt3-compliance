import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/main'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShieldCheck } from 'lucide-react'

import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import TenantContext from './components/layout/TenantContext'
import Tenants from './pages/Tenants'
import TenantUsers from './pages/TenantUsers'
import AdminUsers from './pages/AdminUsers'
import Onboarding from './pages/Onboarding'
import ClauseView from './pages/ClauseView'
import Intelligence from './pages/Intelligence'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, signIn } = useAuth()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('Admin123!')

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando Sistema de Gestão...
      </div>
    )

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-sm p-8 bg-background border rounded-xl shadow-lg animate-fade-in-up">
          <div className="flex flex-col items-center mb-6">
            <ShieldCheck className="h-10 w-10 text-primary mb-2" />
            <h2 className="text-2xl font-bold text-center">mt3 Compliance</h2>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Faça login para acessar o SGC
            </p>
          </div>
          <div className="space-y-4">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
            />
            <Button className="w-full" onClick={() => signIn(email, password)}>
              Entrar
            </Button>
          </div>
        </div>
      </div>
    )
  }
  return <>{children}</>
}

const TenantIndexRedirect = () => {
  const { tenantId } = useParams<{ tenantId: string }>()
  return <Navigate to={`/${tenantId}/clause/4.1`} replace />
}

const App = () => (
  <AppProvider>
    <AuthProvider>
      <AuthGuard>
        <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/onboarding" element={<Onboarding />} />

                <Route path="/:tenantId" element={<TenantContext />}>
                  <Route index element={<TenantIndexRedirect />} />
                  <Route path="users" element={<TenantUsers />} />
                  <Route path="clause/:id" element={<ClauseView />} />
                  <Route path="intelligence" element={<Intelligence />} />
                  <Route path="onboarding" element={<Onboarding />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </AuthGuard>
    </AuthProvider>
  </AppProvider>
)

export default App
