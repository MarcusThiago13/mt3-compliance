import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Edit, Trash2, FileText, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useAppStore } from '@/stores/main'

export default function TenantTemplates() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { activeTenant } = useAppStore()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)

  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const fetchTemplates = async () => {
    if (!tenantId) return
    setLoading(true)
    const { data } = await supabase
      .from('email_templates')
      .select('*')
      .or(`tenant_id.eq.${tenantId},tenant_id.is.null`)
      .order('name')
    if (data) setTemplates(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTemplates()
  }, [tenantId])

  const handleOpenModal = (template?: any) => {
    if (template) {
      if (!template.tenant_id) {
        toast({
          title: 'Atenção',
          description:
            'Não é possível editar templates globais do sistema. Crie um novo para esta organização.',
          variant: 'destructive',
        })
        return
      }
      setEditingTemplate(template)
      setName(template.name)
      setSubject(template.subject)
      setBody(template.body)
    } else {
      setEditingTemplate(null)
      setName('')
      setSubject('')
      setBody('')
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!name || !subject || !body)
      return toast({
        title: 'Atenção',
        description: 'Preencha todos os campos.',
        variant: 'destructive',
      })
    setIsSaving(true)
    try {
      if (editingTemplate) {
        await supabase
          .from('email_templates')
          .update({ name, subject, body, updated_at: new Date().toISOString() })
          .eq('id', editingTemplate.id)
        toast({ title: 'Sucesso', description: 'Template atualizado com sucesso.' })
      } else {
        await supabase.from('email_templates').insert({ tenant_id: tenantId, name, subject, body })
        toast({ title: 'Sucesso', description: 'Template criado com sucesso.' })
      }
      setIsModalOpen(false)
      fetchTemplates()
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (template: any) => {
    if (!template.tenant_id) {
      toast({
        title: 'Atenção',
        description: 'Não é possível excluir templates globais do sistema.',
        variant: 'destructive',
      })
      return
    }
    if (!confirm('Deseja realmente excluir este template?')) return
    await supabase.from('email_templates').delete().eq('id', template.id)
    toast({ title: 'Sucesso', description: 'Template excluído.' })
    fetchTemplates()
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <FileText className="h-8 w-8" />
            Templates de E-mail
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os modelos de mensagens para {activeTenant?.name || 'esta organização'}.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Novo Template
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Assunto Padrão</TableHead>
                  <TableHead>Escopo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="text-muted-foreground">{t.subject}</TableCell>
                    <TableCell>
                      {t.tenant_id ? (
                        <span className="text-xs text-blue-600 font-medium">Personalizado</span>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">Global</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenModal(t)}
                        disabled={!t.tenant_id}
                        title={
                          !t.tenant_id ? 'Templates globais não podem ser editados aqui' : 'Editar'
                        }
                      >
                        <Edit className={`h-4 w-4 ${!t.tenant_id ? 'opacity-30' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(t)}
                        disabled={!t.tenant_id}
                        title={
                          !t.tenant_id
                            ? 'Templates globais não podem ser excluídos aqui'
                            : 'Excluir'
                        }
                      >
                        <Trash2 className={`h-4 w-4 ${!t.tenant_id ? 'opacity-30' : ''}`} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {templates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum template cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTemplate ? 'Editar Template' : 'Novo Template'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome Identificador (Ex: Boas-vindas)</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Assunto do E-mail</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Corpo da Mensagem</Label>
              <Textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Utilize texto plano. Quebras de linha serão respeitadas."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
