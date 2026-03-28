-- Add new classification dimensions to tenants table to support multi-dimensional trails
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS public_relations text DEFAULT 'nao',
ADD COLUMN IF NOT EXISTS acting_areas jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.tenants.public_relations IS 'Indicates if the organization has relations with public entities (sim, nao, oculto)';
COMMENT ON COLUMN public.tenants.acting_areas IS 'Array of strings representing the action areas of the organization';
