import { Bell, Search, User } from 'lucide-react'
import { useAppStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function Header() {
  const { activeTenant, setActiveTenant, tenants, userRole, auditorMode, setAuditorMode } =
    useAppStore()

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <SidebarTrigger />

      <div className="flex flex-1 items-center gap-4">
        {userRole === 'superadmin' && (
          <div className="w-64">
            <Select
              value={activeTenant?.id}
              onValueChange={(val) => setActiveTenant(tenants.find((t) => t.id === val)!)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione o Cliente" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <form className="ml-auto hidden sm:flex lg:w-80">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar em compliance..."
              className="w-full appearance-none bg-background pl-8 shadow-none h-9"
            />
          </div>
        </form>

        <div className="flex items-center space-x-2 mr-4">
          <Switch id="auditor-mode" checked={auditorMode} onCheckedChange={setAuditorMode} />
          <Label htmlFor="auditor-mode" className="text-xs font-medium">
            Modo Auditor
          </Label>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
              <span className="sr-only">Menu do usuário</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Autenticação 2FA</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
