import { useParams } from 'react-router-dom'
import { ISO_CLAUSES } from '@/lib/iso-data'
import { UniversalClause } from '@/components/clause/UniversalClause'

export default function ClauseView() {
  const { id } = useParams<{ id: string }>()
  const clause = ISO_CLAUSES.find((c) => c.id === id)

  if (!clause) {
    return (
      <div className="flex items-center justify-center h-[50vh] flex-col text-muted-foreground">
        <h2 className="text-2xl font-bold mb-2">Item não encontrado</h2>
        <p>A cláusula ISO especificada não existe.</p>
      </div>
    )
  }

  return <UniversalClause key={clause.id} clause={clause} />
}
