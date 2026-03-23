import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Save, Info } from 'lucide-react'

export default function GestaoGeralTab({ partnership, onUpdate }: any) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: partnership.title || '',
    public_entity: partnership.public_entity || '',
    instrument_type: partnership.instrument_type || '',
    instrument_number: partnership.instrument_number || '',
    process_number: partnership.process_number || '',
    start_date: partnership.start_date || '',
    end_date: partnership.end_date || '',
    value: partnership.value || 0,
    object_description: partnership.object_description || '',
    status: partnership.status || 'Planejamento',
  })

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('osc_partnerships' as any)
      .update(formData)
      .eq('id', partnership.id)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Dados gerais atualizados.' })
      if (onUpdate) onUpdate()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-lg border">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Info className="h-5 w-5 mr-2 text-slate-500" />
            Dados Institucionais da Parceria (Bloco 5)
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Centro de informações jurídicas e gerenciais do instrumento pactuado. As informações
            aqui estruturam a prestação de contas.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Informações do Instrumento</CardTitle>
          <CardDescription>Mantenha os dados contratuais sempre atualizados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Objeto da Parceria / Título</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Ente Público Parceiro</Label>
              <Input
                value={formData.public_entity}
                onChange={(e) => setFormData({ ...formData, public_entity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Instrumento</Label>
              <Select
                value={formData.instrument_type}
                onValueChange={(v) => setFormData({ ...formData, instrument_type: v })}
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
              <Label>Número do Instrumento</Label>
              <Input
                value={formData.instrument_number}
                onChange={(e) => setFormData({ ...formData, instrument_number: e.target.value })}
                placeholder="Ex: 01/2026"
              />
            </div>
            <div className="space-y-2">
              <Label>Número do Processo Administrativo</Label>
              <Input
                value={formData.process_number}
                onChange={(e) => setFormData({ ...formData, process_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor Total (R$)</Label>
              <Input
                type="number"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Início (Vigência)</Label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Término (Vigência)</Label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Fase Geral da Parceria</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planejamento">Planejamento e Elaboração</SelectItem>
                  <SelectItem value="Chamamento">Chamamento Público</SelectItem>
                  <SelectItem value="Celebração">Celebração de Termo</SelectItem>
                  <SelectItem value="Execução">Execução do Objeto</SelectItem>
                  <SelectItem value="Prestação de Contas">
                    Aguardando Aprovação de Contas
                  </SelectItem>
                  <SelectItem value="Encerrado">Encerrado / Baixado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Descrição Detalhada do Objeto</Label>
              <Textarea
                rows={4}
                value={formData.object_description}
                onChange={(e) => setFormData({ ...formData, object_description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Dados Gerais
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
