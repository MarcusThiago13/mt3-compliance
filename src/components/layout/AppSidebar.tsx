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
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  ShieldCheck,
  Target,
  Cog,
  Rocket,
  BarChart,
  RefreshCcw,
} from 'lucide-react'
import { getParentClauses, getClausesByParent } from '@/lib/iso-data'
import { useAppStore } from '@/stores/main'

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
  const { userRole } = useAppStore()
  const parentClauses = getParentClauses()

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex h-16 items-center justify-center border-b px-4">
        <div className="flex items-center gap-2 font-bold text-primary text-xl tracking-tight w-full">
          <ShieldCheck className="h-6 w-6 text-accent" />
          <span>mt3 Compliance</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Geral</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                  <Link to="/">
                    <LayoutDashboard />
                    <span>Dashboard PDCA</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                <SidebarMenuButton asChild>
                  <Link to="#">
                    <FileText />
                    <span>Relatórios</span>
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
                    <SidebarMenuButton className="font-medium text-primary">
                      <Icon className="h-4 w-4" />
                      <span>
                        {parent.id}. {parent.title}
                      </span>
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
