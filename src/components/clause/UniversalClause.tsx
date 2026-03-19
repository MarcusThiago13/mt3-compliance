import { IsoClause } from '@/lib/iso-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  History,
  Sparkles,
  Loader2,
  Calendar,
  FileText,
} from 'lucide-react'
import { EvidenceTab } from './EvidenceTab'
import { CommentsTab } from './CommentsTab'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { callAnthropicMessage } from '@/lib/anthropic'
import { complianceService } from '@/services/compliance'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'

// Specific Modules
import { OrganizationContext } from './specific/OrganizationContext'
import { Stakeholders } from './specific/Stakeholders'
import { ScopeSGC } from './specific/ScopeSGC'
import { FunctionalDashboard } from './specific/FunctionalDashboard'
import { Obligations } from './specific/Obligations'
import { RiskAssessment } from './specific/RiskAssessment'
import { LeadershipCommitment } from './specific/LeadershipCommitment'
import { CompliancePolicy } from './specific/CompliancePolicy'
import { ResponsibilityMatrix } from './specific/ResponsibilityMatrix'
import { ActionsRiskOpp61 } from './specific/ActionsRiskOpp61'
import { ComplianceObjectives62 } from './specific/ComplianceObjectives62'
import { ChangePlanning63 } from './specific/ChangePlanning63'
import { Resources71 } from './specific/Resources71'
import { Competence72 } from './specific/Competence72'
import { Awareness73 } from './specific/Awareness73'
import { Communication74 } from './specific/Communication74'
import { DocumentedInfo75 } from './specific/DocumentedInfo75'

// Module 8 Specific components
import { Module8Overview } from './specific/Module8Overview'
import { OpPlanningControl81 } from './specific/OpPlanningControl81'
import { EstablishingControls82 } from './specific/EstablishingControls82'
import { WhistleblowingCanal } from './specific/WhistleblowingCanal'
import { InvestigationWorkflow } from './specific/InvestigationWorkflow'

// Module 9 Specific components
import { Module9Overview } from './specific/Module9Overview'
import { MonitoringEvaluation91 } from './specific/MonitoringEvaluation91'
import { InternalAudit92 } from './specific/InternalAudit92'
import { ManagementReview93 } from './specific/ManagementReview93'

// Module 10 Specific components
import { Module10Overview } from './specific/Module10Overview'
import { ContinualImprovement101 } from './specific/ContinualImprovement101'
import { Nonconformity102 } from './specific/Nonconformity102'

