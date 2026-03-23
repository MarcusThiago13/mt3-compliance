import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScanLine, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function OcrModal({ isOpen, onClose, onSuccess }: any) {
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)

  const handleSimulateOCR = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setDone(true)
      toast({
        title: 'Leitura Concluída',
        description: 'A IA extraiu os dados e vinculou aos lançamentos do extrato com sucesso.',
      })
      if (onSuccess) onSuccess()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-blue-600" /> Motor de Leitura Assistida (OCR IA)
          </DialogTitle>
          <DialogDescription>
            Automatize a extração de dados de notas fiscais e comprovantes.
          </DialogDescription>
        </DialogHeader>

        <div className="py-8">
          {done ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-800">Processamento Finalizado</p>
              <p className="text-sm text-slate-600">Documentos lidos e pareados com o extrato.</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 text-center hover:bg-slate-50 transition-colors">
              <UploadCloud className="h-10 w-10 text-slate-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-700">Arraste os arquivos PDF/JPG aqui</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ou clique para selecionar na sua máquina
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {done ? 'Fechar' : 'Cancelar'}
          </Button>
          {!done && (
            <Button
              onClick={handleSimulateOCR}
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {processing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ScanLine className="h-4 w-4 mr-2" />
              )}{' '}
              Iniciar Leitura Inteligente
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
