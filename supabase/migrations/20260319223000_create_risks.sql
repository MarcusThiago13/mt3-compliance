CREATE TABLE IF NOT EXISTS public.risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  impact INTEGER NOT NULL,
  probability INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP POLICY IF EXISTS "auth_all_risks" ON public.risks;
CREATE POLICY "auth_all_risks" ON public.risks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;

INSERT INTO public.risks (id, title, impact, probability) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Risco de Fraude em Licitações', 4, 3),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Falha em Due Diligence de Terceiros', 5, 2),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Assédio no Ambiente de Trabalho', 3, 4),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Vazamento de Dados Pessoais (LGPD)', 5, 3)
ON CONFLICT (id) DO NOTHING;
