import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  UploadCloud,
  CheckCircle2,
  FileText,
  ArrowRight,
  AlertTriangle,
  ScanLine,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

interface OcrModalProps {
  isOpen: boolean
  onClose: () => void
  lines: any[]
  onSuccess: () => void
}

export default function OcrModal({ isOpen, onClose, lines, onSuccess }: OcrModalProps) {
  const [step, setStep] = useState<'upload' | 'processing' | 'review'>('upload')
  const [files, setFiles] = useState<File[]>([])
  const [extractedData, setExtractedData] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const pendingDebits = lines.filter(
    (l: any) => l.transaction_type === 'debit' && l.status === 'Importada',
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files)
      setFiles(selected)
      processFiles(selected)
    }
  }

  const processFiles = (selectedFiles: File[]) => {
    setStep('processing')

    // Simula o tempo de processamento do motor de IA OCR
    setTimeout(() => {
      const mockedExtractions = selectedFiles.map((f, i) => {
        // Tenta mockar com base em um débito pendente para demonstrar o auto-matching
        const targetLine = pendingDebits[i % pendingDebits.length]
        return {
          fileName: f.name,
          providerName: 'Fornecedor Identificado OCR S/A',
          providerDocument: '00.111.222/0001-33',
          invoiceNumber: `NF-${Math.floor(1000 + Math.random() * 9000)}`,
          invoiceDate: targetLine
            ? targetLine.transaction_date
            : new Date().toISOString().split('T')[0],
          amount: targetLine ? targetLine.amount : 1500.0,
          categoryCode: '2.1', // Material de Consumo
        }
      })

      setExtractedData(mockedExtractions)

      // Lógica de Matching (Nexo Causal Automático)
      const newMatches = mockedExtractions.map((ext) => {
        const match = pendingDebits.find(
          (l: any) =>
            l.amount === ext.amount && new Date(l.transaction_date) >= new Date(ext.invoiceDate),
        )
        return { extraction: ext, matchedLine: match }
      })

      setMatches(newMatches)
      setStep('review')
    }, 2500)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      for (const m of matches) {
        if (m.matchedLine) {
          const updates = {
            classification: 'Despesa Elegível',
            status: 'Conciliada',
            provider_name: m.extraction.providerName,
            provider_document: m.extraction.providerDocument.replace(/\D/g, ''),
            invoice_number: m.extraction.invoiceNumber,
            invoice_date: m.extraction.invoiceDate,
            category_code: m.extraction.categoryCode,
            updated_at: new Date().toISOString(),
          }
          await supabase
            .from('osc_bank_statement_lines' as any)
            .update(updates)
            .eq('id', m.matchedLine.id)
        }
      }
      toast({ title: 'Sucesso', description: 'Notas processadas e vinculadas aos lançamentos.' })
      onSuccess()
      handleClose()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    setStep('upload')
    setFiles([])
    setExtractedData([])
    setMatches([])
    onClose()
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Leitura Inteligente de Notas (OCR)</DialogTitle>
          <DialogDescription>
            Faça o upload de notas fiscais ou guias. A IA extrairá os dados e conectará
            automaticamente aos lançamentos bancários pendentes.
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div
            className="border-2 border-dashed border-purple-200 bg-purple-50/50 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="font-semibold text-purple-900 text-lg mb-1">
              Clique ou arraste arquivos aqui
            </h3>
            <p className="text-sm text-purple-700 max-w-md">
              Suporta PDF, JPG e PNG. As notas serão lidas e vinculadas aos débitos importados no
              extrato.
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <Button className="mt-6 bg-purple-600 hover:bg-purple-700">
              Selecionar Documentos
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping opacity-20"></div>
              <ScanLine className="h-16 w-16 text-purple-600 animate-pulse relative z-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Processando {files.length} documento(s)...
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Extraindo CNPJ, valores e verificando conciliação com o extrato.
            </p>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <h4 className="font-medium text-slate-800">Resultado do Matching Inteligente</h4>
            {matches.map((m, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="bg-white p-2 rounded border shadow-sm">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {m.extraction.fileName}
                    </p>
                    <div className="text-xs text-muted-foreground mt-1 space-y-0.5 font-mono">
                      <p>
                        NF: {m.extraction.invoiceNumber} | Data:{' '}
                        {new Date(m.extraction.invoiceDate).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="truncate">
                        Fornecedor: {m.extraction.providerName} ({m.extraction.providerDocument})
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-2 bg-blue-50 text-blue-700 border-blue-200"
                    >
                      Extraído: {formatCurrency(m.extraction.amount)}
                    </Badge>
                  </div>
                </div>

                <ArrowRight className="hidden sm:block h-5 w-5 text-slate-300 shrink-0" />

                <div className="bg-white p-3 rounded border w-full sm:w-[280px] shrink-0">
                  {m.matchedLine ? (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-700">Linha Encontrada</span>
                      </div>
                      <p
                        className="text-xs font-mono text-slate-600 truncate"
                        title={m.matchedLine.description}
                      >
                        {m.matchedLine.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Débito em:{' '}
                        {new Date(m.matchedLine.transaction_date).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm font-bold text-red-600 mt-1">
                        Saída: {formatCurrency(m.matchedLine.amount)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-bold text-amber-700">Sem Vínculo</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Nenhum débito correspondente encontrado (valor ou data divergem).
                      </p>
                      <Button variant="link" size="sm" className="px-0 h-auto mt-2 text-blue-600">
                        Vincular Manualmente
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {step === 'review' ? 'Cancelar' : 'Fechar'}
          </Button>
          {step === 'review' && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Vinculações
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
