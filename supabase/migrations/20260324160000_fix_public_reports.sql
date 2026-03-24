-- Adiciona uma função RPC com SECURITY DEFINER para permitir que usuários anônimos
-- (denunciantes) consigam resgatar os detalhes do seu próprio relato sem ferir o RLS,
-- uma vez que eles já provaram a identidade através do check_report_credentials.
CREATE OR REPLACE FUNCTION public.get_public_report_details(p_report_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_report jsonb;
BEGIN
  SELECT jsonb_build_object(
    'id', id,
    'protocol_number', protocol_number,
    'status', status,
    'created_at', created_at,
    'category', category
  ) INTO v_report
  FROM public.whistleblower_reports
  WHERE id = p_report_id;
  
  RETURN v_report;
END;
$$;
