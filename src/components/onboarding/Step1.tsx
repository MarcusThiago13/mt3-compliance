import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { maskCNPJ, maskCurrency } from '@/lib/formatters'

export function Step1({ data, updateData }: { data: any; updateData: (d: any) => void }) {
  const setField = (k: string, v: any) => updateData({ ...data, [k]: v })

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Razão Social *</Label>
          <Input
            value={data.razao_social || ''}
            onChange={(e) => setField('razao_social', e.target.value)}
            placeholder="Ex: Acme Ltda"
          />
        </div>
        <div className="space-y-2">
          <Label>CNPJ *</Label>
          <Input
            value={data.cnpj || ''}
            onChange={(e) => setField('cnpj', maskCNPJ(e.target.value))}
            placeholder="00.000.000/0000-00"
            maxLength={18}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Endereço Completo</Label>
        <Input
          value={data.address || ''}
          onChange={(e) => setField('address', e.target.value)}
          placeholder="Rua, Número, Bairro, Cidade - UF"
        />
      </div>
      <div className="flex items-center space-x-2 border p-3 rounded-md">
        <Switch
          checked={data.is_me_epp || false}
          onCheckedChange={(v) => setField('is_me_epp', v)}
          id="me-epp"
        />
        <Label htmlFor="me-epp" className="cursor-pointer">
          Classificada como Microempresa (ME) ou EPP (LC 123/2016)?
        </Label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Faturamento Anual Bruto</Label>
          <Input
            value={data.gross_revenue || ''}
            onChange={(e) => setField('gross_revenue', maskCurrency(e.target.value))}
            placeholder="R$ 0,00"
          />
        </div>
        <div className="space-y-2">
          <Label>Setores de Mercado</Label>
          <Input
            value={data.market_sectors || ''}
            onChange={(e) => setField('market_sectors', e.target.value)}
            placeholder="Ex: Financeiro, Construção Civil"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Principais Atividades</Label>
          <Textarea
            value={data.principal_activities || ''}
            onChange={(e) => setField('principal_activities', e.target.value)}
            placeholder="Descreva as atividades fim..."
          />
        </div>
        <div className="space-y-2">
          <Label>Locais de Operação</Label>
          <Textarea
            value={data.locations || ''}
            onChange={(e) => setField('locations', e.target.value)}
            placeholder="Estados ou Países de atuação..."
          />
        </div>
      </div>
      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Switch
            checked={data.is_publicly_traded || false}
            onCheckedChange={(v) => setField('is_publicly_traded', v)}
            id="publicly-traded"
          />
          <Label htmlFor="publicly-traded" className="cursor-pointer">
            Empresa de Capital Aberto?
          </Label>
        </div>
        {data.is_publicly_traded && (
          <div className="space-y-2 pt-2 animate-in fade-in">
            <Label>Bolsa de Valores / Ambiente de Negociação *</Label>
            <Input
              value={data.stock_exchange || ''}
              onChange={(e) => setField('stock_exchange', e.target.value)}
              placeholder="Ex: B3, NYSE"
            />
          </div>
        )}
      </div>
    </div>
  )
}
