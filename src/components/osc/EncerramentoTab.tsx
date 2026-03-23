import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PackageOpen, FileCheck, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function EncerramentoTab({ partnership }: any) {
  const [assets, setAssets] = useState<any[]>([])

  useEffect(() => {
    const fetchAssets = async () => {
      const { data } = await supabase
        .from('osc_partnership_assets' as any)
        .select('*')
        .eq('partnership_id', partnership.id)
      if (data) setAssets(data)
    }
    fetchAssets()
  }, [partnership.id])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-amber-50/50 p-4 rounded-lg border border-amber-100">
        <div>
          <h3 className="font-semibold text-amber-900 flex items-center">
            <PackageOpen className="h-5 w-5 mr-2 text-amber-600" />
            Bens Remanescentes e Encerramento (Bloco 8)
          </h3>
          <p className="text-sm text-amber-800 mt-1 max-w-2xl">
            Controle de destinação final de bens patrimoniais, tratamento de saldos remanescentes e
            emissão do termo de encerramento, garantindo conformidade com o instrumento pactuado.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Bens Remanescentes</CardTitle>
            <CardDescription>
              Equipamentos e materiais permanentes adquiridos com recursos da parceria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assets.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50">
                <PackageOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhum bem permanente registrado.</p>
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
                      Tratar
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" className="w-full mt-4 border-dashed">
              + Registrar Bem Permanente
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Tratamento de Saldos</CardTitle>
              <CardDescription>
                Apuração e devolução de saldo final na conta específica.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-5 bg-slate-50 border rounded-lg text-center">
                <span className="text-sm font-medium text-slate-500 block mb-1">
                  Saldo Atual Remanescente Projetado
                </span>
                <span className="text-3xl font-bold text-slate-800">R$ 0,00</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Todo saldo remanescente, incluindo rendimentos de aplicação financeira, deve ser
                obrigatoriamente devolvido ao ente parceiro para o encerramento formal.
              </p>
              <Button variant="secondary" className="w-full">
                Registrar Comprovante de Devolução (GRU/Guia)
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-emerald-100 bg-emerald-50/30">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-emerald-900 flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-emerald-600" />
                  Termo de Encerramento
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Habilitado após saneamento de bens, saldos e diligências finais.
                </p>
              </div>
              <Button disabled className="bg-emerald-600 opacity-50">
                Gerar <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
