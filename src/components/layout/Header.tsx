import { Link } from 'react-router-dom'
import { Settings, LogOut, Loader2, ShieldCheck, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAppStore } from '@/stores/main'
import { Badge } from '@/components/ui/badge'

export function Header() {
  const { user, signOut } = useAuth()
  const { activeTenant, auditorMode } = useAppStore()

  const handleSignOut = async () => {
    await signOut()
  }

  const isAdmin = user?.email === 'admin@example.com'

  return (
    <header
      className={`sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b px-4 sm:px-6 shadow-sm backdrop-blur-md transition-colors duration-300 ${auditorMode ? 'bg-accent/5 border-accent/20' : 'bg-background/95'}`}
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        {auditorMode && (
          <Badge
            variant="outline"
            className="hidden sm:flex bg-accent text-accent-foreground border-none shadow-sm gap-1 ml-2"
          >
            <ShieldCheck className="h-3 w-3" /> Visualização do Auditor
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        {activeTenant && (
          <span className="text-sm font-medium text-muted-foreground hidden md:inline-block bg-muted/50 px-3 py-1 rounded-full border">
            {activeTenant.name}
          </span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full ring-2 ring-primary/10 hover:ring-primary/30 transition-all"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={`https://img.usecurling.com/ppl/thumbnail?seed=${user?.id || 'admin'}`}
                  alt="Avatar"
                />
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">
                  {user?.user_metadata?.name || 'Administrador'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/tenants" className="w-full cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Painel Global</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair do Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
