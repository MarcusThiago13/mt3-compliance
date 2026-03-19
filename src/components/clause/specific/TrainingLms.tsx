import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle, Clock, Users } from 'lucide-react'

export function TrainingLms() {
  const trails = [
    { id: 1, title: 'Código de Conduta 2024', status: 'Ativo', enrolled: 145, completed: 120 },
    {
      id: 2,
      title: 'Prevenção à Lavagem de Dinheiro',
      status: 'Ativo',
      enrolled: 80,
      completed: 45,
    },
    {
      id: 3,
      title: 'Assédio no Ambiente de Trabalho',
      status: 'Rascunho',
      enrolled: 0,
      completed: 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Sistema de Gestão de Treinamentos (LMS)</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie trilhas, matrículas e certificados.
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground">Nova Trilha</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Colaboradores</p>
              <p className="text-2xl font-bold">145</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-full">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              <p className="text-2xl font-bold">82%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-full">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Treinamentos Pendentes</p>
              <p className="text-2xl font-bold">35</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-md">Trilhas de Aprendizado</h4>
        <div className="grid gap-4">
          {trails.map((t) => (
            <Card key={t.id} className="shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-md">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">{t.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={t.status === 'Ativo' ? 'default' : 'secondary'}
                        className={
                          t.status === 'Ativo'
                            ? 'bg-success hover:bg-success/90 text-xs'
                            : 'text-xs'
                        }
                      >
                        {t.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {t.enrolled} matriculados • {t.completed} concluídos
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Gerenciar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
