import { UploadCloud, File, Trash2, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function EvidenceTab() {
  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
        <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-sm">Arraste arquivos ou clique para upload</h3>
        <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, Imagens (Max 10MB)</p>
        <Button variant="secondary" size="sm" className="mt-4">
          Selecionar Arquivo
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 grid gap-1.5">
          <Label htmlFor="link">Link Externo de Evidência</Label>
          <div className="flex gap-2">
            <Input id="link" placeholder="https://sharepoint..." className="flex-1" />
            <Button variant="outline">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Evidências Anexadas</h4>
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-md bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded">
                <File className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Politica_v{i}.pdf</p>
                <p className="text-xs text-muted-foreground">Anexado por Admin em 12/10/2023</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
