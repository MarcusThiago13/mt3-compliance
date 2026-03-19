DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Seed Admin User
  new_user_id := gen_random_uuid();
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('Admin123!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin"}',
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  );
END $$;

CREATE TABLE compliance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  month TEXT NOT NULL,
  conformity_score INTEGER NOT NULL,
  deviations INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  rule TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE evidence_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  clause_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  expiry_date TIMESTAMPTZ,
  is_legally_valid BOOLEAN DEFAULT false,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  clause_id TEXT NOT NULL,
  action TEXT NOT NULL,
  user_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assessment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  clause_id TEXT NOT NULL,
  next_review_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE compliance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_schedules ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "auth_all_compliance_history" ON compliance_history FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_gaps" ON gaps FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_evidence" ON evidence_metadata FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_audit_logs" ON audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_assessment_schedules" ON assessment_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed Data
INSERT INTO compliance_history (month, conformity_score, deviations) VALUES
('Jan', 82, 18), ('Fev', 85, 15), ('Mar', 84, 16), ('Abr', 89, 11), ('Mai', 92, 8), ('Jun', 95, 5);

INSERT INTO gaps (rule, description, severity, status) VALUES
('ISO 7.2', 'Registros de treinamento ausentes para 3 cargos de alta liderança.', 'Alta', 'Open'),
('Art. 57 (XIII)', 'Due Diligence pendente para 15 fornecedores críticos homologados.', 'Crítica', 'Open');

INSERT INTO evidence_metadata (clause_id, file_name, expiry_date, is_legally_valid, uploaded_by) VALUES
('5.2', 'Politica_v2.pdf', NOW() + INTERVAL '10 days', true, 'admin@example.com'),
('5.2', 'Termo_Aceite.pdf', NOW() - INTERVAL '5 days', false, 'admin@example.com');

INSERT INTO audit_logs (clause_id, action, user_email) VALUES
('5.2', 'Status inicial estabelecido', 'admin@example.com');

INSERT INTO assessment_schedules (clause_id, next_review_date) VALUES
('4.1', NOW() - INTERVAL '2 days'),
('5.2', NOW() + INTERVAL '5 days');
