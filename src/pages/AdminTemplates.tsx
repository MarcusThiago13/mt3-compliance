import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, FileText, Loader2, ArrowLeft } from 'lucide-react'
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

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)

  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    const { data } = await supabase.from('email_templates').select('*').order('name')
    if (data) setTemplates(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleOpenModal = (template?: any) => {
    if (template) {
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
        await supabase.from('email_templates').insert({ name, subject, body })
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

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este template?')) return
    await supabase.from('email_templates').delete().eq('id', id)
    toast({ title: 'Sucesso', description: 'Template excluído.' })
    fetchTemplates()
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-3 text-muted-foreground">
            <Link to="/tenants">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Templates de E-mail
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os modelos de mensagens disparadas pelo sistema.
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
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="text-muted-foreground">{t.subject}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(t)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(t.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {templates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
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
