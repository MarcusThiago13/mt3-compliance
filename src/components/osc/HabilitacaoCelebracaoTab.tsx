import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Upload, ShieldCheck, FileCheck } from 'lucide-react'

export default function HabilitacaoCelebracaoTab({ partnership }: any) {
  const selectionDocs = [
    { id: 1, name: 'Proposta / Plano de Trabalho Preliminar', status: 'valid' },
    { id: 2, name: 'Declaração de Ciência e Concordância', status: 'valid' },
    { id: 3, name: 'Comprovante de Inscrição no Conselho de Direito', status: 'missing' },
  ]

  const celebrationDocs = [
    { id: 4, name: 'Certidões de Regularidade Fiscal (B1)', status: 'warning' },
    { id: 5, name: 'Comprovante de Experiência Prévia', status: 'valid' },
    { id: 6, name: 'Declaração de Não Ocorrência de Impeditivos', status: 'valid' },
    { id: 7, name: 'Relação Nominal dos Dirigentes Atualizada', status: 'missing' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-lg border">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2 text-slate-500" />
            Habilitação e Celebração (Bloco 2)
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Controle da aptidão da OSC para participar de chamamentos públicos e requisitos
            pré-assinatura do instrumento.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Fase de Seleção / Proposta</CardTitle>
            <CardDescription>
              Checklist de documentos exigidos no edital de chamamento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectionDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-md bg-slate-50/50 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  {doc.status === 'valid' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300" />
                  )}
                  <span className="text-sm font-medium text-slate-800">{doc.name}</span>
                </div>
                {doc.status !== 'valid' && (
                  <Button variant="ghost" size="sm" className="h-8">
                    <Upload className="h-4 w-4 mr-2" /> Anexar
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Fase de Celebração</CardTitle>
            <CardDescription>
              Comprovação legal definitiva para assinatura (Art. 33 e 34).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mb-4 flex items-start gap-2">
              <FileCheck className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-800">
                <strong>Integração Estrutural:</strong> Certidões fiscais e cadastro de dirigentes
                são sincronizados automaticamente com a página de{' '}
                <em>Regularidade Institucional</em> da OSC.
              </div>
            </div>
            {celebrationDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-md bg-slate-50/50 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  {doc.status === 'valid' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : doc.status === 'warning' ? (
                    <Circle className="h-5 w-5 text-amber-500" fill="currentColor" />
                  ) : (
                    <Circle className="h-5 w-5 text-red-300" />
                  )}
                  <span className="text-sm font-medium text-slate-800">{doc.name}</span>
                </div>
                {doc.status !== 'valid' && (
                  <Button variant="ghost" size="sm" className="h-8 text-blue-600">
                    Verificar B1
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
