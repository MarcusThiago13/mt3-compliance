import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Header } from '@/components/layout/Header'
import { useAppStore } from '@/stores/main'
import { ComplianceChat } from '@/components/chat/ComplianceChat'

export default function Layout() {
  const { auditorMode } = useAppStore()

  return (
    <SidebarProvider>
      <div
        className={`flex min-h-screen w-full bg-background transition-colors duration-300 ${auditorMode ? 'border-t-4 border-t-accent' : ''}`}
      >
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-6 md:p-8 animate-fade-in max-w-7xl mx-auto w-full relative">
            {auditorMode && (
              <div className="mb-4 flex items-center justify-between rounded-md bg-accent/10 px-4 py-2 text-accent-foreground">
                <span className="text-sm font-semibold">Modo Auditor Ativado</span>
                <span className="text-xs">
                  Visualização filtrada para verificação de conformidade.
                </span>
              </div>
            )}
            <Outlet />
          </main>
          <ComplianceChat />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
