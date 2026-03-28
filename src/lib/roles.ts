export const TENANT_ROLES = [
  { value: 'admin_tenant', label: 'Admin Local' },
  { value: 'compliance_officer', label: 'Compliance Officer' },
  { value: 'juridico', label: 'Jurídico' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'rh_trabalhista', label: 'RH / Trabalhista' },
  { value: 'encarregado_privacidade', label: 'Encarregado LGPD / DPO' },
  { value: 'auditor_interno', label: 'Auditor Interno' },
  { value: 'gestor_area', label: 'Gestor de Área' },
  { value: 'colaborador', label: 'Colaborador' },
  { value: 'visualizador', label: 'Visualizador' },
]

export const SYSTEM_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'assessor_admin', label: 'Assessor Admin' },
]

export const ALL_ROLES = [
  ...SYSTEM_ROLES,
  ...TENANT_ROLES,
  { value: 'admin', label: 'Admin (Legado)' },
  { value: 'editor', label: 'Editor (Legado)' },
  { value: 'auditor', label: 'Auditor (Legado)' },
  { value: 'consultant', label: 'Consultor (Legado)' },
  { value: 'viewer', label: 'Visualizador (Legado)' },
]
