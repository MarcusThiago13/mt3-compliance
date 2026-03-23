import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Settings, ShieldAlert } from 'lucide-react'

export function PerfilLaboralTab({ tenant, onUpdate }: any) {
  const [profile, setProfile] = useState(tenant.labor_profile || {})
  const [saving, setSaving] = useState(false)

  const handleChange = (key: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('tenants')
      .update({ labor_profile: profile })
      .eq('id', tenant.id)
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Perfil laboral parametrizado com sucesso.' })
      onUpdate()
    }
    setSaving(false)
  }

  return (
    <Card className="animate-in fade-in shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5 text-primary" /> Configuração do Perfil Laboral
        </CardTitle>
        <CardDescription>
          Defina as características da força de trabalho para adaptar dinamicamente o módulo à
          realidade organizacional (
          {tenant.org_type === 'poder_publico'
            ? 'Órgão Público'
            : tenant.org_type === 'osc'
              ? 'OSC'
              : 'Empresa Privada'}
          ).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {tenant.org_type === 'poder_publico' && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-800 text-sm">Modo: Poder Público</h4>
              <p className="text-xs text-emerald-700 mt-1">
                O sistema ajustará as obrigações para focar na fiscalização de terceirizados e na
                gestão de servidores estatutários, temporários ou comissionados.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 border p-5 rounded-lg bg-slate-50/50 shadow-sm">
            <h3 className="font-semibold text-sm text-slate-800 border-b pb-2">
              Tipos de Vínculos e Regimes
            </h3>

            <div className="flex items-center justify-between">
              <Label className="cursor-pointer" htmlFor="has_clt">
                Trabalhadores Celetistas (CLT)
              </Label>
              <Switch
                id="has_clt"
                checked={profile.has_clt}
                onCheckedChange={(v) => handleChange('has_clt', v)}
              />
            </div>

            {tenant.org_type === 'poder_publico' && (
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="has_estatutarios">
                  Servidores Estatutários / Temporários
                </Label>
                <Switch
                  id="has_estatutarios"
                  checked={profile.has_estatutarios}
                  onCheckedChange={(v) => handleChange('has_estatutarios', v)}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label className="cursor-pointer" htmlFor="has_estagiarios">
                Estagiários ou Aprendizes
              </Label>
              <Switch
                id="has_estagiarios"
                checked={profile.has_estagiarios}
                onCheckedChange={(v) => handleChange('has_estagiarios', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="cursor-pointer" htmlFor="has_terceirizados">
                Mão de Obra Terceirizada
              </Label>
              <Switch
                id="has_terceirizados"
                checked={profile.has_terceirizados}
                onCheckedChange={(v) => handleChange('has_terceirizados', v)}
              />
            </div>
          </div>

          <div className="space-y-4 border p-5 rounded-lg bg-slate-50/50 shadow-sm">
            <h3 className="font-semibold text-sm text-slate-800 border-b pb-2">
              Controles e Módulos Integrados
            </h3>

            <div className="flex items-center justify-between">
              <Label className="cursor-pointer" htmlFor="has_ponto">
                Controle Eletrônico de Jornada / Ponto
              </Label>
              <Switch
                id="has_ponto"
                checked={profile.has_ponto}
                onCheckedChange={(v) => handleChange('has_ponto', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="cursor-pointer" htmlFor="has_esocial">
                Integração e Governança do eSocial
              </Label>
              <Switch
                id="has_esocial"
                checked={profile.has_esocial}
                onCheckedChange={(v) => handleChange('has_esocial', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="cursor-pointer" htmlFor="has_sst">
                Saúde e Segurança (PGR / PCMSO)
              </Label>
              <Switch
                id="has_sst"
                checked={profile.has_sst}
                onCheckedChange={(v) => handleChange('has_sst', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="cursor-pointer" htmlFor="has_canal_assedio">
                Canal de Prevenção a Assédio (Lei 14.457/22)
              </Label>
              <Switch
                id="has_canal_assedio"
                checked={profile.has_canal_assedio}
                onCheckedChange={(v) => handleChange('has_canal_assedio', v)}
              />
            </div>
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
            Salvar Perfil Laboral e Atualizar Catálogos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
