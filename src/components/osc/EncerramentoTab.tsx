import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PackageOpen, FileCheck, DollarSign, CheckSquare, ShieldAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function EncerramentoTab({ partnership }: any) {
  const [assets, setAssets] = useState<any[]>([])

  useEffect(() => {
    // In a real scenario, this would query osc_partnership_assets
  }, [partnership.id])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-amber-50/50 p-4 rounded-lg border border-amber-100">
        <div>
          <h3 className="font-semibold text-amber-900 flex items-center">
            <PackageOpen className="h-5 w-5 mr-2 text-amber-600" />
            Bens, Saldos e Encerramento (Blocos 8 e 9)
          </h3>
          <p className="text-sm text-amber-800 mt-1 max-w-2xl">
            A parceria só atinge o status formal de 'Encerrada' quando o saldo bancário for
            devolvido e todos os bens permanentes tiverem sua destinação registrada e aprovada.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Destinação de Bens Permanentes (B8)</CardTitle>
            <CardDescription>
              Materiais e equipamentos adquiridos com recursos repassados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50">
                <PackageOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhum bem permanente registrado nesta parceria.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium text-sm">{asset.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Destinação: {asset.destination || 'Pendente'}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Tratar Destinação
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" className="w-full mt-4 border-dashed bg-slate-50">
              + Registrar Bem e Definir Destinação
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-slate-500" /> Devolução de Saldos
                Remanescentes
              </CardTitle>
              <CardDescription>Obrigatoriedade de emissão de guia de recolhimento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-5 bg-slate-50 border rounded-lg text-center flex flex-col items-center">
                <span className="text-sm font-medium text-slate-500 block mb-1">
                  Saldo Final Projetado (Conta Específica)
                </span>
                <span className="text-3xl font-bold text-slate-800">R$ 0,00</span>
                <Badge
                  variant="outline"
                  className="mt-2 text-emerald-600 bg-emerald-50 border-emerald-200"
                >
                  Integrado e Zerado
                </Badge>
              </div>
              <Button variant="secondary" className="w-full">
                Anexar Comprovante de Devolução (GRU/DAM)
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-amber-100 bg-amber-50/30">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-amber-900 flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-amber-600" />
                    Encerramento Formal da Parceria (B9)
                  </h4>
                  <p className="text-xs text-amber-800 mt-1">
                    Checklist de requisitos impeditivos para encerramento.
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4 bg-white p-3 rounded-md border border-amber-200/50 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" /> Integração Prestação
                  de Contas (Aprovada)
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" /> Destinação de todos os
                  bens resolvida
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" /> Saldo financeiro
                  devolvido / zerado
                </div>
              </div>

              <Button
                disabled
                className="w-full bg-amber-600 hover:bg-amber-700 opacity-50 text-white"
              >
                Emitir Relatório Final de Encerramento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
