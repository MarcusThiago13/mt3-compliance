-- =================================================================================
-- SECURITY AUDIT FIXES: RLS Policies and Password Hashing
-- =================================================================================

-- 1. WHISTLEBLOWER REPORTS
DROP POLICY IF EXISTS "anon_insert_reports" ON public.whistleblower_reports;
-- Allow anonymous users to submit reports to any tenant
CREATE POLICY "anon_insert_reports" ON public.whistleblower_reports FOR INSERT TO anon WITH CHECK (true);
-- Require authenticated users to belong to the tenant to submit reports manually
CREATE POLICY "auth_insert_reports" ON public.whistleblower_reports FOR INSERT TO authenticated WITH CHECK (is_tenant_member_uuid(tenant_id));


-- 2. REPORT MESSAGES
-- Remove the permissive policies that leaked data across tenants
DROP POLICY IF EXISTS "anon_insert_messages" ON public.report_messages;
DROP POLICY IF EXISTS "anon_select_messages" ON public.report_messages;

-- Anonymous users (the whistleblowers) can read/write messages. 
-- Security relies on knowing the unguessable report_id (UUID).
CREATE POLICY "anon_select_messages" ON public.report_messages FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_messages" ON public.report_messages FOR INSERT TO anon WITH CHECK (true);

-- Authenticated users MUST belong to the tenant of the report to access messages
DROP POLICY IF EXISTS "auth_select_messages" ON public.report_messages;
CREATE POLICY "auth_select_messages" ON public.report_messages FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.whistleblower_reports wr
        WHERE wr.id = report_messages.report_id AND public.is_tenant_member_uuid(wr.tenant_id)
    )
);

DROP POLICY IF EXISTS "auth_insert_messages" ON public.report_messages;
CREATE POLICY "auth_insert_messages" ON public.report_messages FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.whistleblower_reports wr
        WHERE wr.id = report_messages.report_id AND public.is_tenant_member_uuid(wr.tenant_id)
    )
);


-- 3. DD RED FLAGS
-- Remove the completely open policies
DROP POLICY IF EXISTS "auth_select_ddrf" ON public.dd_red_flags;
DROP POLICY IF EXISTS "auth_insert_ddrf" ON public.dd_red_flags;
DROP POLICY IF EXISTS "auth_update_ddrf" ON public.dd_red_flags;

-- Restrict all operations to users who have access to the related due diligence process' tenant
CREATE POLICY "auth_select_ddrf" ON public.dd_red_flags FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.due_diligence_processes ddp
        WHERE ddp.id = dd_red_flags.process_id AND public.is_tenant_member_uuid(ddp.tenant_id)
    )
);

CREATE POLICY "auth_insert_ddrf" ON public.dd_red_flags FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.due_diligence_processes ddp
        WHERE ddp.id = dd_red_flags.process_id AND public.is_tenant_member_uuid(ddp.tenant_id)
    )
);

CREATE POLICY "auth_update_ddrf" ON public.dd_red_flags FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.due_diligence_processes ddp
        WHERE ddp.id = dd_red_flags.process_id AND public.is_tenant_member_uuid(ddp.tenant_id)
    )
);

CREATE POLICY "auth_delete_ddrf" ON public.dd_red_flags FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.due_diligence_processes ddp
        WHERE ddp.id = dd_red_flags.process_id AND public.is_tenant_member_uuid(ddp.tenant_id)
    )
);


-- 4. PASSWORD HASHING FOR SAFE ROOM
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.hash_report_password()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.access_password_hash IS NOT NULL THEN
    -- Only hash if it doesn't look like a bcrypt hash already
    IF NEW.access_password_hash NOT LIKE '$2a$%' THEN
      NEW.access_password_hash = crypt(NEW.access_password_hash, gen_salt('bf'));
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_hash_report_password ON public.whistleblower_reports;
CREATE TRIGGER trg_hash_report_password
BEFORE INSERT OR UPDATE OF access_password_hash
ON public.whistleblower_reports
FOR EACH ROW
EXECUTE FUNCTION public.hash_report_password();

-- Update existing passwords to be hashed (if any exist in plaintext)
DO $$
BEGIN
    UPDATE public.whistleblower_reports 
    SET access_password_hash = crypt(access_password_hash, gen_salt('bf'))
    WHERE access_password_hash NOT LIKE '$2a$%';
END $$;

-- Update the check_report_credentials function to verify the hash
CREATE OR REPLACE FUNCTION public.check_report_credentials(p_protocol text, p_password text)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_report_id UUID;
BEGIN
    SELECT id INTO v_report_id
    FROM public.whistleblower_reports
    WHERE protocol_number = p_protocol AND access_password_hash = crypt(p_password, access_password_hash)
    LIMIT 1;
    
    RETURN v_report_id;
END;
$$;
