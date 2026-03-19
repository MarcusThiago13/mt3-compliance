import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Download, Plus, Megaphone, Lightbulb, MessageCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const campaigns = [
  {
    name: 'Semana da Integridade 2023',
    target: 'Toda a Empresa',
    type: 'Múltiplos Canais',
    engagement: 85,
    status: 'Concluída',
  },
  {
    name: 'Comunicado Alta Direção (Tone at the Top)',
    target: 'Liderança',
    type: 'Vídeo / Email',
    engagement: 95,
    status: 'Ativa',
  },
]

const materials = [
  {
    title: 'Cartilha Prática sobre Brindes e Hospitalidades',
    category: 'Guia Rápido',
    views: 420,
    lastUpdated: '10/08/2023',
  },
  {
    title: 'FAQ - Conflito de Interesses',
    category: 'Referência Rápida',
    views: 315,
    lastUpdated: '05/09/2023',
  },
]

export function Awareness73() {
  const handleExport = () => {
    toast({
      title: 'Relatório Gerado',
      description: 'Métricas de engajamento em conscientização exportadas.',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-lg">7.3 Conscientização</h3>
          <p className="text-sm text-muted-foreground">
            Gestão de campanhas, engajamento e biblioteca central de materiais de referência.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Métricas de Engajamento
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Campanha
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" /> Campanhas Ativas e Recentes
          </h4>
          <div className="grid gap-3">
            {campaigns.map((camp, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium text-sm">{camp.name}</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">Público: {camp.target}</p>
                    </div>
                    <Badge
                      variant={camp.status === 'Ativa' ? 'default' : 'secondary'}
                      className={camp.status === 'Ativa' ? 'bg-success hover:bg-success' : ''}
                    >
                      {camp.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Engajamento Mensurado</span>
                      <span className="font-bold">{camp.engagement}%</span>
                    </div>
                    <Progress value={camp.engagement} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" /> Biblioteca de Materiais (Acesso Fácil)
          </h4>
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Acessos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((mat, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="font-medium text-sm">{mat.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        Atualizado: {mat.lastUpdated}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {mat.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-primary">
                      {mat.views}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex gap-3 text-sm text-blue-800">
            <MessageCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>
              Os materiais de conscientização devem ser mantidos como informação documentada e devem
              estar acessíveis a todo o público-alvo aplicável para consulta rápida.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
