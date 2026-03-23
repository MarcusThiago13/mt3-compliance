import { Users, GraduationCap, Network } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const team = [
  { name: 'Ana Paula', role: 'Psicóloga', registry: 'CRP 12345/SP', status: 'Ativo' },
  { name: 'Julia Martins', role: 'Professora AEE', registry: 'CBO 123', status: 'Ativo' },
  { name: 'Roberto Carlos', role: 'Assistente Social', registry: 'CRESS 9876', status: 'Ativo' },
]

const trainings = [
  { title: 'Capacitação em PEI', date: '15/02/2026', hours: '4h', coverage: '100%' },
  { title: 'Protocolos de Proteção Integral', date: '20/01/2026', hours: '8h', coverage: '85%' },
]

export function EquipeTab({ tenantId }: { tenantId?: string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-blue-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" /> Equipe Multiprofissional
          </CardTitle>
          <CardDescription>Cadastro de especialistas e profissionais de apoio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {team.map((t, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 bg-slate-50 border rounded-md"
            >
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.role} • {t.registry}
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                {t.status}
              </Badge>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            Gerenciar Equipe
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" /> Formação Continuada
            </CardTitle>
            <CardDescription>Trilhas formativas obrigatórias para a equipe.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainings.map((t, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-slate-50 border rounded-md"
              >
                <div>
                  <p className="font-semibold text-sm">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.date} • Carga: {t.hours}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-blue-700">Adesão: {t.coverage}</p>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Ver Matriz de Treinamentos
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-sm bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Network className="h-5 w-5 text-blue-600" /> Articulação Intersetorial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Registro de encaminhamentos para a rede de saúde (CAPS, UBS), assistência social
              (CRAS, CREAS) e Conselho Tutelar.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Registrar Encaminhamento
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
