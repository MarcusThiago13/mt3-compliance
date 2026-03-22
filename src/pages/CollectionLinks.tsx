import { useEffect, useState } from 'react'
import { Share2, Link as LinkIcon, Loader2, Copy } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import { SendCommunicationModal } from '@/components/shared/SendCommunicationModal'

export default function CollectionLinks() {
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState<{ subject: string; body: string; tenantId?: string }>({
    subject: '',
    body: '',
  })

  useEffect(() => {
    const fetchTenants = async () => {
      setLoading(true)
      const { data } = await supabase.from('tenants').select('*').order('name')
      if (data) setTenants(data)
      setLoading(false)
    }
    fetchTenants()
  }, [])

  const handleCopyLink = (tenantId: string) => {
    const link = `${window.location.origin}/f/${tenantId}`
    navigator.clipboard.writeText(link)
    toast({
      title: 'Link copiado!',
      description: 'O link de coleta foi copiado para a área de transferência.',
    })
  }

  const handleShare = (tenant: any) => {
    const link = `${window.location.origin}/f/${tenant.id}`
    setModalData({
      subject: `Link de Coleta de Dados - ${tenant.name}`,
      body: `Olá,\n\nPor favor, utilize o link abaixo para acessar o formulário de coleta de dados e evidências da organização ${tenant.name}:\n\n${link}\n\nAtenciosamente,\nEquipe mt3 Compliance`,
      tenantId: tenant.id,
    })
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <LinkIcon className="h-8 w-8" />
          Links de Coleta
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie e compartilhe links públicos para coleta de evidências e dados externos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Links Públicos por Organização</CardTitle>
          <CardDescription>
            Compartilhe estes links com terceiros ou colaboradores para o preenchimento de
            formulários de compliance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organização</TableHead>
                  <TableHead>Link de Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-xs text-muted-foreground">
                        {window.location.origin}/f/{t.id.substring(0, 8)}...
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleCopyLink(t.id)}>
                          <Copy className="h-4 w-4 mr-2" /> Copiar
                        </Button>
                        <Button size="sm" onClick={() => handleShare(t)}>
                          <Share2 className="h-4 w-4 mr-2" /> Enviar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {tenants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Nenhuma organização encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SendCommunicationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultSubject={modalData.subject}
        defaultBody={modalData.body}
        tenantId={modalData.tenantId}
      />
    </div>
  )
}