export function UniversalClause({ clause }: { clause: IsoClause }) {
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [useSonnet, setUseSonnet] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { user } = useAuth()
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [nextReview, setNextReview] = useState('')

  useEffect(() => {
    if (clause.id) complianceService.getAuditLogs(clause.id).then(setAuditLogs)
  }, [clause.id])

  const handleStatusChange = async (val: string) => {
    if (clause.id) {
      await complianceService.addAuditLog(
        clause.id,
        `Status alterado para ${val}`,
        user?.email || 'Sistema',
      )
      const logs = await complianceService.getAuditLogs(clause.id)
      setAuditLogs(logs)
      toast({ title: 'Status Atualizado', description: 'Log de auditoria registrado (ISO 7.5)' })
    }
  }

  const handleSchedule = async () => {
    if (clause.id && nextReview) {
      await complianceService.addAssessmentSchedule(clause.id, nextReview)
      toast({
        title: 'Auto-Avaliação Agendada',
        description: 'O workflow será ativado na data definida.',
      })
      setNextReview('')
    }
  }

  const handleExportDossier = async () => {
    try {
      const res = await complianceService.generateDossier(clause.id)
      toast({ title: 'Dossier PDF/A Gerado', description: res.message })
      window.open(res.url, '_blank')
    } catch (e: any) {
      toast({ title: 'Erro ao gerar Dossier', description: e.message, variant: 'destructive' })
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setIsDialogOpen(true)
    const prompt = `Liste as evidências necessárias para o requisito: ${clause.id} - ${clause.title}. Descrição: ${clause.description}`
    const response = await callAnthropicMessage(prompt, 1024, useSonnet)
    setAiAnalysis(response)
    setIsAnalyzing(false)
  }

  const renderSpecificContent = () => {
    switch (clause.id) {
      case '4.1':
        return <OrganizationContext />
      case '4.2':
        return <Stakeholders />
      case '4.3':
        return <ScopeSGC />
      case '4.4':
        return <FunctionalDashboard />
      case '4.5':
        return <Obligations />
      case '4.6':
        return <RiskAssessment />
      case '5.1':
        return <LeadershipCommitment />
      case '5.2':
        return <CompliancePolicy />
      case '5.3':
        return <ResponsibilityMatrix />
      case '6.1':
        return <ActionsRiskOpp61 />
      case '6.2':
        return <ComplianceObjectives62 />
      case '6.3':
        return <ChangePlanning63 />
      case '7.1':
        return <Resources71 />
      case '7.2':
        return <Competence72 />
      case '7.3':
        return <Awareness73 />
      case '7.4':
        return <Communication74 />
      case '7.5':
        return <DocumentedInfo75 />
      case '8':
        return <Module8Overview />
      case '8.1':
        return <OpPlanningControl81 />
      case '8.2':
        return <EstablishingControls82 />
      case '8.3':
        return <WhistleblowingCanal />
      case '8.4':
        return <InvestigationWorkflow />
      case '9':
        return <Module9Overview />
      case '9.1':
        return <MonitoringEvaluation91 />
      case '9.2':
        return <InternalAudit92 />
      case '9.3':
        return <ManagementReview93 />
      case '10':
        return <Module10Overview />
      case '10.1':
        return <ContinualImprovement101 />
      case '10.2':
        return <Nonconformity102 />
      default:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Descrição e Controles Aplicados</h3>
            <Textarea
              className="min-h-[200px]"
              placeholder="Descreva aqui como a organização atende a este requisito da norma..."
              defaultValue="A organização estabeleceu, implementou, mantém e melhora continuamente o seu sistema de gestão de compliance conforme os requisitos deste item..."
            />
          </div>
        )
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border shadow-sm border-l-4 border-l-primary">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              {clause.phase}
            </Badge>
            <span className="text-sm font-bold text-primary">Item {clause.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{clause.title}</h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-3xl">{clause.description}</p>
        </div>

        <div className="flex flex-col gap-2 md:items-end w-full md:w-auto mt-2 md:mt-0">
          <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-md w-full md:w-auto">
            <span className="text-sm font-medium">Status:</span>
            <Select defaultValue="conforme" onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conforme">
                  <div className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-success" /> Conforme
                  </div>
                </SelectItem>
                <SelectItem value="obs">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" /> Em Observação
                  </div>
                </SelectItem>
                <SelectItem value="nconf">
                  <div className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4 text-destructive" /> Não Conforme
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 mt-1 justify-end w-full">
            <div className="flex items-center space-x-2 mr-2">
              <Switch id="use-sonnet" checked={useSonnet} onCheckedChange={setUseSonnet} />
              <Label htmlFor="use-sonnet" className="text-xs text-muted-foreground cursor-pointer">
                Usar Sonnet
              </Label>
            </div>
            <Button
              onClick={handleAnalyze}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Análise de Requisito
            </Button>
            <Button
              onClick={handleExportDossier}
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5"
            >
              <FileText className="mr-2 h-4 w-4" /> Dossier PDF/A
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="main">Conteúdo</TabsTrigger>
          <TabsTrigger value="evidence">Evidências</TabsTrigger>
          <TabsTrigger value="comments">Comentários</TabsTrigger>
          <TabsTrigger value="history">Histórico (ISO 7.5)</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="main" className="outline-none">
            <Card>
              <CardContent className="pt-6">{renderSpecificContent()}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evidence">
            <Card>
              <CardContent className="pt-6">
                <EvidenceTab clause={clause} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comments">
            <Card>
              <CardContent className="pt-6">
                <CommentsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex flex-col gap-3 pb-6 border-b">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Auto-Avaliação (Self-Assessment)
                  </h4>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={nextReview}
                      onChange={(e) => setNextReview(e.target.value)}
                      className="w-[180px]"
                    />
                    <Button onClick={handleSchedule} size="sm">
                      Agendar Próxima Revisão
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    O sistema notificará os responsáveis nesta data para garantir melhoria contínua
                    (ISO 10.1).
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" /> Trilha de Auditoria (Audit Trail
                    Imutável)
                  </h4>
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 text-sm bg-muted/30 p-3 rounded-md border border-dashed"
                    >
                      <div className="bg-primary/10 p-2 rounded-full shrink-0">
                        <History className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Por <strong>{log.user_email}</strong> em{' '}
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <p className="text-muted-foreground text-sm">Nenhum histórico registrado.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Análise Inteligente de Requisito
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 min-h-[100px]">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-purple-600" />
                <p>Analisando requisito com Claude AI...</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                {aiAnalysis}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
