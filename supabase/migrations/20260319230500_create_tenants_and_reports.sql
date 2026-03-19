CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT,
  status TEXT DEFAULT 'draft',
  step_1 JSONB DEFAULT '{}'::jsonb,
  step_2 JSONB DEFAULT '{}'::jsonb,
  step_3 JSONB DEFAULT '{}'::jsonb,
  step_4 JSONB DEFAULT '[]'::jsonb,
  step_5 JSONB DEFAULT '{}'::jsonb,
  step_6 JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_tenants" ON tenants;
CREATE POLICY "auth_all_tenants" ON tenants FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS profile_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profile_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all_reports" ON profile_reports;
CREATE POLICY "auth_all_reports" ON profile_reports FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('tenant_documents', 'tenant_documents', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "auth_all_storage" ON storage.objects;
CREATE POLICY "auth_all_storage" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'tenant_documents') WITH CHECK (bucket_id = 'tenant_documents');
