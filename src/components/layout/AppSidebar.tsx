import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
  Users,
  FileText,
  Activity,
  ShieldCheck,
  Target,
  Cog,
  Rocket,
  BarChart,
  RefreshCcw,
  Search,
} from 'lucide-react'
import { getParentClauses, getClausesByParent } from '@/lib/iso-data'
import { useAppStore } from '@/stores/main'
import { Button } from '@/components/ui/button'

const phaseIcons: Record<string, any> = {
  '4': Target,
  '5': ShieldCheck,
  '6': Cog,
  '7': Users,
  '8': Rocket,
  '9': BarChart,
  '10': RefreshCcw,
}

export function AppSidebar() {
  const location = useLocation()
  const { userRole, auditorMode, setAuditorMode } = useAppStore()
  const parentClauses = getParentClauses()

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col gap-4 border-b px-4 py-4">
        <div className="flex items-center gap-2 font-bold text-primary text-xl tracking-tight w-full mt-2">
          <ShieldCheck className="h-6 w-6 text-accent" />
          <span>mt3 Compliance</span>
        </div>
        <Button
          variant={auditorMode ? 'default' : 'outline'}
          size="sm"
          className="w-full justify-start text-xs font-semibold"
          onClick={() => setAuditorMode(!auditorMode)}
        >
          <Search className="mr-2 h-3.5 w-3.5" />
          {auditorMode ? 'Desativar Modo Auditor' : 'Ativar Modo Auditor'}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Geral</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userRole === 'superadmin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname.startsWith('/tenants')}>
                    <Link to="/tenants">
                      <Users />
                      <span>Gestão de Clientes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.startsWith('/intelligence')}>
                  <Link to="/intelligence">
                    <Activity />
                    <span>Inteligência & Certificação</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="#">
                    <FileText />
                    <span>Relatórios Genéricos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>ISO 37301:2021</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {parentClauses.map((parent) => {
                const Icon = phaseIcons[parent.id] || Activity
                const children = getClausesByParent(parent.id)
                return (
                  <SidebarMenuItem key={parent.id}>
                    <SidebarMenuButton className="font-medium text-primary" asChild>
                      <Link to={`/clause/${parent.id}`}>
                        <Icon className="h-4 w-4" />
                        <span>
                          {parent.id}. {parent.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                    {children.length > 0 && (
                      <SidebarMenuSub>
                        {children.map((child) => (
                          <SidebarMenuSubItem key={child.id}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={location.pathname === `/clause/${child.id}`}
                            >
                              <Link to={`/clause/${child.id}`}>
                                <span className="w-6 shrink-0">{child.id}</span>
                                <span className="truncate" title={child.title}>
                                  {child.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
