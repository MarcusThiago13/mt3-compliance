import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldAlert, Info } from 'lucide-react'

export function WhistleblowingCanal() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Canal de Denúncias (Interface Pública)</h3>
          <p className="text-sm text-muted-foreground">
            Formulário de captura para relatos anônimos ou identificados.
          </p>
        </div>
        <Button variant="outline">Copiar Link Público</Button>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg max-w-3xl mx-auto border shadow-sm">
        <div className="text-center mb-6">
          <ShieldAlert className="h-12 w-12 text-primary mx-auto mb-2" />
          <h4 className="text-xl font-bold">Relatar Incidente</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Garantimos total confidencialidade e proteção contra retaliação.
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>O relato será anônimo?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm border p-3 rounded-md flex-1 cursor-pointer hover:bg-muted">
                  <input type="radio" name="anon" defaultChecked /> Sim, manter anonimato
                </label>
                <label className="flex items-center gap-2 text-sm border p-3 rounded-md flex-1 cursor-pointer hover:bg-muted">
                  <input type="radio" name="anon" /> Não, quero me identificar
                </label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Tipo de Incidente</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Fraude e Corrupção</option>
                <option>Assédio Moral ou Sexual</option>
                <option>Vazamento de Dados</option>
                <option>Conflito de Interesses</option>
                <option>Outros</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Descrição Detalhada</Label>
              <Textarea
                placeholder="O que aconteceu? Quando? Quem está envolvido?"
                className="min-h-[120px]"
              />
            </div>

            <div className="grid gap-2">
              <Label>Evidências (Opcional)</Label>
              <Input type="file" />
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Info className="h-3 w-3" /> Arquivos enviados podem conter metadados. Limpe-os se
                desejar anonimato absoluto.
              </p>
            </div>
          </div>

          <Button className="w-full bg-primary text-primary-foreground h-12 text-md">
            Enviar Relato de Forma Segura
          </Button>
        </form>
      </div>
    </div>
  )
}
