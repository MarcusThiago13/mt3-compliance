import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, GraduationCap, Clock } from 'lucide-react'

export function EquipeTab({ tenantId }: { tenantId: string }) {
  // Mock data for UI demonstration as there are no tables for team members in schema
  const team = [
    {
      name: 'Ana Paula Rocha',
      role: 'Professor(a) de AEE',
      formation: 'Especialização em Educação Especial',
      status: 'Regular',
    },
    {
      name: 'Carlos Eduardo Mendes',
      role: 'Profissional de Apoio Escolar',
      formation: 'Cursando Pedagogia',
      status: 'Em Formação Continuada',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-lg font-bold text-slate-800 flex items-center">
        <Users className="h-5 w-5 mr-2 text-blue-600" /> Equipe Multiprofissional e Formação
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-blue-600" /> Profissionais de AEE e Apoio
            </CardTitle>
            <CardDescription>Conformidade de lotação e habilitação exigida.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {team.map((t, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 border rounded bg-slate-50/50"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-800">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} • {t.formation}
                  </p>
                </div>
                <Badge
                  variant={t.status === 'Regular' ? 'default' : 'secondary'}
                  className={
                    t.status === 'Regular'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }
                >
                  {t.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" /> Carga Horária e Espaços (SRM)
            </CardTitle>
            <CardDescription>Recursos físicos e temporais alocados para o AEE.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50 text-center">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Sala de Recursos Multifuncionais (SRM)
              </p>
              <Badge className="bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-200">
                Implantada e Ativa
              </Badge>
              <p className="text-xs text-blue-700 mt-2">Atendendo no contraturno 20h semanais.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
