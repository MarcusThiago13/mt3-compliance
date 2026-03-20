import { Link, Navigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, ArrowRight, Building } from 'lucide-react'

const Index = () => {
  const { activeTenant } = useAppStore()

  if (!activeTenant) {
    return <Navigate to="/tenants" replace />
  }

  return (
    <div className="flex h-[80vh] items-center justify-center animate-fade-in p-4">
      <Card className="w-full max-w-lg shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Visão Geral do Compliance
          </CardTitle>
          <CardDescription className="text-base mt-2 flex items-center justify-center gap-2">
            <Building className="h-4 w-4" />
            Organização Ativa: <strong className="text-foreground">{activeTenant.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-8 space-y-6">
          <p className="text-center text-muted-foreground max-w-sm">
            Acesse o sistema de gestão de compliance para iniciar a avaliação, monitorar os
            requisitos da norma ISO 37301 e verificar as conformidades da sua organização.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto min-w-[250px] group text-lg h-12">
            <Link to={`/${activeTenant.id}/clause/4.1`}>
              Acessar Clause 4.1
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Index
