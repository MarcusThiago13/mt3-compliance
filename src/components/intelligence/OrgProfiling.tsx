import { Save, Scale, Database, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { createBatchRequest } from '@/lib/anthropic'

export function OrgProfiling() {
  const [report, setReport] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [useSonnet, setUseSonnet] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const saveProfile = () => {
    toast({
      title: 'Perfil Salvo',
      description: 'Parâmetros de proporcionalidade atualizados para análise.',
    })
  }

  const handleBatchReport = async () => {
    setIsGenerating(true)
    setIsDialogOpen(true)
    const prompt = `Gere um Relatório de Perfil de Integridade consolidando os dados da organização e mapeie de acordo com os eixos exigidos pelo Decreto 11.129/22.`
    const response = await createBatchRequest(prompt, useSonnet)
    setReport(response)
    setIsGenerating(false)
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Perfil da Organização (Art. 56)</CardTitle>
            <CardDescription>
              Critérios que balizam a calibração e a proporcionalidade das exigências do programa de
              integridade.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>I. Porte (Empregados)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Até 99 (Pequena)</SelectItem>
                    <SelectItem value="medium">100 a 499 (Média)</SelectItem>
                    <SelectItem value="large">Mais de 500 (Grande)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>II. Complexidade Hierárquica</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta (Múltiplas diretorias)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>III. Agentes Intermediários</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">
                      Uso intensivo de despachantes/representantes
                    </SelectItem>
                    <SelectItem value="no">Uso baixo ou nulo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>IV. Setor de Mercado</Label>
                <Input placeholder="Ex: Tecnologia, Engenharia, Saúde..." />
              </div>
              <div className="space-y-2">
                <Label>V. Atuação Internacional</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national">Apenas Nacional</SelectItem>
                    <SelectItem value="latam">América Latina</SelectItem>
                    <SelectItem value="global">Global (Múltiplas jurisdições)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>VI. Interação com Setor Público</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa (Apenas licenças padrão)</SelectItem>
                    <SelectItem value="medium">Média (Fornecimento ocasional)</SelectItem>
                    <SelectItem value="high">Alta (Contratos frequentes/Concessões)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>VII. Quantidade de PJs no Grupo</Label>
                <Input type="number" placeholder="Ex: 1" />
              </div>
              <div className="space-y-2">
                <Label>VIII. Qualificação de Parceiros</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low_risk">Baixo Risco (Serviços Gerais)</SelectItem>
                    <SelectItem value="high_risk">Alto Risco (Despachantes, Gov)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="pt-4 border-t mt-4 flex justify-end">
              <Button onClick={saveProfile}>
                <Save className="mr-2 h-4 w-4" /> Salvar Definições
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20 sticky top-6">
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2 text-primary">
              <Scale className="h-5 w-5" /> Proporcionalidade Aplicada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Defina o perfil da organização acima para que a Inteligência Artificial possa calibrar
              as exigências do programa de compliance e sugerir o grau de rigor adequado.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-2 text-purple-800">
              <Database className="h-5 w-5" /> Relatório Consolidado (AI)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Gere um relatório abrangente processado em lote (Batch API) com 50% de redução de
              custo, utilizando o Claude.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Switch id="sonnet-batch" checked={useSonnet} onCheckedChange={setUseSonnet} />
                <Label htmlFor="sonnet-batch" className="text-xs cursor-pointer">
                  Usar Sonnet (Análise Profunda)
                </Label>
              </div>
              <Button
                onClick={handleBatchReport}
                className="bg-purple-600 hover:bg-purple-700 w-full text-white"
              >
                <Database className="mr-2 h-4 w-4" /> Relatório de Perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              Relatório de Perfil de Integridade (Decreto 11.129/22)
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-purple-600" />
                <p>Processando via Anthropic Batch API...</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                {report}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
