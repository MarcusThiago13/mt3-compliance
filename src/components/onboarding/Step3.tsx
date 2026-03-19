import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, UploadCloud, Loader2 } from 'lucide-react'
import { uploadDocument } from '@/lib/upload'

export function Step3({ data, updateData }: { data: any; updateData: (d: any) => void }) {
  const setField = (k: string, v: any) => updateData({ ...data, [k]: v })
  const equity = data.equity_participations || []
  const majv = data.ma_jv_details || []
  const [uploading, setUploading] = useState(false)

  const addEquity = () =>
    setField('equity_participations', [...equity, { company: '', percentage: '' }])
  const removeEquity = (idx: number) =>
    setField(
      'equity_participations',
      equity.filter((_: any, i: number) => i !== idx),
    )
  const updateEq = (idx: number, k: string, v: string) => {
    const newEq = [...equity]
    newEq[idx][k] = v
    setField('equity_participations', newEq)
  }

  const addMajv = () => setField('ma_jv_details', [...majv, { type: '', reason_social: '' }])
  const removeMajv = (idx: number) =>
    setField(
      'ma_jv_details',
      majv.filter((_: any, i: number) => i !== idx),
    )
  const updateMajv = (idx: number, k: string, v: string) => {
    const newMajv = [...majv]
    newMajv[idx][k] = v
    setField('ma_jv_details', newMajv)
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    setUploading(true)
    const path = await uploadDocument(e.target.files[0])
    if (path) setField('group_organograma_url', path)
    setUploading(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base">Participações Societárias</Label>
          <Button type="button" variant="outline" size="sm" onClick={addEquity}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar
          </Button>
        </div>
        {equity.map((eq: any, i: number) => (
          <div key={i} className="flex gap-2 items-center bg-muted/20 border p-2 rounded-md">
            <Input
              placeholder="Nome da Empresa"
              value={eq.company}
              onChange={(e) => updateEq(i, 'company', e.target.value)}
            />
            <Input
              placeholder="%"
              type="number"
              min="0"
              max="100"
              className="w-24 text-center"
              value={eq.percentage}
              onChange={(e) => updateEq(i, 'percentage', e.target.value)}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeEquity(i)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {equity.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Sem participações registradas.
          </p>
        )}
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Switch
            checked={data.is_economic_group || false}
            onCheckedChange={(v) => setField('is_economic_group', v)}
            id="eco-group"
          />
          <Label htmlFor="eco-group" className="cursor-pointer">
            A organização faz parte de um Grupo Econômico?
          </Label>
        </div>
        {data.is_economic_group && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 animate-in fade-in">
            <div className="space-y-2">
              <Label>Organograma do Grupo</Label>
              <div className="flex items-center gap-2">
                <Input type="file" onChange={handleFile} disabled={uploading} />
                {uploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {data.group_organograma_url && !uploading && (
                  <span className="text-xs font-medium text-success flex items-center shrink-0">
                    <UploadCloud className="w-4 h-4 mr-1" /> Salvo
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Países de Operação do Grupo</Label>
              <Input
                value={data.group_countries || ''}
                onChange={(e) => setField('group_countries', e.target.value)}
                placeholder="Ex: Brasil, Argentina, EUA"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Switch
            checked={data.has_ma_jv || false}
            onCheckedChange={(v) => setField('has_ma_jv', v)}
            id="ma-jv"
          />
          <Label htmlFor="ma-jv" className="cursor-pointer">
            Houve operações recentes de Fusões, Aquisições ou Joint Ventures?
          </Label>
        </div>
        {data.has_ma_jv && (
          <div className="space-y-3 mt-2 animate-in fade-in">
            <Button type="button" variant="outline" size="sm" onClick={addMajv}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar Operação
            </Button>
            {majv.map((op: any, i: number) => (
              <div key={i} className="flex gap-2 items-center bg-muted/20 p-2 rounded-md">
                <Input
                  placeholder="Tipo (ex: Fusão, Aquisição, JV)"
                  value={op.type}
                  onChange={(e) => updateMajv(i, 'type', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Razão Social da Outra Parte"
                  value={op.reason_social}
                  onChange={(e) => updateMajv(i, 'reason_social', e.target.value)}
                  className="flex-[2]"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeMajv(i)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
