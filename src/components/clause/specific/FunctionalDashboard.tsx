import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  UserCheck,
  FileText,
  Handshake,
  GraduationCap,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  Building,
  Scale,
  MessageSquareWarning,
  Gavel,
  Wrench,
} from 'lucide-react'

const functionalAreas = [
  {
    title: 'Liderança',
    icon: UserCheck,
    m1: 'Pauta Cumprida',
    v1: '85%',
    m2: 'Orçamento',
    v2: '100%',
  },
  {
    title: 'Padrões de Conduta',
    icon: FileText,
    m1: 'Docs no prazo',
    v1: '92%',
    m2: 'Aceite Público',
    v2: '98%',
  },
  {
    title: 'Terceiros',
    icon: Handshake,
    m1: 'Aceite Críticos',
    v1: '100%',
    m2: 'Cláusulas Contratos',
    v2: '95%',
  },
  {
    title: 'Treinamento',
    icon: GraduationCap,
    m1: 'Conclusão Geral',
    v1: '88%',
    m2: 'Adesão Filiais',
    v2: '91%',
  },
  {
    title: 'Gestão de Riscos',
    icon: AlertTriangle,
    m1: 'Avaliados no prazo',
    v1: '100%',
    m2: 'Var. Residual',
    v2: '-45%',
  },
  {
    title: 'Registros Contábeis',
    icon: BookOpen,
    m1: 'Trilhas Testadas',
    v1: '12',
    m2: 'Inconsistências',
    v2: '0',
  },
  {
    title: 'Controles Internos',
    icon: ShieldCheck,
    m1: 'Cobertura de Testes',
    v1: '75%',
    m2: 'Taxa de Falha',
    v2: '2%',
  },
  {
    title: 'Setor Público',
    icon: Building,
    m1: 'Processos Monitor.',
    v1: '8',
    m2: 'Checklists OK',
    v2: '100%',
  },
  {
    title: 'Instância Compliance',
    icon: Scale,
    m1: 'Nível Autonomia',
    v1: 'Alto',
    m2: 'T. Resposta',
    v2: '48h',
  },
  {
    title: 'Canal Denúncias',
    icon: MessageSquareWarning,
    m1: 'Relatos Abertos',
    v1: '3',
    m2: 'Procedência',
    v2: '40%',
  },
  {
    title: 'Medidas Disciplinares',
    icon: Gavel,
    m1: 'Advertências Mês',
    v1: '2',
    m2: 'Reincidência',
    v2: '0%',
  },
  {
    title: 'Remediação',
    icon: Wrench,
    m1: 'SLA Resposta',
    v1: '5 dias',
    m2: 'Planos Implem.',
    v2: '100%',
  },
]

export function FunctionalDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Sistema de Gestão (Tradução Funcional)</h3>
          <p className="text-sm text-muted-foreground">
            Visão holística dos pilares estruturais do compliance.
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {functionalAreas.map((area, idx) => {
          const Icon = area.icon
          return (
            <Card key={idx} className="hover:border-primary/40 transition-colors shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-4 px-4">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-sm font-semibold leading-tight">{area.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{area.m1}</span>
                    <span className="font-medium text-foreground">{area.v1}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{area.m2}</span>
                    <span className="font-medium text-foreground">{area.v2}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
