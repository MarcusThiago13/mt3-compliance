import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

const steps = [
  'Identificação',
  'Governança',
  'Compliance',
  'Perfil e Contexto',
  'Processamento',
  'Revisão',
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((c) => c + 1)
      if (currentStep === 3) {
        // Trigger fake processing
        setTimeout(() => setCurrentStep(5), 2000)
      }
    } else {
      toast({ title: 'Tenant Criado', description: 'O ambiente isolado foi gerado com sucesso.' })
      navigate('/tenants')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">
        Onboarding de Novo Cliente
      </h1>

      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        {steps.map((s, i) => (
          <div
            key={s}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${i <= currentStep ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'}`}
          >
            {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
          </div>
        ))}
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[250px] flex flex-col justify-center">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Razão Social</Label>
                <Input placeholder="Ex: Acme Ltda" />
              </div>
              <div className="grid gap-2">
                <Label>CNPJ</Label>
                <Input placeholder="00.000.000/0000-00" />
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Nome do CEO / Diretor</Label>
                <Input placeholder="Nome completo" />
              </div>
              <div className="grid gap-2">
                <Label>Órgão de Governança</Label>
                <Input placeholder="Conselho de Administração, etc." />
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Compliance Officer</Label>
                <Input placeholder="Nome do responsável" />
              </div>
              <div className="grid gap-2">
                <Label>Email de Contato</Label>
                <Input type="email" placeholder="compliance@empresa.com" />
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Setor de Atuação</Label>
                <Input placeholder="Ex: Financeiro, Saúde..." />
              </div>
              <div className="grid gap-2">
                <Label>Nível de Risco Inerente</Label>
                <Input placeholder="Alto, Médio, Baixo" />
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div className="flex flex-col items-center text-center space-y-4 animate-pulse">
              <Settings className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-muted-foreground">
                Mapeando estrutura ISO 37301...
              </p>
              <p className="text-sm">
                Criando políticas base, matriz de risco e canal de denúncias isolado.
              </p>
            </div>
          )}
          {currentStep === 5 && (
            <div className="space-y-4 text-center">
              <div className="h-16 w-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-bold">Tudo Pronto!</h3>
              <p className="text-muted-foreground">
                O ambiente para o novo cliente foi configurado e estruturado conforme a ISO
                37301:2021.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t pt-4">
          <Button
            variant="outline"
            disabled={currentStep === 0 || currentStep === 4}
            onClick={() => setCurrentStep((c) => c - 1)}
          >
            Voltar
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === 4}
            className={currentStep === 5 ? 'bg-success hover:bg-success/90' : ''}
          >
            {currentStep === 5 ? 'Ativar Ambiente' : 'Próximo'}{' '}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
