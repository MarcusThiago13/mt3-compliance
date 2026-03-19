import { Link } from 'react-router-dom'
import { Plus, Building2, MoreVertical, ShieldAlert } from 'lucide-react'
import { useAppStore } from '@/stores/main'
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
  const { tenants } = useAppStore()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aderência SGC</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.cnpj}</TableCell>
                  <TableCell>
                    <Badge className="bg-success hover:bg-success">Ativo</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">75%</span>
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
        </CardContent>
      </Card>

      <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 flex items-start gap-4">
        <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-amber-800">Isolamento de Dados Garantido</h4>
          <p className="text-xs text-amber-700 mt-1">
            A arquitetura multi-tenant assegura que cada cliente possua banco de dados virtualizado
            e isolado através de Row Level Security (RLS) na camada de dados.
          </p>
        </div>
      </div>
    </div>
  )
}
