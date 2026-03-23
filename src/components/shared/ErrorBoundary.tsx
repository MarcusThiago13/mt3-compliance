import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logError } from '@/lib/logger'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error.message, error.stack, { componentStack: errorInfo.componentStack })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center animate-fade-in">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ops! Ocorreu um erro inesperado.</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Nossa equipe de engenharia (Bug Scanner) já foi notificada automaticamente e está
            trabalhando na correção de forma proativa.
          </p>
          <Button onClick={() => window.location.reload()}>Recarregar Página</Button>
        </div>
      )
    }

    return this.props.children
  }
}
