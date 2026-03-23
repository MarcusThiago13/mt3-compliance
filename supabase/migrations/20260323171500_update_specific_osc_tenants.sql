-- Migration to automatically configure specific tenants as Educational OSCs
DO $$
BEGIN
  -- Atualizar ASEC para OSC Educacional
  UPDATE public.tenants
  SET 
    org_type = 'osc', 
    org_subtype = 'educacional'
  WHERE name ILIKE '%ASEC%' OR name ILIKE '%Associação Educacional Comunitária%';

  -- Atualizar Hello Kids para OSC Educacional
  UPDATE public.tenants
  SET 
    org_type = 'osc', 
    org_subtype = 'educacional'
  WHERE name ILIKE '%Hello Kids%';
END $$;
