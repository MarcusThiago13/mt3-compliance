import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Save } from 'lucide-react'

export default function DadosGeraisTab({ partnership, onUpdate }: any) {
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    title: partnership.title || '',
    public_entity: partnership.public_entity || '',
    instrument_type: partnership.instrument_type || '',
    status: partnership.status || 'Planejamento',
    value: partnership.value || 0,
    start_date: partnership.start_date || '',
    end_date: partnership.end_date || '',
  })

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('osc_partnerships' as any)
      .update(data)
      .eq('id', partnership.id)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Dados gerais e fase da parceria atualizados.' })
      onUpdate()
    }
    setSaving(false)
  }

  return (
    <Card className="shadow-sm border-purple-100">
      <CardHeader>
        <CardTitle className="text-lg text-purple-900">Configurações Gerais da Parceria</CardTitle>
        <CardDescription>
          Mantenha os dados atualizados para refletir no portal de transparência e prestação de
          contas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label>Objeto da Parceria</Label>
            <Input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Ente Público Parceiro</Label>
            <Input
              value={data.public_entity}
              onChange={(e) => setData({ ...data, public_entity: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Fase / Status Atual</Label>
            <Select value={data.status} onValueChange={(v) => setData({ ...data, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planejamento">Planejamento e Elaboração</SelectItem>
                <SelectItem value="Chamamento">Em Chamamento Público</SelectItem>
                <SelectItem value="Celebração">Aprovação e Celebração</SelectItem>
                <SelectItem value="Execução">Em Execução</SelectItem>
                <SelectItem value="Prestação de Contas">Em Prestação de Contas</SelectItem>
                <SelectItem value="Encerrado">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Valor Global (R$)</Label>
            <Input
              type="number"
              value={data.value}
              onChange={(e) => setData({ ...data, value: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo de Instrumento</Label>
            <Select
              value={data.instrument_type}
              onValueChange={(v) => setData({ ...data, instrument_type: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Termo de Fomento">Termo de Fomento</SelectItem>
                <SelectItem value="Termo de Colaboração">Termo de Colaboração</SelectItem>
                <SelectItem value="Acordo de Cooperação">Acordo de Cooperação</SelectItem>
                <SelectItem value="Contrato de Gestão">Contrato de Gestão</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Data de Início (Celebração)</Label>
            <Input
              type="date"
              value={data.start_date}
              onChange={(e) => setData({ ...data, start_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Data de Fim (Vigência)</Label>
            <Input
              type="date"
              value={data.end_date}
              onChange={(e) => setData({ ...data, end_date: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Modificações
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
