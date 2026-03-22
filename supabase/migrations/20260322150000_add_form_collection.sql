-- Migration for Form Collection
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS context_data JSONB DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS public.form_collection_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL,
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.form_collection_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_tokens" ON public.form_collection_tokens;
CREATE POLICY "auth_all_tokens" ON public.form_collection_tokens 
  FOR ALL TO authenticated USING (is_tenant_member_uuid(tenant_id)) WITH CHECK (is_tenant_member_uuid(tenant_id));

DROP POLICY IF EXISTS "anon_read_tokens" ON public.form_collection_tokens;
CREATE POLICY "anon_read_tokens" ON public.form_collection_tokens 
  FOR SELECT TO anon USING (is_used = false AND expires_at > NOW());

CREATE OR REPLACE FUNCTION public.submit_form_collection(p_token uuid, p_payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_token_record record;
BEGIN
    SELECT * INTO v_token_record
    FROM public.form_collection_tokens
    WHERE token = p_token AND is_used = false AND expires_at > NOW();

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Token inválido ou expirado.';
    END IF;

    IF v_token_record.form_type = 'onboarding' THEN
        UPDATE public.tenants
        SET 
            step_1 = COALESCE(p_payload->'step_1', step_1),
            step_2 = COALESCE(p_payload->'step_2', step_2),
            step_3 = COALESCE(p_payload->'step_3', step_3),
            step_4 = COALESCE(p_payload->'step_4', step_4),
            step_5 = COALESCE(p_payload->'step_5', step_5),
            step_6 = COALESCE(p_payload->'step_6', step_6),
            name = COALESCE(p_payload->'step_1'->>'razao_social', name),
            cnpj = COALESCE(p_payload->'step_1'->>'cnpj', cnpj)
        WHERE id = v_token_record.tenant_id;
    ELSIF v_token_record.form_type = 'context' THEN
        UPDATE public.tenants
        SET context_data = p_payload
        WHERE id = v_token_record.tenant_id;
    END IF;

    UPDATE public.form_collection_tokens
    SET is_used = true
    WHERE id = v_token_record.id;

    INSERT INTO public.audit_logs (tenant_id, clause_id, action, user_email)
    VALUES (v_token_record.tenant_id, 'form_collection', 'Dados recebidos via formulário externo (' || v_token_record.form_type || ')', 'cliente_externo');

    RETURN jsonb_build_object('success', true, 'tenant_id', v_token_record.tenant_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_form_collection(uuid, jsonb) TO anon;
