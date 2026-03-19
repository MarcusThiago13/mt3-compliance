import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function Step6({ data, updateData }: { data: any; updateData: (d: any) => void }) {
  const setField = (k: string, v: any) => updateData({ ...data, [k]: v })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-5 rounded-md bg-muted/10">
        <div className="col-span-1 md:col-span-2">
          <Label className="text-base font-semibold text-primary">
            Compliance Officer / Responsável pelo Programa
          </Label>
        </div>
        <div className="space-y-2">
          <Label>Nome Completo</Label>
          <Input
            value={data.compliance_officer_name || ''}
            onChange={(e) => setField('compliance_officer_name', e.target.value)}
            placeholder="Nome do responsável"
          />
        </div>
        <div className="space-y-2">
          <Label>Email Corporativo</Label>
          <Input
            type="email"
            value={data.compliance_officer_email || ''}
            onChange={(e) => setField('compliance_officer_email', e.target.value)}
            placeholder="email@empresa.com"
          />
        </div>
        <div className="space-y-2">
          <Label>Telefone / Celular</Label>
          <Input
            value={data.compliance_officer_phone || ''}
            onChange={(e) => setField('compliance_officer_phone', e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-5 rounded-md bg-muted/10">
        <div className="space-y-2">
          <Label>Data de Instituição do Sistema de Compliance</Label>
          <Input
            type="date"
            value={data.compliance_inception_date || ''}
            onChange={(e) => setField('compliance_inception_date', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Caso ainda não instituído formalmente, deixe em branco.
          </p>
        </div>
        <div className="space-y-2 flex flex-col justify-center">
          <div className="flex items-center space-x-2 mt-2 md:mt-4">
            <Switch
              checked={data.is_compliance_global || false}
              onCheckedChange={(v) => setField('is_compliance_global', v)}
              id="global-scope"
            />
            <Label htmlFor="global-scope" className="cursor-pointer">
              O Escopo é Global? (Aplica-se a todas as unidades/filiais)
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
