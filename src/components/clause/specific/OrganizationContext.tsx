import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Download } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export function OrganizationContext() {
  const exportReport = () => {
    toast({ title: 'Relatório Gerado', description: 'O Contexto da Organização foi exportado.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Contexto da Organização (SWOT e Cultura)</h3>
          <p className="text-sm text-muted-foreground">
            Mapeamento de questões internas, externas e ambiente de compliance.
          </p>
        </div>
        <Button onClick={exportReport} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar Relatório
        </Button>
      </div>

      <Tabs defaultValue="external">
        <TabsList className="mb-4">
          <TabsTrigger value="external">Questões Externas</TabsTrigger>
          <TabsTrigger value="internal">Questões Internas</TabsTrigger>
          <TabsTrigger value="culture">Cultura de Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="external" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              'Regulatório',
              'Legal',
              'Econômico',
              'Político',
              'Social',
              'Cultural',
              'Ambiental',
            ].map((topic) => (
              <Card key={topic}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{topic}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <Textarea
                    placeholder={`Descreva ameaças e oportunidades do ambiente ${topic.toLowerCase()}...`}
                    className="min-h-[80px] text-sm"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="internal" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              'Estrutura Organizacional',
              'Governança',
              'Políticas e Objetivos',
              'Processos Operacionais',
              'Recursos (Humanos, Fin, Tech)',
              'Maturidade de TI',
            ].map((topic) => (
              <Card key={topic}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{topic}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <Textarea
                    placeholder={`Descreva forças e fraquezas relacionadas a ${topic.toLowerCase()}...`}
                    className="min-h-[80px] text-sm"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="culture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Avaliação Qualitativa do Ambiente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Apoio da Alta Direção (Tone at the Top)</Label>
                  <span className="text-sm font-bold text-primary">80%</span>
                </div>
                <Slider defaultValue={[80]} max={100} step={1} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Percepção de Integridade pelos Colaboradores</Label>
                  <span className="text-sm font-bold text-primary">65%</span>
                </div>
                <Slider defaultValue={[65]} max={100} step={1} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Segurança psicológica para relatar desvios</Label>
                  <span className="text-sm font-bold text-primary">90%</span>
                </div>
                <Slider defaultValue={[90]} max={100} step={1} />
              </div>
              <div className="pt-4 border-t">
                <Label className="mb-2 block">Parecer Geral da Cultura</Label>
                <Textarea placeholder="Resumo analítico do ambiente de compliance..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
