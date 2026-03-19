import { Save, Scale } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

export function OrgProfiling() {
  const saveProfile = () => {
    toast({
      title: 'Perfil Salvo',
      description: 'Parâmetros de proporcionalidade atualizados para análise.',
    })
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
                <Select defaultValue="large">
                  <SelectTrigger>
                    <SelectValue />
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
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue />
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
                <Select defaultValue="yes">
                  <SelectTrigger>
                    <SelectValue />
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
                <Input defaultValue="Construção Civil e Infraestrutura" />
              </div>
              <div className="space-y-2">
                <Label>V. Atuação Internacional</Label>
                <Select defaultValue="national">
                  <SelectTrigger>
                    <SelectValue />
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
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue />
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
                <Input type="number" defaultValue="4" />
              </div>
              <div className="space-y-2">
                <Label>VIII. Qualificação de Parceiros</Label>
                <Select defaultValue="high_risk">
                  <SelectTrigger>
                    <SelectValue />
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

      <div>
        <Card className="bg-primary/5 border-primary/20 sticky top-6">
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2 text-primary">
              <Scale className="h-5 w-5" /> Proporcionalidade Aplicada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between items-center pb-3 border-b border-primary/10">
              <span className="font-semibold text-muted-foreground">Grau de Exigência CGU:</span>
              <Badge className="bg-destructive hover:bg-destructive">Rigor Máximo</Badge>
            </div>
            <p className="text-muted-foreground">
              Com base no perfil selecionado (Grande Porte, Alta Interação Pública e Uso de
              Intermediários), os avaliadores exigirão evidências robustas de:
            </p>
            <ul className="list-disc pl-4 space-y-2 text-muted-foreground text-xs mt-2">
              <li>Canal de denúncias operado por terceiros e 100% independente.</li>
              <li>
                Due Diligence aprofundada (Background check) para todos os parceiros críticos.
              </li>
              <li>Treinamentos anuais com prova de retenção de conhecimento.</li>
              <li>Auditoria externa e independente periódica do Programa de Integridade.</li>
              <li>Atuação direta do Conselho de Administração na supervisão.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
