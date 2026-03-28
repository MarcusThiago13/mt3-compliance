-- Make audit_logs insert-only by preventing UPDATE and DELETE
CREATE OR REPLACE FUNCTION public.prevent_audit_log_modification()
RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'Os registros de auditoria (audit_logs) são imutáveis e não podem ser alterados ou excluídos.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_audit_update ON public.audit_logs;
CREATE TRIGGER trg_prevent_audit_update
BEFORE UPDATE ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_modification();

DROP TRIGGER IF EXISTS trg_prevent_audit_delete ON public.audit_logs;
CREATE TRIGGER trg_prevent_audit_delete
BEFORE DELETE ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_modification();
