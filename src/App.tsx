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
import AdminAIUsage from './pages/AdminAIUsage'
import TenantTemplates from './pages/TenantTemplates'
import Onboarding from './pages/Onboarding'
import ClauseView from './pages/ClauseView'
import Intelligence from './pages/Intelligence'
import Dossier from './pages/Dossier'
import EvidenceInbox from './pages/EvidenceInbox'
import SubmitEvidence from './pages/SubmitEvidence'
import PublicReport from './pages/PublicReport'
import PublicReportStatus from './pages/PublicReportStatus'
import DueDiligence from './pages/DueDiligence'
import PublicFormCollection from './pages/PublicFormCollection'
import CollectionLinks from './pages/CollectionLinks'
import CommunicationsLog from './pages/CommunicationsLog'
import TenantDocuments from './pages/TenantDocuments'
import DocumentEditor from './pages/DocumentEditor'
import RegularidadeInstitucional from './pages/osc/RegularidadeInstitucional'
import Cebas from './pages/osc/Cebas'

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
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/r/:tenantId/report" element={<PublicReport />} />
            <Route path="/r/:tenantId/status" element={<PublicReportStatus />} />
            <Route path="/f/:token" element={<PublicFormCollection />} />

            {/* Protected Routes */}
            <Route
              element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/ai-usage" element={<AdminAIUsage />} />
              <Route path="/collection-links" element={<CollectionLinks />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/submit/:requestId" element={<SubmitEvidence />} />

              <Route path="/:tenantId" element={<TenantContext />}>
                <Route index element={<TenantIndexRedirect />} />
                <Route path="users" element={<TenantUsers />} />
                <Route path="clause/:id" element={<ClauseView />} />
                <Route path="intelligence" element={<Intelligence />} />
                <Route path="onboarding" element={<Onboarding />} />
                <Route path="dossier" element={<Dossier />} />
                <Route path="inbox" element={<EvidenceInbox />} />
                <Route path="due-diligence" element={<DueDiligence />} />
                <Route path="communications" element={<CommunicationsLog />} />
                <Route path="templates" element={<TenantTemplates />} />
                <Route path="documents" element={<TenantDocuments />} />
                <Route path="documents/:docId" element={<DocumentEditor />} />

                {/* OSC Routes */}
                <Route path="osc/regularidade" element={<RegularidadeInstitucional />} />
                <Route path="osc/cebas" element={<Cebas />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AuthProvider>
  </AppProvider>
)

export default App
