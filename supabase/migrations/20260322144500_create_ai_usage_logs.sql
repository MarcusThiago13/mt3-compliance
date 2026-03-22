CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilita RLS
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Permite inserção por qualquer usuário autenticado (ou anônimo se via app pública)
DROP POLICY IF EXISTS "auth_insert_ai_logs" ON public.ai_usage_logs;
CREATE POLICY "auth_insert_ai_logs" ON public.ai_usage_logs 
  FOR INSERT TO authenticated, anon WITH CHECK (true);

-- Permite leitura por usuários autenticados (a filtragem de admin será feita na UI/App)
DROP POLICY IF EXISTS "auth_read_ai_logs" ON public.ai_usage_logs;
CREATE POLICY "auth_read_ai_logs" ON public.ai_usage_logs 
  FOR SELECT TO authenticated USING (true);

-- Index para otimizar queries por data e tenant
CREATE INDEX IF NOT EXISTS ai_usage_logs_created_at_idx ON public.ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS ai_usage_logs_tenant_id_idx ON public.ai_usage_logs(tenant_id);
