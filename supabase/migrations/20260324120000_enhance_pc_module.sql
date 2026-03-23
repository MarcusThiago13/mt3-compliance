-- Enhance Prestação de Contas module with fields for DID and Glosas
ALTER TABLE public.osc_bank_statement_lines
ADD COLUMN IF NOT EXISTS gross_value NUMERIC(15, 2);

ALTER TABLE public.osc_accountability_diligences
ADD COLUMN IF NOT EXISTS glosa_amount NUMERIC(15, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS glosa_reason TEXT;
