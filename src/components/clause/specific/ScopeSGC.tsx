import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Download } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export function ScopeSGC() {
  const saveScope = () => {
    toast({
      title: 'Escopo Atualizado',
      description: 'A nova versão do escopo foi salva com sucesso.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Escopo do SGC</h3>
          <p className="text-sm text-muted-foreground">
            Fronteiras e aplicabilidade do Sistema de Gestão.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Declaração
          </Button>
          <Button onClick={saveScope}>
            <Save className="mr-2 h-4 w-4" /> Salvar Versão
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-md">Descrição Geral do Escopo</CardTitle>
                <Badge variant="outline" className="bg-primary/5">
                  Versão Atual: v2.1
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[120px]"
                defaultValue="O Sistema de Gestão de Compliance aplica-se a todas as operações, processos e atividades da matriz e filiais, englobando as relações com clientes, fornecedores e entes públicos."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md">Limites e Aplicabilidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Unidades Organizacionais Incluídas</Label>
                <Input defaultValue="Matriz (SP), Filial 1 (RJ), Centro de Distribuição (MG)" />
              </div>
              <div className="grid gap-2">
                <Label>Fronteiras Geográficas</Label>
                <Input defaultValue="Território Nacional Brasileiro" />
              </div>
              <div className="grid gap-2">
                <Label>Processos e Funções</Label>
                <Input defaultValue="Vendas, Suprimentos, RH, Financeiro, Diretoria" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-md text-amber-800">Exclusões do Escopo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-amber-800">Item Excluído</Label>
                <Input defaultValue="Operações da Subsidiária Internacional" className="bg-white" />
              </div>
              <div className="grid gap-2">
                <Label className="text-amber-800">Justificativa Técnica</Label>
                <Textarea
                  className="min-h-[100px] bg-white text-sm"
                  defaultValue="A subsidiária internacional possui um SGC próprio estruturado sob a legislação local específica, não integrando a certificação matriz."
                />
              </div>
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground px-2">
            * Aprovado por: <strong>Conselho Administrativo</strong>
            <br />* Data de Aprovação: <strong>15/10/2023</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
