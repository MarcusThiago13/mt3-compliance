-- V3 Security Audit Hardening
-- Adiciona rastreamento estruturado profundo (metadados JSONB) aos logs de auditoria
-- e fortifica as políticas de isolamento de uso de IA.

DO $BODY$
BEGIN
    -- 1. Adicionar coluna 'metadata' à tabela audit_logs para permitir injeção de contexto forense (IDs específicos)
    ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
    
    -- 2. Garantir que system_errors possua a coluna context definida (já deve existir, comando para segurança estrutural)
    ALTER TABLE public.system_errors ADD COLUMN IF NOT EXISTS context JSONB DEFAULT '{}'::jsonb;
    
    -- 3. Blindar os logs de consumo de Inteligência Artificial para visibilidade restrita
    DROP POLICY IF EXISTS "auth_read_ai_logs" ON public.ai_usage_logs;
    CREATE POLICY "auth_read_ai_logs" ON public.ai_usage_logs
      FOR SELECT TO authenticated 
      USING (
        (auth.jwt() ->> 'email'::text IN ('admin@example.com', 'marcusthiago.adv@gmail.com')) OR
        (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin') OR
        (((auth.jwt() -> 'user_metadata'::text) ->> 'is_admin'::text) = 'true') OR
        (tenant_id IS NOT NULL AND public.is_tenant_member_uuid(tenant_id))
      );

    -- 4. Fortalecer a Trigger do Sentinel (Motor de Detecção) para interpretar metadados de acesso a dados sensíveis (LGPD)
    CREATE OR REPLACE FUNCTION public.check_suspicious_audit_log()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $func$
    DECLARE
        v_tenant_uuid uuid;
        v_affected_data text := 'Dados Genéricos de Sistema';
        v_severity text := 'Média';
    BEGIN
        -- Conversão segura do UUID do Tenant
        BEGIN
            v_tenant_uuid := NEW.tenant_id::uuid;
        EXCEPTION WHEN OTHERS THEN
            v_tenant_uuid := NULL;
        END;

        -- Extração de pegadas forenses do metadado inserido no log
        IF NEW.metadata IS NOT NULL AND NEW.metadata->>'recordId' IS NOT NULL THEN
            v_affected_data := 'Registro Crítico ID: ' || SUBSTRING(NEW.metadata->>'recordId', 1, 8);
        END IF;

        -- Análise heurística das ações registradas no log
        IF v_tenant_uuid IS NOT NULL AND (
           NEW.action ILIKE '%acesso não autorizado%'
           OR NEW.action ILIKE '%falha de autenticação%'
           OR NEW.action ILIKE '%comportamento atípico%'
           OR NEW.action ILIKE '%tentativa de acesso%'
           OR NEW.action ILIKE '%Acesso LGPD:%'
        ) THEN
            
            -- Classificação Dinâmica de Severidade
            IF NEW.action ILIKE '%não autorizado%' OR NEW.action ILIKE '%tentativa de acesso%' THEN 
                v_severity := 'Crítica';
            ELSIF NEW.action ILIKE '%Acesso LGPD:%' THEN 
                v_severity := 'Baixa'; -- Registro informacional da política de Privacy by Design
                v_affected_data := 'Visualização Deliberada de Dados Sensíveis';
            ELSE 
                v_severity := 'Alta';
            END IF;

            -- Inserção na central de gerenciamento de incidentes do Sentinel
            INSERT INTO public.digital_incidents (
                tenant_id,
                title,
                incident_date,
                severity,
                status,
                description,
                affected_data
            ) VALUES (
                v_tenant_uuid,
                '🚨 Alerta do Sentinel: ' || NEW.action,
                CURRENT_DATE,
                v_severity,
                'Aberto',
                'O motor algorítmico do Sentinel registrou um evento operacional monitorado.' || CHR(10) ||
                'Usuário Identificado: ' || COALESCE(NEW.user_email, 'Anônimo/Desconhecido') || CHR(10) ||
                'Alvo Acessado: ' || NEW.clause_id,
                v_affected_data
            );
        END IF;

        RETURN NEW;
    END;
    $func$;

END $BODY$;
