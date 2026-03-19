import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { maskCurrency } from '@/lib/formatters'

export function Step5({ data, updateData }: { data: any; updateData: (d: any) => void }) {
  const setField = (k: string, v: any) => updateData({ ...data, [k]: v })
  const history = data.contract_history || []

  const addHistory = () =>
    setField('contract_history', [
      ...history,
      { year: new Date().getFullYear().toString(), contracts: '', value: '', revenue_percent: '' },
    ])
  const removeHistory = (idx: number) =>
    setField(
      'contract_history',
      history.filter((_: any, i: number) => i !== idx),
    )
  const updateHist = (idx: number, k: string, v: string) => {
    const newHist = [...history]
    newHist[idx][k] = v
    setField('contract_history', newHist)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Switch
            checked={data.is_regulated || false}
            onCheckedChange={(v) => setField('is_regulated', v)}
            id="regulated"
          />
          <Label htmlFor="regulated" className="cursor-pointer">
            A empresa exerce atividade estritamente regulamentada?
          </Label>
        </div>
        {data.is_regulated && (
          <div className="mt-2 animate-in fade-in">
            <Label>Entidade Reguladora (Ex: ANVISA, BACEN, ANEEL)</Label>
            <Input
              value={data.regulating_entity || ''}
              onChange={(e) => setField('regulating_entity', e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="space-y-2 border p-4 rounded-md">
        <Label>Licenças e Alvarás Governamentais Requeridos para Operação</Label>
        <Textarea
          placeholder="Liste as principais licenças e os respectivos órgãos emissores..."
          value={data.required_licenses || ''}
          onChange={(e) => setField('required_licenses', e.target.value)}
        />
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex justify-between items-center">
          <Label className="text-base">Histórico de Contratos Públicos (Últimos 3 anos)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addHistory}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar Ano
          </Button>
        </div>
        <div className="space-y-2">
          {history.map((h: any, i: number) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-muted/20 p-3 rounded-md"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1 w-full">
                <Input
                  placeholder="Ano (Ex: 2023)"
                  value={h.year}
                  onChange={(e) => updateHist(i, 'year', e.target.value)}
                />
                <Input
                  placeholder="Qtd. Contratos"
                  type="number"
                  value={h.contracts}
                  onChange={(e) => updateHist(i, 'contracts', e.target.value)}
                />
                <Input
                  placeholder="Valor Total (R$)"
                  value={h.value}
                  onChange={(e) => updateHist(i, 'value', maskCurrency(e.target.value))}
                />
                <Input
                  placeholder="% Faturamento"
                  type="number"
                  value={h.revenue_percent}
                  onChange={(e) => updateHist(i, 'revenue_percent', e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeHistory(i)}
                className="self-end md:self-auto"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Nenhum histórico adicionado.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Switch
            checked={data.uses_intermediaries || false}
            onCheckedChange={(v) => setField('uses_intermediaries', v)}
            id="intermediaries"
          />
          <Label htmlFor="intermediaries" className="cursor-pointer">
            Utiliza intermediários, agentes ou despachantes na relação com o poder público?
          </Label>
        </div>
        {data.uses_intermediaries && (
          <div className="mt-2 animate-in fade-in">
            <Label>
              Frequência e Situações (Ex: Licitações, Desembaraço Aduaneiro, Licenças ambientais)
            </Label>
            <Textarea
              value={data.intermediaries_details || ''}
              onChange={(e) => setField('intermediaries_details', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
