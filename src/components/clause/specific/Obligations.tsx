import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Download,
  Plus,
  BookOpen,
  MoreHorizontal,
  ShieldAlert,
  Link as LinkIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { toast } from '@/hooks/use-toast'

export function Obligations() {
  const navigate = useNavigate()
  const { activeTenant } = useAppStore()
  const tenantPath = activeTenant ? `/${activeTenant.id}` : ''
  const isOSC = activeTenant?.org_type === 'osc'
  const isEducacional = activeTenant?.org_subtype === 'educacional'

  const [obsData, setObsData] = useState([
    {
      id: 'OBL-01',
      type: 'Mandatória',
      subcategory: 'Integridade e Anticorrupção',
      source: 'Lei Anticorrupção (12.846/13)',
      area: 'Jurídico',
      date: 'Contínuo',
      status: 'Conforme',
    },
    {
      id: 'OBL-02',
      type: 'Mandatória',
      subcategory: 'Proteção de Dados Pessoais',
      source: 'LGPD (13.709/18)',
      area: 'TI / DPO',
      date: 'Contínuo',
      status: 'Conforme',
    },
    {
      id: 'OBL-03',
      type: 'Voluntária',
      subcategory: 'Sustentabilidade',
      source: 'Pacto Global da ONU',
      area: 'Sustentabilidade',
      date: 'Anual',
      status: 'Em Observação',
    },
  ])

  const loadOSCObligations = () => {
    // Avoid duplicating if already loaded
    if (obsData.find((o) => o.id === 'OBL-04')) {
      toast({ description: 'Biblioteca de obrigações da OSC já está carregada.' })
      return
    }

    setObsData([
      ...obsData,
      {
        id: 'OBL-04',
        type: 'Mandatória',
        subcategory: 'MROSC e Parcerias',
        source: 'Lei 13.019/2014 (MROSC)',
        area: 'Projetos / Diretoria',
        date: 'Contínuo',
        status: 'Conforme',
      },
      {
        id: 'OBL-05',
        type: 'Mandatória',
        subcategory: 'Exigências do Instrumento',
        source: 'Termo de Fomento 01/2026 - SME',
        area: 'Financeiro',
        date: 'Mensal',
        status: 'Pendente',
      },
      {
        id: 'OBL-06',
        type: 'Mandatória',
        subcategory: 'Normas Educacionais',
        source: 'LDB (Lei 9.394/96)',
        area: 'Pedagógico',
        date: 'Contínuo',
        status: 'Conforme',
      },
      {
        id: 'OBL-07',
        type: 'Mandatória',
        subcategory: 'Proteção Integral da Criança',
        source: 'ECA (Lei 8.069/90)',
        area: 'Equipe Multidisciplinar',
        date: 'Contínuo',
        status: 'Conforme',
      },
    ])

    toast({
      title: 'Biblioteca OSC Carregada',
      description:
        'As obrigações específicas para o setor educacional foram adicionadas ao inventário.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">Obrigações de Compliance</h3>
          <p className="text-sm text-muted-foreground">
            Inventário de leis, regulações e normas voluntárias aplicáveis.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {(isOSC || isEducacional) && (
            <Button
              variant="outline"
              onClick={loadOSCObligations}
              className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              <BookOpen className="mr-2 h-4 w-4" /> Biblioteca OSC
            </Button>
          )}
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Matriz
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Obrigação
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="mandatory">Mandatórias (Leis/Reg)</TabsTrigger>
          <TabsTrigger value="voluntary">Voluntárias (Normas)</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="m-0">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Fonte / Norma</TableHead>
                  <TableHead>Subcategoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Área Responsável</TableHead>
                  <TableHead>Status SGC</TableHead>
                  <TableHead className="text-right">Ações Transversais</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {obsData.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {o.id}
                    </TableCell>
                    <TableCell className="font-medium">{o.source}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{o.subcategory}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          o.type === 'Mandatória'
                            ? 'border-red-200 text-red-700 bg-red-50'
                            : 'border-blue-200 text-blue-700 bg-blue-50'
                        }
                      >
                        {o.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{o.area}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          o.status === 'Conforme'
                            ? 'bg-success hover:bg-success/80 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        }
                      >
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`${tenantPath}/clause/4.6`)}>
                            <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                            Avaliar Risco Associado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`${tenantPath}/clause/10.2`)}>
                            <LinkIcon className="mr-2 h-4 w-4 text-blue-500" />
                            Plano de Ação (NC)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
