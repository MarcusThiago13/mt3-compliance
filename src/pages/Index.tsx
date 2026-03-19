import { useAppStore } from '@/stores/main'
import { PdcaCards } from '@/components/dashboard/PdcaCards'
import { IsoGrid } from '@/components/dashboard/IsoGrid'
import { KpiDashboard } from '@/components/dashboard/KpiDashboard'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

const Index = () => {
  const { activeTenant } = useAppStore()

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Painel SGC</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do programa de integridade - {activeTenant?.name}
          </p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm">
          <Download className="mr-2 h-4 w-4" /> Relatório Executivo
        </Button>
      </div>

      <PdcaCards />

      <div>
        <h2 className="text-xl font-semibold mb-4 text-primary">Estrutura ISO 37301</h2>
        <IsoGrid />
      </div>

      <KpiDashboard />
    </div>
  )
}

export default Index
