import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  FileText,
  Download,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Building2,
  AlertTriangle,
  GraduationCap,
  CheckSquare,
  CheckCircle2,
} from 'lucide-react'
import { complianceService } from '@/services/compliance'
import { toast } from '@/hooks/use-toast'

export default function Dossier() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const [options, setOptions] = useState({
    onboarding: true,
    risks: true,
    trainings: true,
    gaps: true,
  })

  const handleToggle = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setDownloadUrl(null)
    try {
      const response = await complianceService.generateDossier(tenantId!, options)
      setDownloadUrl(response.url)
      toast({
        title: 'Dossiê Gerado com Sucesso',
        description: 'O documento PDF foi gerado e está pronto para download.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro na Geração',
        description: error.message || 'Falha ao compilar o dossiê.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link to={`/${tenantId}/intelligence`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <FileText className="h-8 w-8" /> Exportação do Dossiê Oficial
          </h1>
          <p className="text-muted-foreground mt-1">
            Gere o documento oficial e imutável que comprova a eficácia do programa de integridade.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle>Configuração do Relatório</CardTitle>
            <CardDescription>
              Selecione os módulos a serem incluídos na compilação do dossiê.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-3 rounded-lg border bg-slate-50">
              <Checkbox
                id="opt-onboarding"
                checked={options.onboarding}
                onCheckedChange={() => handleToggle('onboarding')}
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor="opt-onboarding"
                  className="font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="h-4 w-4 text-blue-600" /> Perfil e Governança
                </Label>
                <p className="text-xs text-muted-foreground">
                  Dados cadastrais, organograma, e estrutura de compliance.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border bg-slate-50">
              <Checkbox
                id="opt-risks"
                checked={options.risks}
                onCheckedChange={() => handleToggle('risks')}
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor="opt-risks"
                  className="font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <AlertTriangle className="h-4 w-4 text-orange-500" /> Matriz de Riscos
                </Label>
                <p className="text-xs text-muted-foreground">
                  Riscos mapeados, probabilidade, impacto e planos de tratamento.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border bg-slate-50">
              <Checkbox
                id="opt-trainings"
                checked={options.trainings}
                onCheckedChange={() => handleToggle('trainings')}
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor="opt-trainings"
                  className="font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="h-4 w-4 text-emerald-600" /> Treinamentos e
                  Conscientização
                </Label>
                <p className="text-xs text-muted-foreground">
                  Estatísticas de cobertura e registro de capacitações.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border bg-slate-50">
              <Checkbox
                id="opt-gaps"
                checked={options.gaps}
                onCheckedChange={() => handleToggle('gaps')}
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor="opt-gaps"
                  className="font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <CheckSquare className="h-4 w-4 text-purple-600" /> Auditoria e Gaps
                </Label>
                <p className="text-xs text-muted-foreground">
                  Achados de auditoria interna, não conformidades e correções.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t p-6 flex flex-col items-stretch gap-4">
            <Button
              size="lg"
              className="w-full text-base h-12 relative overflow-hidden group"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Compilando Informações...
                </>
              ) : (
                <>
                  <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
                  <ShieldCheck className="mr-2 h-5 w-5" /> Gerar Dossiê com Hash
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              A geração deste relatório criará um registro imutável na trilha de auditoria do
              sistema.
            </p>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card
            className={
              downloadUrl
                ? 'border-emerald-500 bg-emerald-50/50 shadow-sm transition-all duration-500'
                : 'opacity-50 transition-all duration-500'
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" /> Documento Pronto
              </CardTitle>
              <CardDescription>
                Seu dossiê foi gerado e empacotado em um formato PDF/A seguro.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6 min-h-[200px]">
              {downloadUrl ? (
                <div className="text-center space-y-4 animate-fade-in-up">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg text-emerald-800">Dossiê Compilado</h3>
                  <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-5 w-5" /> Baixar PDF
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    {isGenerating
                      ? 'Processando e validando dados...'
                      : 'Aguardando geração do relatório...'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-4 text-sm text-primary/80 space-y-2">
              <h4 className="font-bold">O que é o Dossiê de Compliance?</h4>
              <p>
                O dossiê é a materialização de todas as evidências registradas na plataforma. Ele
                organiza as informações mapeando diretamente para os requisitos da{' '}
                <strong>ISO 37301</strong> e os incisos do{' '}
                <strong>Art. 57 do Decreto 11.129/22</strong>.
              </p>
              <p>
                Este documento deve ser apresentado em casos de fiscalização, processos licitatórios
                ou procedimentos de Due Diligence por terceiros.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
