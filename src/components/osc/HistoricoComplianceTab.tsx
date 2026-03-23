import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { History, ShieldAlert, CheckCircle, Clock } from 'lucide-react'

export default function HistoricoComplianceTab({ partnership }: any) {
  const events = [
    {
      date: '10/01/2026',
      type: 'positive',
      title: 'Celebração e Assinatura do Termo',
      desc: 'Instrumento pactuado e publicado no diário oficial.',
    },
    {
      date: '15/05/2026',
      type: 'warning',
      title: 'Diligência da Administração Pública',
      desc: 'Atraso identificado no envio do relatório parcial de execução física (B4).',
    },
    {
      date: '20/05/2026',
      type: 'positive',
      title: 'Saneamento Concluído',
      desc: 'Relatório parcial enviado, analisado e aprovado pelo gestor da parceria.',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-lg border">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <History className="h-5 w-5 mr-2 text-slate-500" />
            Histórico Institucional e Conformidade (Bloco 10)
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Linha do tempo inalterável. Registro de notificações, aprovações, diligências e eventos
            que formam o dossiê da parceria para futuras auditorias.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" /> Trilha de Acontecimentos
          </CardTitle>
          <CardDescription>
            Ocorrências que impactam o nível de risco e compliance desta OSC.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent pt-4">
            {events.map((ev, i) => (
              <div
                key={i}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-50 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {ev.type === 'positive' ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-800 text-sm">{ev.title}</div>
                    <div className="text-xs font-mono text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                      {ev.date}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 mt-2">{ev.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
