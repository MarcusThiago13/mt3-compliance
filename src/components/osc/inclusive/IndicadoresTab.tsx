import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Activity,
  Bell,
  Clock,
  Target,
  CheckCircle2,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'
import { cn } from '@/lib/utils'

// Mock Data
const peiStatusData = [
  { name: 'Não Iniciado', value: 5 },
  { name: 'Em Andamento', value: 25 },
  { name: 'Atingido', value: 12 },
  { name: 'Revisão Necessária', value: 3 },
]

const COLORS = ['#94a3b8', '#3b82f6', '#10b981', '#f59e0b']

const logAderenciaData = [
  { month: 'Ago', aderencia: 75 },
  { month: 'Set', aderencia: 82 },
  { month: 'Out', aderencia: 88 },
  { month: 'Nov', aderencia: 95 },
  { month: 'Dez', aderencia: 92 },
]

const chartConfig = {
  aderencia: {
    label: 'Aderência ao PEI (%)',
    color: 'hsl(var(--primary))',
  },
  value: {
    label: 'Quantidade',
    color: 'hsl(var(--primary))',
  },
}

const alertasProatividade = [
  {
    id: 1,
    student: 'João Pedro Silva',
    unit: 'EMEF Prof. Marcos',
    diasSemRegistro: 12,
    tipo: 'Hiato de Registro Operacional',
    gravidade: 'alta',
  },
  {
    id: 2,
    student: 'Maria Clara Souza',
    unit: 'CMEI Esperança',
    diasSemRegistro: 8,
    tipo: 'Hiato de Registro Operacional',
    gravidade: 'media',
  },
  {
    id: 3,
    student: 'Lucas Fernandes',
    unit: 'EMEF Prof. Marcos',
    diasSemRegistro: 5,
    tipo: 'PAEE Próximo da Revisão',
    gravidade: 'baixa',
  },
]

export function IndicadoresTab({ tenantId }: { tenantId: string }) {
  const alertasCriticos = alertasProatividade.filter((a) => a.gravidade === 'alta').length

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center">
            <Activity className="h-6 w-6 mr-2 text-blue-600" /> Dashboards Pedagógicos & Saúde do
            Programa
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Métricas de evolução dos estudantes (PAEE/PEI) e monitoramento proativo de engajamento
            da equipe.
          </p>
        </div>
      </div>

      {alertasCriticos > 0 && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800 font-bold">
            Alertas de Proatividade (Watchdog)
          </AlertTitle>
          <AlertDescription className="text-red-700">
            Atenção: Há {alertasCriticos} estudante(s) com hiato prolongado sem registros
            operacionais ou pendências críticas no planejamento. Ação da coordenação é requerida.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-emerald-100 bg-emerald-50/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-emerald-800 uppercase mb-1">
                  Cobertura de PEI
                </p>
                <h3 className="text-3xl font-bold text-emerald-700">100%</h3>
              </div>
              <Target className="h-8 w-8 text-emerald-200" />
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> Meta atingida para casos ativos
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-100 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-blue-800 uppercase mb-1">
                  Aderência Média
                </p>
                <h3 className="text-3xl font-bold text-blue-700">92%</h3>
              </div>
              <Activity className="h-8 w-8 text-blue-200" />
            </div>
            <p className="text-xs text-blue-600 mt-2">Registros aderentes ao PAEE</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-amber-100 bg-amber-50/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-amber-800 uppercase mb-1">Pendências</p>
                <h3 className="text-3xl font-bold text-amber-700">{alertasProatividade.length}</h3>
              </div>
              <Bell className="h-8 w-8 text-amber-200" />
            </div>
            <p className="text-xs text-amber-600 mt-2">Alertas de monitoramento ativos</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase mb-1">Casos Ativos</p>
                <h3 className="text-3xl font-bold text-slate-800">14</h3>
              </div>
              <BarChart3 className="h-8 w-8 text-slate-200" />
            </div>
            <p className="text-xs text-slate-500 mt-2">Mapeados e em acompanhamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Status das Metas (PEI)</CardTitle>
            <CardDescription>Distribuição atual da evolução pedagógica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={peiStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {peiStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {peiStatusData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center text-xs text-slate-600">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Evolução de Aderência Operacional</CardTitle>
            <CardDescription>
              Percentual de registros diários alinhados às estratégias do PAEE
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart
                data={logAderenciaData}
                margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="aderencia" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-red-100">
        <CardHeader className="bg-red-50/50 border-b border-red-100 pb-4">
          <CardTitle className="text-lg text-red-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-red-600" /> Acompanhamento de Gaps Operacionais
          </CardTitle>
          <CardDescription className="text-red-700/80">
            Estudantes com ausência prolongada de registros de apoio escolar ou equipe técnica.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-red-100">
            {alertasProatividade.map((alerta) => (
              <div
                key={alerta.id}
                className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-slate-800">{alerta.student}</h4>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {alerta.unit} • <span className="text-slate-700">{alerta.tipo}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700">
                      {alerta.diasSemRegistro} dias
                    </p>
                    <p className="text-xs text-slate-500">sem registro</p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border',
                      alerta.gravidade === 'alta'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : alerta.gravidade === 'media'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200',
                    )}
                  >
                    {alerta.gravidade === 'alta'
                      ? 'Urgente'
                      : alerta.gravidade === 'media'
                        ? 'Atenção'
                        : 'Observar'}
                  </span>
                </div>
              </div>
            ))}
            {alertasProatividade.length === 0 && (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                <p>Nenhum alerta de proatividade no momento.</p>
                <p className="text-sm">Todos os estudantes estão com acompanhamento em dia.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
