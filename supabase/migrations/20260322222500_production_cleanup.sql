-- Migration to clean up all illustrative and mock data for real operation
-- Preserves tenants, users, templates and core structural data
DO $$ 
BEGIN
  -- 1. Purge Operational Data (Cascading where necessary, but explicit for clarity)
  DELETE FROM public.compliance_history;
  DELETE FROM public.audit_logs;
  DELETE FROM public.communication_logs;
  DELETE FROM public.document_versions;
  DELETE FROM public.compliance_documents;
  DELETE FROM public.report_messages;
  DELETE FROM public.whistleblower_reports;
  DELETE FROM public.dd_red_flags;
  DELETE FROM public.due_diligence_processes;
  DELETE FROM public.dd_conflict_declarations;
  DELETE FROM public.risk_assessments;
  DELETE FROM public.risk_treatments;
  DELETE FROM public.risk_controls;
  DELETE FROM public.risk_register;
  DELETE FROM public.controls_library;
  DELETE FROM public.evidence_requests;
  DELETE FROM public.evidence_metadata;
  DELETE FROM public.assessment_schedules;
  DELETE FROM public.gaps;
  DELETE FROM public.risks;
  
  -- We leave ai_usage_logs intact as it's an audit trail of system usage
  -- We leave form_collection_tokens intact
  -- We leave document_templates intact (The 16 standard templates)
  -- We leave email_templates intact
  -- We leave risk_methodologies & risk_methodology_versions intact
  -- We leave tenants and user_tenants intact to preserve the organizations

  -- 2. Reset active status to guarantee proper access
  UPDATE public.tenants SET status = 'active' WHERE status IS NULL OR status = 'draft';

END $$;
