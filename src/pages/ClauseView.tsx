import { useParams, Link } from 'react-router-dom'
import { ISO_CLAUSES } from '@/lib/iso-data'
import { UniversalClause } from '@/components/clause/UniversalClause'
import { useAppStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

export default function ClauseView() {
  const { id } = useParams<{ id: string }>()
  const { auditorMode } = useAppStore()

  const currentIndex = ISO_CLAUSES.findIndex((c) => c.id === id)
  const clause = ISO_CLAUSES[currentIndex]

  const prevClause = currentIndex > 0 ? ISO_CLAUSES[currentIndex - 1] : null
  const nextClause = currentIndex < ISO_CLAUSES.length - 1 ? ISO_CLAUSES[currentIndex + 1] : null

  if (!clause) {
    return (
      <div className="flex items-center justify-center h-[50vh] flex-col text-muted-foreground">
        <h2 className="text-2xl font-bold mb-2">Item não encontrado</h2>
        <p>A cláusula ISO especificada não existe.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 relative">
      <UniversalClause key={clause.id} clause={clause} />

      {auditorMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-[calc(50%+8rem)] lg:left-[calc(50%+8rem)] w-full max-w-3xl px-4 z-50 animate-fade-in-up">
          <div className="flex items-center justify-between p-3 bg-background/95 backdrop-blur-md rounded-full border shadow-xl shadow-primary/5">
            <div className="flex-1">
              {prevClause ? (
                <Button variant="ghost" className="rounded-full" asChild>
                  <Link to={`/clause/${prevClause.id}`}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Anterior: {prevClause.id}</span>
                  </Link>
                </Button>
              ) : (
                <div className="w-24"></div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider px-4">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Navegação do Auditor</span>
            </div>

            <div className="flex-1 flex justify-end">
              {nextClause ? (
                <Button
                  variant="default"
                  className="rounded-full shadow-md hover:shadow-lg transition-shadow"
                  asChild
                >
                  <Link to={`/clause/${nextClause.id}`}>
                    <span className="hidden sm:inline">Próximo: {nextClause.id}</span>
                    <span className="sm:hidden">Próximo</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="w-24"></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
