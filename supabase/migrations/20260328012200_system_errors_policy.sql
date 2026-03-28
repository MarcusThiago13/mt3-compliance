-- Add SELECT policy for system_errors to allow admins to read logs
DROP POLICY IF EXISTS "auth_select_errors" ON public.system_errors;
CREATE POLICY "auth_select_errors" ON public.system_errors
  FOR SELECT TO authenticated 
  USING (
    ((auth.jwt() ->> 'email'::text) IN ('admin@example.com', 'marcusthiago.adv@gmail.com'))
    OR (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
    OR ((auth.jwt() -> 'user_metadata' ->> 'is_admin') = 'true')
  );
