import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Building2, MoreVertical, ShieldAlert, Loader2 } from 'lucide-react'
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

export default function Tenants() {
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTenants = async () => {
      const { data } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setTenants(data)
      setLoading(false)
    }
    fetchTenants()
  }, [])

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
                  <TableHead>Maturidade Inicial (Perfil)</TableHead>
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
                      ) : (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          Rascunho
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${t.status === 'active' ? 'bg-primary' : 'bg-muted-foreground'}`}
                            style={{ width: t.status === 'active' ? '100%' : '30%' }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {t.status === 'active' ? 'Completo' : 'Incompleto'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
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
    </div>
  )
}
