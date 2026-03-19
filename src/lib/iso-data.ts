export type IsoPhase = 'Plan' | 'Do' | 'Check' | 'Act'

export interface IsoClause {
  id: string
  title: string
  description: string
  phase: IsoPhase
  parent?: string
}

export const ISO_CLAUSES: IsoClause[] = [
  {
    id: '4',
    title: 'Contexto da Organização',
    description: 'Compreensão do contexto.',
    phase: 'Plan',
  },
  {
    id: '4.1',
    title: 'Entendendo a organização e seu contexto',
    description: 'Determinar questões externas e internas.',
    phase: 'Plan',
    parent: '4',
  },
  {
    id: '4.2',
    title: 'Entendendo as necessidades das partes interessadas',
    description: 'Determinar partes interessadas e seus requisitos.',
    phase: 'Plan',
    parent: '4',
  },
  {
    id: '4.3',
    title: 'Determinando o escopo do sistema de gestão',
    description: 'Determinar limites e aplicabilidade.',
    phase: 'Plan',
    parent: '4',
  },
  {
    id: '4.4',
    title: 'Sistema de gestão de compliance',
    description: 'Estabelecer, implementar e manter o SGC.',
    phase: 'Plan',
    parent: '4',
  },
  {
    id: '4.5',
    title: 'Obrigações de compliance',
    description: 'Identificar as obrigações aplicáveis.',
    phase: 'Plan',
    parent: '4',
  },
  {
    id: '4.6',
    title: 'Avaliação de riscos de compliance',
    description: 'Identificar, analisar e avaliar riscos.',
    phase: 'Plan',
    parent: '4',
  },
  { id: '5', title: 'Liderança', description: 'Liderança e comprometimento.', phase: 'Plan' },
  {
    id: '5.1',
    title: 'Liderança e comprometimento',
    description: 'A alta direção deve demonstrar liderança.',
    phase: 'Plan',
    parent: '5',
  },
  {
    id: '5.2',
    title: 'Política de compliance',
    description: 'Estabelecer a política de compliance.',
    phase: 'Plan',
    parent: '5',
  },
  {
    id: '5.3',
    title: 'Papéis, responsabilidades e autoridades',
    description: 'Atribuir responsabilidades e autoridades.',
    phase: 'Plan',
    parent: '5',
  },
  { id: '6', title: 'Planejamento', description: 'Ações para abordar riscos.', phase: 'Plan' },
  {
    id: '6.1',
    title: 'Ações para abordar riscos e oportunidades',
    description: 'Planejar ações e integrar ao SGC.',
    phase: 'Plan',
    parent: '6',
  },
  {
    id: '6.2',
    title: 'Objetivos de compliance e planejamento',
    description: 'Estabelecer objetivos e planejar o alcance.',
    phase: 'Plan',
    parent: '6',
  },
  {
    id: '6.3',
    title: 'Planejamento de mudanças',
    description: 'Realizar mudanças de forma planejada.',
    phase: 'Plan',
    parent: '6',
  },
  { id: '7', title: 'Apoio', description: 'Recursos, competência, conscientização.', phase: 'Do' },
  {
    id: '7.1',
    title: 'Recursos',
    description: 'Determinar e prover recursos necessários.',
    phase: 'Do',
    parent: '7',
  },
  {
    id: '7.2',
    title: 'Competência e treinamento',
    description: 'Determinar competência e treinar pessoal.',
    phase: 'Do',
    parent: '7',
  },
  {
    id: '7.3',
    title: 'Conscientização',
    description: 'Garantir conscientização sobre a política.',
    phase: 'Do',
    parent: '7',
  },
  {
    id: '7.4',
    title: 'Comunicação',
    description: 'Determinar comunicações internas e externas.',
    phase: 'Do',
    parent: '7',
  },
  {
    id: '7.5',
    title: 'Informação documentada',
    description: 'Criar e atualizar documentos.',
    phase: 'Do',
    parent: '7',
  },
  { id: '8', title: 'Operação', description: 'Planejamento e controle operacional.', phase: 'Do' },
  {
    id: '8.1',
    title: 'Planejamento e controle operacional',
    description: 'Planejar, implementar e controlar processos.',
    phase: 'Do',
    parent: '8',
  },
  {
    id: '8.2',
    title: 'Estabelecendo controles e procedimentos',
    description: 'Implementar controles para gerenciar obrigações.',
    phase: 'Do',
    parent: '8',
  },
  {
    id: '8.3',
    title: 'Levantamento de preocupações (Canal de Denúncias)',
    description: 'Mecanismo para relatar violações.',
    phase: 'Do',
    parent: '8',
  },
  {
    id: '8.4',
    title: 'Processo de investigação',
    description: 'Avaliar e investigar relatos de violações.',
    phase: 'Do',
    parent: '8',
  },
  {
    id: '9',
    title: 'Avaliação de Desempenho',
    description: 'Monitoramento, medição, análise.',
    phase: 'Check',
  },
  {
    id: '9.1',
    title: 'Monitoramento, medição e análise',
    description: 'Monitorar desempenho de compliance.',
    phase: 'Check',
    parent: '9',
  },
  {
    id: '9.2',
    title: 'Auditoria interna',
    description: 'Conduzir auditorias internas a intervalos.',
    phase: 'Check',
    parent: '9',
  },
  {
    id: '9.3',
    title: 'Revisão pela direção',
    description: 'A alta direção deve revisar o SGC.',
    phase: 'Check',
    parent: '9',
  },
  {
    id: '10',
    title: 'Melhoria',
    description: 'Melhoria contínua, não conformidade e ação corretiva.',
    phase: 'Act',
  },
  {
    id: '10.1',
    title: 'Melhoria contínua',
    description: 'Melhorar continuamente a adequação do SGC.',
    phase: 'Act',
    parent: '10',
  },
  {
    id: '10.2',
    title: 'Não conformidade e ação corretiva',
    description: 'Reagir à não conformidade e tomar ações.',
    phase: 'Act',
    parent: '10',
  },
]

export const getClausesByParent = (parentId: string) =>
  ISO_CLAUSES.filter((c) => c.parent === parentId)
export const getParentClauses = () => ISO_CLAUSES.filter((c) => !c.parent)
