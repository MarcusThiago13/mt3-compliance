DO $$
BEGIN
    -- 1. Create or replace the function that checks for suspicious audit logs
    CREATE OR REPLACE FUNCTION public.check_suspicious_audit_log()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $func$
    DECLARE
        v_tenant_uuid uuid;
    BEGIN
        -- Attempt to cast tenant_id from text to uuid safely
        BEGIN
            v_tenant_uuid := NEW.tenant_id::uuid;
        EXCEPTION WHEN OTHERS THEN
            v_tenant_uuid := NULL;
        END;

        -- Check if the action string contains suspicious keywords
        IF v_tenant_uuid IS NOT NULL AND (
           NEW.action ILIKE '%acesso não autorizado%'
           OR NEW.action ILIKE '%falha de autenticação%'
           OR NEW.action ILIKE '%comportamento atípico%'
           OR NEW.action ILIKE '%tentativa de acesso%'
        ) THEN
            -- Insert a high severity incident into digital_incidents
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
                '🚨 Alerta Sentinel: ' || NEW.action,
                CURRENT_DATE,
                'Alta',
                'Aberto',
                'O motor de monitoramento (Sentinel) detectou uma atividade suspeita nos logs de auditoria.' || CHR(10) ||
                'Usuário/IP: ' || COALESCE(NEW.user_email, 'Desconhecido') || CHR(10) ||
                'Recurso acessado: ' || NEW.clause_id,
                'Dados Pessoais Sensíveis'
            );
        END IF;

        RETURN NEW;
    END;
    $func$;

    -- 2. Drop the trigger if it already exists to ensure idempotency
    DROP TRIGGER IF EXISTS trg_check_suspicious_audit_log ON public.audit_logs;

    -- 3. Create the trigger on the audit_logs table
    CREATE TRIGGER trg_check_suspicious_audit_log
        AFTER INSERT ON public.audit_logs
        FOR EACH ROW
        EXECUTE FUNCTION public.check_suspicious_audit_log();

END $$;
