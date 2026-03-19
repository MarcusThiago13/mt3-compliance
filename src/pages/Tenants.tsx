import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  Building2,
  MoreVertical,
  ShieldAlert,
  Loader2,
  Edit,
  Power,
  Trash2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/hooks/use-toast'

export default function Tenants() {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tenantToDelete, setTenantToDelete] = useState<any>(null)

  const fetchTenants = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setTenants(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  const handleToggleStatus = async (tenant: any) => {
    const newStatus = tenant.status === 'active' ? 'inactive' : 'active'
    const { error } = await supabase
      .from('tenants')
      .update({ status: newStatus })
      .eq('id', tenant.id)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Sucesso',
        description: `Status alterado para ${newStatus === 'active' ? 'Ativo' : 'Inativo'}.`,
      })
      fetchTenants()
    }
  }

  const handleDelete = async () => {
    if (!tenantToDelete) return
    const { error } = await supabase.from('tenants').delete().eq('id', tenantToDelete.id)
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o cliente.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Sucesso', description: 'Cliente excluído com sucesso.' })
      fetchTenants()
    }
    setTenantToDelete(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestão de Clientes (Tenants)</h1>
          <p className="text-muted-foreground">Administração multi-tenant do sistema</p>
        </div>
        <Button asChild>
          <Link to="/onboarding">
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Organizações Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" /> Carregando clientes...
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-12 animate-in fade-in zoom-in-95">
              <Building2 className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-medium text-foreground">Nenhum cliente cadastrado</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Sua lista de tenants está vazia. Inicie o onboarding para registrar o primeiro
                cliente e mapear seu perfil corporativo.
              </p>
              <Button asChild>
                <Link to="/onboarding">
                  <Plus className="mr-2 h-4 w-4" /> Cadastrar Primeiro Cliente
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Organização</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="text-muted-foreground">{t.cnpj || '-'}</TableCell>
                    <TableCell>
                      {t.status === 'active' ? (
                        <Badge className="bg-success hover:bg-success text-white">Ativo</Badge>
                      ) : t.status === 'inactive' ? (
                        <Badge variant="destructive">Inativo</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          Rascunho
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/onboarding?id=${t.id}`)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(t)}>
                            <Power className="mr-2 h-4 w-4" />{' '}
                            {t.status === 'active' ? 'Inativar' : 'Ativar'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setTenantToDelete(t)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 flex items-start gap-4 shadow-sm">
        <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-amber-800">Isolamento de Dados Garantido</h4>
          <p className="text-xs text-amber-700 mt-1">
            A arquitetura multi-tenant assegura que cada cliente possua banco de dados virtualizado
            e isolado através de Row Level Security (RLS) na camada de dados. Relatórios e
            evidências do Clause 4.1 são segregados por Tenant ID.
          </p>
        </div>
      </div>

      <AlertDialog open={!!tenantToDelete} onOpenChange={(o) => !o && setTenantToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente <strong>{tenantToDelete?.name}</strong>? Esta
              ação não pode ser desfeita e todos os dados associados serão permanentemente perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
