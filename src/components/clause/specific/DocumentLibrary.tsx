import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, CheckSquare, Eye } from 'lucide-react'

export function DocumentLibrary() {
  const documents = [
    {
      id: 1,
      title: 'Política Anticorrupção',
      version: 'v2.1',
      status: 'Publicado',
      accepted: '98%',
      date: '10/10/2023',
    },
    {
      id: 2,
      title: 'Manual de Conduta',
      version: 'v1.0',
      status: 'Publicado',
      accepted: '100%',
      date: '15/08/2023',
    },
    {
      id: 3,
      title: 'Procedimento de Due Diligence',
      version: 'v3.0',
      status: 'Em Revisão',
      accepted: '-',
      date: '01/11/2023',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="font-semibold text-lg">Biblioteca de Documentos</h3>
          <p className="text-sm text-muted-foreground">
            Repositório com controle de versão e aceite eletrônico.
          </p>
        </div>
        <Button>Novo Documento</Button>
      </div>

      <div className="grid gap-3">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <FileText className="h-8 w-8 text-primary mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold">{doc.title}</h5>
                    <Badge variant="outline" className="text-[10px]">
                      {doc.version}
                    </Badge>
                    <Badge
                      className={
                        doc.status === 'Publicado'
                          ? 'bg-success hover:bg-success'
                          : 'bg-amber-500 hover:bg-amber-600'
                      }
                    >
                      {doc.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Atualizado em {doc.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                {doc.status === 'Publicado' && (
                  <div className="text-center px-4 border-r">
                    <p className="text-xs text-muted-foreground">Aceite Eletrônico</p>
                    <p className="font-bold text-sm text-success flex items-center justify-center gap-1">
                      <CheckSquare className="h-3 w-3" /> {doc.accepted}
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
