import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Settings, ShieldAlert, Users } from 'lucide-react'

export function PerfilDigitalTab({ tenant, onUpdate }: any) {
  const [profile, setProfile] = useState(tenant.digital_profile || {})
  const [saving, setSaving] = useState(false)

  const handleChange = (key: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('tenants')
      .update({ digital_profile: profile })
      .eq('id', tenant.id)
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Perfil digital parametrizado com sucesso.' })
      onUpdate()
    }
    setSaving(false)
  }

  const targetAudience =
    tenant.org_type === 'osc'
      ? 'beneficiários/estudantes'
      : tenant.org_type === 'poder_publico'
        ? 'cidadãos e servidores'
        : 'clientes e colaboradores'

  return (
    <div className="space-y-6 animate-in fade-in">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5 text-primary" /> Configuração do Perfil Digital e LGPD
          </CardTitle>
          <CardDescription>
            Defina o contexto de privacidade da organização. O sistema adaptará os controles para
            proteger os dados de {targetAudience}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {tenant.org_type === 'poder_publico' && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 text-sm">Contexto: Poder Público</h4>
                <p className="text-xs text-blue-700 mt-1">
                  O módulo balanceará exigências da LGPD com a Lei de Acesso à Informação (LAI),
                  priorizando bases legais de Políticas Públicas e Obrigação Legal.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 border p-5 rounded-lg bg-slate-50/50 shadow-sm">
              <h3 className="font-semibold text-sm text-slate-800 border-b pb-2">
                Papel e Natureza dos Dados
              </h3>

              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="is_controller">
                  Atua como Controlador de Dados?
                </Label>
                <Switch
                  id="is_controller"
                  checked={profile.is_controller}
                  onCheckedChange={(v) => handleChange('is_controller', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="is_processor">
                  Atua como Operador de Dados (Terceiro)?
                </Label>
                <Switch
                  id="is_processor"
                  checked={profile.is_processor}
                  onCheckedChange={(v) => handleChange('is_processor', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label
                  className="cursor-pointer text-red-700 font-semibold"
                  htmlFor="treats_sensitive"
                >
                  Trata Dados Pessoais Sensíveis?
                </Label>
                <Switch
                  id="treats_sensitive"
                  checked={profile.treats_sensitive}
                  onCheckedChange={(v) => handleChange('treats_sensitive', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="treats_children">
                  Trata Dados de Crianças/Adolescentes?
                </Label>
                <Switch
                  id="treats_children"
                  checked={profile.treats_children}
                  onCheckedChange={(v) => handleChange('treats_children', v)}
                />
              </div>
            </div>

            <div className="space-y-4 border p-5 rounded-lg bg-slate-50/50 shadow-sm">
              <h3 className="font-semibold text-sm text-slate-800 border-b pb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Encarregado de Dados (DPO)
              </h3>

              <div className="flex items-center justify-between mb-2">
                <Label className="cursor-pointer" htmlFor="has_dpo">
                  Possui DPO Nomeado Formalmente?
                </Label>
                <Switch
                  id="has_dpo"
                  checked={profile.has_dpo}
                  onCheckedChange={(v) => handleChange('has_dpo', v)}
                />
              </div>

              {profile.has_dpo && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="space-y-1">
                    <Label className="text-xs">Nome do DPO / Comitê</Label>
                    <Input
                      value={profile.dpo_name || ''}
                      onChange={(e) => handleChange('dpo_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">E-mail de Contato (Público)</Label>
                    <Input
                      type="email"
                      value={profile.dpo_email || ''}
                      onChange={(e) => handleChange('dpo_email', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saving}
              size="lg"
              className="w-full sm:w-auto shadow-md"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar Perfil Digital
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
