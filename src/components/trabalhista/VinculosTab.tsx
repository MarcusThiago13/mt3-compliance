import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, FileText, CheckCircle2, AlertTriangle } from 'lucide-react'

export function VinculosTab({ tenant }: any) {
  return (
    <div className="grid gap-6 animate-in fade-in">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-primary" /> Gestão de Vínculos e Admissões
          </CardTitle>
          <CardDescription>
            Checklist documental, controle de contratos e governança de dados admissionais.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="p-5 border rounded-xl text-center bg-blue-50/50 border-blue-100 shadow-sm">
              <p className="text-3xl font-bold text-blue-700">142</p>
              <p className="text-xs text-muted-foreground uppercase font-semibold mt-1">
                Colaboradores Ativos
              </p>
            </div>
            <div className="p-5 border rounded-xl text-center bg-emerald-50/50 border-emerald-100 shadow-sm">
              <p className="text-3xl font-bold text-emerald-700">100%</p>
              <p className="text-xs text-muted-foreground uppercase font-semibold mt-1">
                ASO Admissional Válido
              </p>
            </div>
            <div className="p-5 border rounded-xl text-center bg-amber-50/50 border-amber-100 shadow-sm">
              <p className="text-3xl font-bold text-amber-700">3</p>
              <p className="text-xs text-muted-foreground uppercase font-semibold mt-1">
                Pendências Documentais
              </p>
            </div>
          </div>

          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
            Últimas Admissões (Compliance Check)
          </h4>
          <div className="space-y-3">
            {[
              {
                name: 'Ana Silva',
                role: 'Assistente Administrativa',
                date: '15/03/2026',
                status: 'ok',
              },
              {
                name: 'Carlos Roberto',
                role: 'Técnico de Suporte',
                date: '10/03/2026',
                status: 'ok',
              },
              {
                name: 'Mariana Costa',
                role: 'Analista de Projetos',
                date: '01/03/2026',
                status: 'pending',
              },
            ].map((colab, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3.5 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-md border shadow-sm">
                    <FileText className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{colab.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {colab.role} • Admissão: {colab.date}
                    </p>
                  </div>
                </div>
                {colab.status === 'ok' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" title="Dossiê Completo" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500" title="Documento Faltante" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
