import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  ShieldCheck,
  Loader2,
  FileCheck,
  AlertCircle,
  UploadCloud,
  CheckCircle2,
  Search,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export default function RegularidadeInstitucional() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data representing the institutional regularity tracking
  const [certidoes, setCertidoes] = useState([
    {
      id: '1',
      nome: 'CND Federal e Previdenciária',
      orgao: 'Receita Federal do Brasil',
      validade: '2026-12-31',
      status: 'Válida',
    },
    {
      id: '2',
      nome: 'CND Estadual',
      orgao: 'Secretaria de Fazenda Estadual',
      validade: '2026-10-15',
      status: 'Válida',
    },
    {
      id: '3',
      nome: 'CND Municipal',
      orgao: 'Prefeitura Municipal',
      validade: '2025-08-01',
      status: 'Vencida',
    },
    {
      id: '4',
      nome: 'CRF do FGTS',
      orgao: 'Caixa Econômica Federal',
      validade: '2026-11-20',
      status: 'Válida',
    },
    {
      id: '5',
      nome: 'CND Trabalhista (CNDT)',
      orgao: 'Tribunal Superior do Trabalho',
      validade: '2026-09-30',
      status: 'Válida',
    },
    {
      id: '6',
      nome: 'Declaração de Não Empregador de Menor',
      orgao: 'Interno',
      validade: '2026-12-31',
      status: 'Válida',
    },
    {
      id: '7',
      nome: 'Alvará de Funcionamento',
      orgao: 'Prefeitura Municipal',
      validade: '2026-05-10',
      status: 'Atenção',
    },
  ])

  useEffect(() => {
    // Simulate database fetching
    setTimeout(() => setLoading(false), 800)
  }, [tenantId])

  const handleUpdate = (id: string) => {
    toast({ title: 'Upload Solicitado', description: 'Módulo de upload de certidão em breve.' })
  }

  const filtered = certidoes.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.orgao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" /> Regularidade Institucional
          </h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            Monitoramento centralizado de certidões, qualificações e habilitação jurídica
            necessárias para a celebração e manutenção de parcerias com a Administração Pública
            (MROSC).
          </p>
        </div>
        <Button className="shrink-0 bg-primary hover:bg-primary/90 text-white shadow-sm">
          <FileCheck className="mr-2 h-4 w-4" /> Gerar Dossiê de Habilitação
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar certidão ou órgão..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm font-medium text-muted-foreground bg-slate-100 px-3 py-1.5 rounded-full">
          {certidoes.filter((c) => c.status === 'Vencida' || c.status === 'Atenção').length}{' '}
          pendências mapeadas
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((c) => {
          const isVencida = c.status === 'Vencida'
          const isAtencao = c.status === 'Atenção'

          return (
            <Card
              key={c.id}
              className={`shadow-sm border-l-4 transition-all hover:shadow-md ${
                isVencida
                  ? 'border-l-red-500 bg-red-50/20'
                  : isAtencao
                    ? 'border-l-amber-500 bg-amber-50/20'
                    : 'border-l-emerald-500 bg-white'
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant={isVencida ? 'destructive' : isAtencao ? 'outline' : 'default'}
                    className={`font-semibold ${!isVencida && !isAtencao ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none' : isAtencao ? 'bg-amber-100 text-amber-800 border-none' : ''}`}
                  >
                    {c.status}
                  </Badge>
                  {isVencida ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : isAtencao ? (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}
                </div>
                <CardTitle className="text-base leading-tight text-slate-800">{c.nome}</CardTitle>
                <CardDescription className="text-xs mt-1 text-slate-500">{c.orgao}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm py-3 border-t border-slate-100/50 mt-2">
                  <span className="text-slate-500">Validade:</span>
                  <span
                    className={`font-mono font-medium ${isVencida ? 'text-red-600' : isAtencao ? 'text-amber-600' : 'text-slate-700'}`}
                  >
                    {new Date(c.validade).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className={`w-full mt-2 bg-white ${isVencida ? 'border-red-200 hover:bg-red-50 text-red-700' : 'text-slate-600'}`}
                  size="sm"
                  onClick={() => handleUpdate(c.id)}
                >
                  <UploadCloud className="mr-2 h-4 w-4" /> Atualizar Documento
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
