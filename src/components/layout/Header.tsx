import { SidebarTrigger } from '@/components/ui/sidebar'
import { Bell, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/main'
import { useAuth } from '@/hooks/use-auth'

export function Header() {
  const { activeTenant } = useAppStore()
  const { signOut } = useAuth()

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md px-4 shadow-sm transition-all duration-300 w-full">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-4 w-px bg-border mx-2 hidden sm:block"></div>
          {activeTenant && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground leading-tight">
                {activeTenant.name}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono leading-tight">
                CNPJ: {activeTenant.cnpj}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
          </Button>
          <div
            className="flex items-center gap-2 bg-muted/50 p-1.5 pr-3 rounded-full border border-border cursor-pointer hover:bg-muted transition-colors"
            onClick={signOut}
            title="Sair do Sistema"
          >
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium hidden sm:block truncate max-w-[120px]">
              Administrador
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
