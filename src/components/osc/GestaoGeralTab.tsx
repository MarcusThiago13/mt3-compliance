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
import { Loader2, Save, Map, CalendarClock } from 'lucide-react'

export default function GestaoGeralTab({ partnership, onUpdate }: any) {
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
      toast({ title: 'Sucesso', description: 'Dados gerais da parceria atualizados.' })
      onUpdate()
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
        <Map className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-900">Gestão Geral da Parceria (Bloco 5)</h4>
          <p className="text-sm text-blue-800 mt-1">
            Este é o núcleo gerencial. Ele concentra o instrumento jurídico, as vigências e o cronograma macro.
            Mantenha-o atualizado para garantir o alinhamento com a Prestação de Contas e Transparência.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Dados do Instrumento</CardTitle>
            <CardDescription>
              Informações formais do Termo de Fomento, Colaboração ou Acordo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Objeto da Parceria</Label>
              <Input
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ente Público Parceiro</Label>
                <Input
                  value={data.public_entity}
                  onChange={(e) => setData({ ...data, public_entity: e.target.value })}
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
                <Label>Fase / Status Atual</Label>
                <Select value={data.status} onValueChange={(v) => setData({ ...data, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planejamento">Planejamento e Elaboração</SelectItem>
                    <SelectItem value="Chamamento">Habilitação / Chamamento</SelectItem>
                    <SelectItem value="Celebração">Aprovação e Celebração</SelectItem>
                    <SelectItem value="Execução">Em Execução</SelectItem>
                    <SelectItem value="Prestação de Contas">Em Prestação de Contas</SelectItem>
                    <SelectItem value="Encerrado">Encerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor Global Pactuado (R$)</Label>
                <Input
                  type="number"
                  value={data.value}
                  onChange={(e) => setData({ ...data, value: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Início da Vigência</Label>
                <Input
                  type="date"
                  value={data.start_date}
                  onChange={(e) => setData({ ...data, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fim da Vigência</Label>
                <Input
                  type="date"
                  value={data.end_date}
                  onChange={(e) => setData({ ...data, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t mt-6">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
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

        <Card className="shadow-sm border-slate-200 h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CalendarClock className="w-5 h-5 mr-2 text-slate-500" /> Linha do Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-4">
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-slate-400 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                <p className="text-sm font-semibold text-slate-800">Criação do Registro</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(partnership.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="relative pl-6">
                <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ring-4 ring-white ${data.start_date ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <p className={`text-sm font-semibold ${data.start_date ? 'text-slate-800' : 'text-slate-400'}`}>Início da Vigência</p>
                <p className="text-xs text-muted-foreground">
                  {data.start_date ? new Date(data.start_date).toLocaleDateString('pt-BR') : 'Pendente'}
                </p>
              </div>
              <div className="relative pl-6">
                <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ring-4 ring-white ${data.end_date ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                <p className={`text-sm font-semibold ${data.end_date ? 'text-slate-800' : 'text-slate-400'}`}>Término da Vigência</p>
                <p className="text-xs text-muted-foreground">
                  {data.end_date ? new Date(data.end_date).toLocaleDateString('pt-BR') : 'Pendente'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
