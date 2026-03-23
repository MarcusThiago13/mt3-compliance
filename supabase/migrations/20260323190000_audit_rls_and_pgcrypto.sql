-- Enable pgcrypto just in case it is missing for the hash trigger
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. AI Usage Logs - Fix Data Leak (restrict to tenant or superadmin)
DROP POLICY IF EXISTS "auth_read_ai_logs" ON public.ai_usage_logs;
CREATE POLICY "auth_read_ai_logs" ON public.ai_usage_logs 
  FOR SELECT TO authenticated 
  USING (
    (tenant_id IS NULL AND (auth.jwt() ->> 'email' = 'admin@example.com')) OR
    (tenant_id IS NOT NULL AND public.is_tenant_member_uuid(tenant_id))
  );

-- 2. OSC Partnerships - Add WITH CHECK
DROP POLICY IF EXISTS "auth_all_osc_partnerships" ON public.osc_partnerships;
CREATE POLICY "auth_all_osc_partnerships" ON public.osc_partnerships 
  FOR ALL TO authenticated 
  USING (public.is_tenant_member_uuid(tenant_id))
  WITH CHECK (public.is_tenant_member_uuid(tenant_id));

-- 3. OSC Calls - Add WITH CHECK
DROP POLICY IF EXISTS "auth_all_osc_calls" ON public.osc_partnership_calls;
CREATE POLICY "auth_all_osc_calls" ON public.osc_partnership_calls 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

-- 4. OSC Execution - Add WITH CHECK
DROP POLICY IF EXISTS "auth_all_osc_exec" ON public.osc_partnership_execution;
CREATE POLICY "auth_all_osc_exec" ON public.osc_partnership_execution 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

-- 5. OSC Accountability - Add WITH CHECK
DROP POLICY IF EXISTS "auth_all_osc_acc" ON public.osc_partnership_accountability;
CREATE POLICY "auth_all_osc_acc" ON public.osc_partnership_accountability 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

-- 6. OSC Bank Accounts - Add WITH CHECK
DROP POLICY IF EXISTS "auth_all_osc_bank_accounts" ON public.osc_bank_accounts;
CREATE POLICY "auth_all_osc_bank_accounts" ON public.osc_bank_accounts 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

-- 7. OSC Bank Statement Lines - Add WITH CHECK
DROP POLICY IF EXISTS "auth_all_osc_bank_statement_lines" ON public.osc_bank_statement_lines;
CREATE POLICY "auth_all_osc_bank_statement_lines" ON public.osc_bank_statement_lines 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

-- 8. OSC Financial Incomes - Add WITH CHECK
DROP POLICY IF EXISTS "auth_all_osc_fin_inc" ON public.osc_financial_incomes;
CREATE POLICY "auth_all_osc_fin_inc" ON public.osc_financial_incomes 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

-- 9. OSC Financial Transactions - Add WITH CHECK
DROP POLICY IF EXISTS "auth_all_osc_fin_trans" ON public.osc_financial_transactions;
CREATE POLICY "auth_all_osc_fin_trans" ON public.osc_financial_transactions 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

-- 10. OSC Inclusive Cases - Add WITH CHECK
DROP POLICY IF EXISTS "auth_all_osc_inc_cases" ON public.osc_inclusive_cases;
CREATE POLICY "auth_all_osc_inc_cases" ON public.osc_inclusive_cases 
  FOR ALL TO authenticated 
  USING (public.is_tenant_member_uuid(tenant_id))
  WITH CHECK (public.is_tenant_member_uuid(tenant_id));

-- 11. OSC Inclusive Plans - Add WITH CHECK
DROP POLICY IF EXISTS "auth_all_osc_inc_plans" ON public.osc_inclusive_plans;
CREATE POLICY "auth_all_osc_inc_plans" ON public.osc_inclusive_plans 
  FOR ALL TO authenticated 
  USING (public.is_tenant_member_uuid(tenant_id))
  WITH CHECK (public.is_tenant_member_uuid(tenant_id));

-- 12. OSC Accountability Diligences - Add WITH CHECK
DROP POLICY IF EXISTS "auth_all_osc_acc_dil" ON public.osc_accountability_diligences;
CREATE POLICY "auth_all_osc_acc_dil" ON public.osc_accountability_diligences 
  FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.osc_partnerships p WHERE p.id = partnership_id AND public.is_tenant_member_uuid(p.tenant_id)));

