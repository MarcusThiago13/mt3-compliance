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
  UserCog,
  FileText,
  Activity,
  ShieldCheck,
  Target,
  Cog,
  Rocket,
  BarChart,
  RefreshCcw,
  Search,
  FileSearch,
  BrainCircuit,
  History,
  Library,
  Landmark,
  FileBadge,
  Handshake,
  Baby,
  Shield,
  BookOpen,
  Accessibility,
  FileCheck,
  Briefcase,
  Lock,
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
  const { activeTenant, userRole, auditorMode, setAuditorMode } = useAppStore()
  const parentClauses = getParentClauses()

  const tid = activeTenant ? `/${activeTenant.id}` : ''

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col gap-4 border-b px-4 py-4">
        <div className="flex items-center gap-2 font-bold text-primary text-xl tracking-tight w-full mt-2">
          <ShieldCheck className="h-6 w-6 text-accent" />
          <span>mt3 Compliance</span>
        </div>
        {activeTenant && (
          <Button
            variant={auditorMode ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start text-xs font-semibold"
            onClick={() => setAuditorMode(!auditorMode)}
          >
            <Search className="mr-2 h-3.5 w-3.5" />
            {auditorMode ? 'Desativar Modo Auditor' : 'Ativar Modo Auditor'}
          </Button>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administração Central</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userRole === 'superadmin' && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === '/tenants' || location.pathname === '/'}
                    >
                      <Link to="/tenants">
                        <Users />
                        <span>Gestão de Clientes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/admin/users'}>
                      <Link to="/admin/users">
                        <UserCog />
                        <span>Gestão de Usuários</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/admin/ai-usage'}>
                      <Link to="/admin/ai-usage">
                        <BrainCircuit />
                        <span>Consumo de IA</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {activeTenant && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace do Cliente</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.includes('/intelligence')}
                    >
                      <Link to={`${tid}/intelligence`}>
                        <Activity />
                        <span>Inteligência & Certificação</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.includes('/due-diligence')}
                    >
                      <Link to={`${tid}/due-diligence`}>
                        <FileSearch />
                        <span>Due Diligence (KYS)</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.includes('/trabalhista')}
                    >
                      <Link to={`${tid}/trabalhista`}>
                        <Briefcase />
                        <span>Compliance Trabalhista</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/digital')}>
                      <Link to={`${tid}/digital`}>
                        <Lock />
                        <span>Compliance Digital e LGPD</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/documents')}>
                      <Link to={`${tid}/documents`}>
                        <Library />
                        <span>Documentos Inteligentes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/onboarding')}>
                      <Link to={`${tid}/onboarding`}>
                        <FileText />
                        <span>Perfil da Organização</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.includes('/communications')}
                    >
                      <Link to={`${tid}/communications`}>
                        <History />
                        <span>Histórico de E-mails</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname.includes('/templates')}>
                      <Link to={`${tid}/templates`}>
                        <FileText />
                        <span>Templates de E-mail</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {activeTenant?.org_type === 'osc' && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-purple-600 font-semibold">
                  Trilha OSC - MROSC
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.includes('/osc/regularidade')}
                      >
                        <Link
                          to={`${tid}/osc/regularidade`}
                          className="text-purple-800 hover:text-purple-900"
                        >
                          <Landmark />
                          <span>Regularidade Institucional</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === `${tid}/osc/parcerias`}
                      >
                        <Link
                          to={`${tid}/osc/parcerias`}
                          className="text-purple-800 hover:text-purple-900"
                        >
                          <Handshake />
                          <span>Gestão de Parcerias</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.includes('/osc/prestacao-contas')}
                      >
                        <Link
                          to={`${tid}/osc/prestacao-contas`}
                          className="text-purple-800 hover:text-purple-900"
                        >
                          <FileCheck />
                          <span>Prestação de Contas</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.includes('/osc/cebas')}
                      >
                        <Link
                          to={`${tid}/osc/cebas`}
                          className="text-purple-800 hover:text-purple-900"
                        >
                          <FileBadge />
                          <span>Módulo CEBAS</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {activeTenant?.org_type === 'osc' && activeTenant?.org_subtype === 'educacional' && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-blue-600 font-semibold">
                  OSC Educacional
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.includes('/osc/conformidade-educacional')}
                      >
                        <Link
                          to={`${tid}/osc/conformidade-educacional`}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          <BookOpen />
                          <span>Conformidade Educacional</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.includes('/osc/protecao-infantil')}
                      >
                        <Link
                          to={`${tid}/osc/protecao-infantil`}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          <Baby />
                          <span>Proteção Infantil & Inclusão</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.includes('/osc/lgpd-escolar')}
                      >
                        <Link
                          to={`${tid}/osc/lgpd-escolar`}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          <Shield />
                          <span>LGPD Escolar</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname.includes('/osc/educacao-inclusiva')}
                      >
                        <Link
                          to={`${tid}/osc/educacao-inclusiva`}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          <Accessibility />
                          <span>Educação Inclusiva</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

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
                          <Link to={`${tid}/clause/${parent.id}`}>
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
                                  isActive={location.pathname === `${tid}/clause/${child.id}`}
                                >
                                  <Link to={`${tid}/clause/${child.id}`}>
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
          </>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
