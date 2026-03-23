import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PackageOpen, FileCheck, ArrowRight, DollarSign, CheckSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'

export default function EncerramentoTab({ partnership }: any) {
  const [assets, setAssets] = useState<any[]>([])

  // using mock items for UI presentation if tables don't exist yet, but querying standard pattern
  useEffect(() => {
    // In a real scenario, this would query osc_partnership_assets
    // We handle the visual layout of Bloco 8 and Bloco 9 here as requested.
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
            Controle de destinação final de bens patrimoniais adquiridos com recursos repassados, devolução de saldos bancários remanescentes e emissão do termo de encerramento.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Bens Remanescentes (B8)</CardTitle>
            <CardDescription>
              Equipamentos e materiais permanentes vinculados ao projeto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50">
                <PackageOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhum bem permanente registrado no sistema.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium text-sm">{asset.description}</p>
                      <p className="text-xs text-muted-foreground">Destinação: {asset.destination || 'Pendente'}</p>
                    </div>
                    <Button variant="ghost" size="sm">Tratar</Button>
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
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-slate-500" /> Tratamento de Saldos
              </CardTitle>
              <CardDescription>Apuração e devolução de saldo final e rendimentos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-5 bg-slate-50 border rounded-lg text-center flex flex-col items-center">
                <span className="text-sm font-medium text-slate-500 block mb-1">Saldo Final Projetado na Conta Específica</span>
                <span className="text-3xl font-bold text-slate-800">R$ 0,00</span>
                <Badge variant="outline" className="mt-2 text-emerald-600 bg-emerald-50 border-emerald-200">Zerado</Badge>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Todo saldo remanescente deve ser obrigatoriamente devolvido ao ente parceiro via guia própria (GRU/DAM) para viabilizar o encerramento.
              </p>
              <Button variant="secondary" className="w-full">
                Anexar Comprovante de Devolução (Guia)
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-amber-100 bg-amber-50/30">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-amber-900 flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-amber-600" />
                    Encerramento da Parceria (B9)
                  </h4>
                  <p className="text-xs text-amber-800 mt-1">
                    Habilitado após saneamento de contas, bens e saldos.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                 <div className="flex items-center gap-2 text-sm text-slate-700">
                   <CheckSquare className="w-4 h-4 text-emerald-500" /> Prestações de contas julgadas regulares
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-700">
                   <CheckSquare className="w-4 h-4 text-slate-300" /> Destinação de bens resolvida
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-700">
                   <CheckSquare className="w-4 h-4 text-emerald-500" /> Saldo financeiro devolvido/zerado
                 </div>
              </div>

              <Button disabled className="w-full bg-amber-600 opacity-50">
                Gerar Termo de Encerramento Formato
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
