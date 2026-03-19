import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, UploadCloud, Loader2 } from 'lucide-react'
import { uploadDocument } from '@/lib/upload'

export function Step2({ data, updateData }: { data: any; updateData: (d: any) => void }) {
  const setField = (k: string, v: any) => updateData({ ...data, [k]: v })
  const members = data.board_members || []
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  const addMember = () =>
    setField('board_members', [...members, { name: '', position: '', email: '', phone: '' }])
  const removeMember = (idx: number) =>
    setField(
      'board_members',
      members.filter((_: any, i: number) => i !== idx),
    )
  const updateMember = (idx: number, k: string, v: string) => {
    const newMembers = [...members]
    newMembers[idx][k] = v
    setField('board_members', newMembers)
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (!e.target.files?.[0]) return
    setUploading((prev) => ({ ...prev, [key]: true }))
    const path = await uploadDocument(e.target.files[0])
    if (path) setField(key, path)
    setUploading((prev) => ({ ...prev, [key]: false }))
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base">Membros da Alta Direção / Órgão Diretivo</Label>
          <Button type="button" variant="outline" size="sm" onClick={addMember}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar
          </Button>
        </div>
        {members.map((m: any, i: number) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-2 items-start md:items-center border p-3 rounded-md bg-muted/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1 w-full">
              <Input
                placeholder="Nome Completo"
                value={m.name}
                onChange={(e) => updateMember(i, 'name', e.target.value)}
              />
              <Input
                placeholder="Cargo"
                value={m.position}
                onChange={(e) => updateMember(i, 'position', e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={m.email}
                onChange={(e) => updateMember(i, 'email', e.target.value)}
              />
              <Input
                placeholder="Telefone / WhatsApp"
                value={m.phone}
                onChange={(e) => updateMember(i, 'phone', e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeMember(i)}
              className="self-end md:self-auto"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Nenhum membro adicionado.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 border p-4 rounded-md">
          <Label>Organograma</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              onChange={(e) => handleFile(e, 'organograma_url')}
              disabled={uploading['organograma_url']}
            />
            {uploading['organograma_url'] && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {data.organograma_url && !uploading['organograma_url'] && (
              <span className="text-xs font-medium text-success flex items-center shrink-0">
                <UploadCloud className="w-4 h-4 mr-1" /> Salvo
              </span>
            )}
          </div>
        </div>
        <div className="space-y-2 border p-4 rounded-md">
          <Label>Contrato / Estatuto Social</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              onChange={(e) => handleFile(e, 'contrato_social_url')}
              disabled={uploading['contrato_social_url']}
            />
            {uploading['contrato_social_url'] && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {data.contrato_social_url && !uploading['contrato_social_url'] && (
              <span className="text-xs font-medium text-success flex items-center shrink-0">
                <UploadCloud className="w-4 h-4 mr-1" /> Salvo
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Switch
            checked={data.matrix_auth_required || false}
            onCheckedChange={(v) => setField('matrix_auth_required', v)}
            id="matrix-auth"
          />
          <Label htmlFor="matrix-auth" className="cursor-pointer">
            Depende de autorizações da Matriz/Grupo para decisões críticas?
          </Label>
        </div>
        {data.matrix_auth_required && (
          <Textarea
            className="animate-in fade-in"
            placeholder="Detalhe os níveis de alçada e dependências..."
            value={data.matrix_auth_details || ''}
            onChange={(e) => setField('matrix_auth_details', e.target.value)}
          />
        )}
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Switch
            checked={data.legal_background || false}
            onCheckedChange={(v) => setField('legal_background', v)}
            id="legal-back"
          />
          <Label htmlFor="legal-back" className="cursor-pointer">
            Existem inquéritos, processos ou condenações por corrupção/improbidade?
          </Label>
        </div>
        {data.legal_background && (
          <Textarea
            className="animate-in fade-in"
            placeholder="Detalhe as ocorrências e o status jurídico..."
            value={data.legal_background_details || ''}
            onChange={(e) => setField('legal_background_details', e.target.value)}
          />
        )}
      </div>
    </div>
  )
}
