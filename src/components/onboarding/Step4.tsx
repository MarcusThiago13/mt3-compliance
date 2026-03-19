import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

const CATEGORIES = [
  'Dirigente',
  'Administrativo',
  'Operacional',
  'Estagiários',
  'Terceirizados',
  'Outros',
]

export function Step4({ data, updateData }: { data: any[]; updateData: (d: any[]) => void }) {
  useEffect(() => {
    if (!data || data.length === 0) {
      updateData(CATEGORIES.map((c) => ({ category: c, quantity: 0, internet_access: false })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const items =
    data?.length > 0
      ? data
      : CATEGORIES.map((c) => ({ category: c, quantity: 0, internet_access: false }))

  const updateItem = (idx: number, k: string, v: any) => {
    const newItems = [...items]
    newItems[idx][k] = v
    updateData(newItems)
  }

  const total = items.reduce((acc: number, curr: any) => acc + (parseInt(curr.quantity) || 0), 0)

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium border-b">
          <div className="col-span-5 flex items-center">Categoria de Colaboradores</div>
          <div className="col-span-3 text-center flex items-center justify-center">Quantidade</div>
          <div className="col-span-4 text-center flex items-center justify-center">
            Acesso à Internet?
          </div>
        </div>
        <div className="divide-y">
          {items.map((item: any, i: number) => (
            <div
              key={i}
              className="grid grid-cols-12 p-3 items-center hover:bg-muted/30 transition-colors"
            >
              <div className="col-span-5 font-medium text-sm text-foreground/90">
                {item.category}
              </div>
              <div className="col-span-3 px-2 md:px-8">
                <Input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                  className="text-center h-9"
                />
              </div>
              <div className="col-span-4 flex justify-center">
                <Switch
                  checked={item.internet_access}
                  onCheckedChange={(v) => updateItem(i, 'internet_access', v)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-12 bg-muted/50 p-4 font-bold border-t text-primary">
          <div className="col-span-5 text-right pr-4">Total Geral do Efetivo:</div>
          <div className="col-span-3 text-center text-lg">{total}</div>
          <div className="col-span-4"></div>
        </div>
      </div>
    </div>
  )
}
