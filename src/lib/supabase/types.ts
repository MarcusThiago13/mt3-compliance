// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assessment_schedules: {
        Row: {
          clause_id: string
          created_at: string
          id: string
          next_review_date: string
          status: string
          tenant_id: string
        }
        Insert: {
          clause_id: string
          created_at?: string
          id?: string
          next_review_date: string
          status?: string
          tenant_id?: string
        }
        Update: {
          clause_id?: string
          created_at?: string
          id?: string
          next_review_date?: string
          status?: string
          tenant_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          clause_id: string
          created_at: string
          id: string
          tenant_id: string
          user_email: string | null
        }
        Insert: {
          action: string
          clause_id: string
          created_at?: string
          id?: string
          tenant_id?: string
          user_email?: string | null
        }
        Update: {
          action?: string
          clause_id?: string
          created_at?: string
          id?: string
          tenant_id?: string
          user_email?: string | null
        }
        Relationships: []
      }
      compliance_history: {
        Row: {
          conformity_score: number
          created_at: string
          deviations: number
          id: string
          month: string
          tenant_id: string
        }
        Insert: {
          conformity_score: number
          created_at?: string
          deviations: number
          id?: string
          month: string
          tenant_id?: string
        }
        Update: {
          conformity_score?: number
          created_at?: string
          deviations?: number
          id?: string
          month?: string
          tenant_id?: string
        }
        Relationships: []
      }
      evidence_metadata: {
        Row: {
          clause_id: string
          created_at: string
          expiry_date: string | null
          file_name: string
          file_url: string | null
          id: string
          is_legally_valid: boolean | null
          tenant_id: string
          uploaded_by: string | null
        }
        Insert: {
          clause_id: string
          created_at?: string
          expiry_date?: string | null
          file_name: string
          file_url?: string | null
          id?: string
          is_legally_valid?: boolean | null
          tenant_id?: string
          uploaded_by?: string | null
        }
        Update: {
          clause_id?: string
          created_at?: string
          expiry_date?: string | null
          file_name?: string
          file_url?: string | null
          id?: string
          is_legally_valid?: boolean | null
          tenant_id?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      evidence_requests: {
        Row: {
          action_id: string | null
          assignee_email: string | null
          assignee_id: string | null
          clause_id: string | null
          created_at: string
          deadline: string | null
          file_name: string | null
          file_url: string | null
          id: string
          reviewer_feedback: string | null
          status: string
          submitter_comments: string | null
          task_description: string | null
          task_title: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          action_id?: string | null
          assignee_email?: string | null
          assignee_id?: string | null
          clause_id?: string | null
          created_at?: string
          deadline?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          reviewer_feedback?: string | null
          status?: string
          submitter_comments?: string | null
          task_description?: string | null
          task_title: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          action_id?: string | null
          assignee_email?: string | null
          assignee_id?: string | null
          clause_id?: string | null
          created_at?: string
          deadline?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          reviewer_feedback?: string | null
          status?: string
          submitter_comments?: string | null
          task_description?: string | null
          task_title?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      gaps: {
        Row: {
          created_at: string
          description: string
          id: string
          rule: string
          severity: string
          status: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          rule: string
          severity: string
          status?: string
          tenant_id?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          rule?: string
          severity?: string
          status?: string
          tenant_id?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          classification: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          phone: string | null
          role: string
          status: string
          tenant_id: string
        }
        Insert: {
          classification?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: string
          status?: string
          tenant_id: string
        }
        Update: {
          classification?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_reports: {
        Row: {
          content: string
          created_at: string
          id: string
          tenant_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          tenant_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_reports_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      risks: {
        Row: {
          created_at: string
          id: string
          impact: number
          probability: number
          tenant_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          impact: number
          probability: number
          tenant_id?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          impact?: number
          probability?: number
          tenant_id?: string
          title?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          cnpj: string | null
          created_at: string
          id: string
          name: string
          status: string | null
          step_1: Json | null
          step_2: Json | null
          step_3: Json | null
          step_4: Json | null
          step_5: Json | null
          step_6: Json | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          id?: string
          name: string
          status?: string | null
          step_1?: Json | null
          step_2?: Json | null
          step_3?: Json | null
          step_4?: Json | null
          step_5?: Json | null
          step_6?: Json | null
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          id?: string
          name?: string
          status?: string | null
          step_1?: Json | null
          step_2?: Json | null
          step_3?: Json | null
          step_4?: Json | null
          step_5?: Json | null
          step_6?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_tenants: {
        Row: {
          classification: string | null
          contact_phone: string | null
          created_at: string
          role: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          classification?: string | null
          contact_phone?: string | null
          created_at?: string
          role?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          classification?: string | null
          contact_phone?: string | null
          created_at?: string
          role?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tenants_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_users: {
        Args: never
        Returns: {
          classification: string
          contact_phone: string
          email: string
          name: string
          role: string
          status: string
          tenant_id: string
          tenant_name: string
          user_id: string
        }[]
      }
      get_tenant_users: {
        Args: { target_tenant_id: string }
        Returns: {
          classification: string
          contact_phone: string
          email: string
          name: string
          role: string
          status: string
          user_id: string
        }[]
      }
      get_user_id_by_email: { Args: { user_email: string }; Returns: string }
      is_tenant_member: { Args: { check_tenant_id: string }; Returns: boolean }
      is_tenant_member_uuid: {
        Args: { check_tenant_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: assessment_schedules
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: text (not null, default: 'default'::text)
//   clause_id: text (not null)
//   next_review_date: timestamp with time zone (not null)
//   status: text (not null, default: 'Pending'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: audit_logs
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: text (not null, default: 'default'::text)
//   clause_id: text (not null)
//   action: text (not null)
//   user_email: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: compliance_history
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: text (not null, default: 'default'::text)
//   month: text (not null)
//   conformity_score: integer (not null)
//   deviations: integer (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: evidence_metadata
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: text (not null, default: 'default'::text)
//   clause_id: text (not null)
//   file_name: text (not null)
//   file_url: text (nullable)
//   expiry_date: timestamp with time zone (nullable)
//   is_legally_valid: boolean (nullable, default: false)
//   uploaded_by: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: evidence_requests
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   clause_id: text (nullable)
//   action_id: text (nullable)
//   task_title: text (not null)
//   task_description: text (nullable)
//   deadline: timestamp with time zone (nullable)
//   assignee_id: uuid (nullable)
//   assignee_email: text (nullable)
//   status: text (not null, default: 'pending'::text)
//   file_url: text (nullable)
//   file_name: text (nullable)
//   submitter_comments: text (nullable)
//   reviewer_feedback: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: gaps
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: text (not null, default: 'default'::text)
//   rule: text (not null)
//   description: text (not null)
//   severity: text (not null)
//   status: text (not null, default: 'Open'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: invitations
//   id: uuid (not null, default: gen_random_uuid())
//   email: text (not null)
//   name: text (nullable)
//   tenant_id: uuid (not null)
//   status: text (not null, default: 'pending'::text)
//   phone: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   role: text (not null, default: 'viewer'::text)
//   classification: text (nullable)
// Table: profile_reports
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (nullable)
//   content: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: risks
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: text (not null, default: 'default'::text)
//   title: text (not null)
//   impact: integer (not null)
//   probability: integer (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: tenants
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   cnpj: text (nullable)
//   status: text (nullable, default: 'draft'::text)
//   step_1: jsonb (nullable, default: '{}'::jsonb)
//   step_2: jsonb (nullable, default: '{}'::jsonb)
//   step_3: jsonb (nullable, default: '{}'::jsonb)
//   step_4: jsonb (nullable, default: '[]'::jsonb)
//   step_5: jsonb (nullable, default: '{}'::jsonb)
//   step_6: jsonb (nullable, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: user_tenants
//   user_id: uuid (not null)
//   tenant_id: uuid (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   role: text (not null, default: 'viewer'::text)
//   classification: text (nullable)
//   contact_phone: text (nullable)

// --- CONSTRAINTS ---
// Table: assessment_schedules
//   PRIMARY KEY assessment_schedules_pkey: PRIMARY KEY (id)
// Table: audit_logs
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
// Table: compliance_history
//   PRIMARY KEY compliance_history_pkey: PRIMARY KEY (id)
// Table: evidence_metadata
//   PRIMARY KEY evidence_metadata_pkey: PRIMARY KEY (id)
// Table: evidence_requests
//   FOREIGN KEY evidence_requests_assignee_id_fkey: FOREIGN KEY (assignee_id) REFERENCES auth.users(id)
//   PRIMARY KEY evidence_requests_pkey: PRIMARY KEY (id)
//   FOREIGN KEY evidence_requests_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: gaps
//   PRIMARY KEY gaps_pkey: PRIMARY KEY (id)
// Table: invitations
//   PRIMARY KEY invitations_pkey: PRIMARY KEY (id)
//   FOREIGN KEY invitations_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: profile_reports
//   PRIMARY KEY profile_reports_pkey: PRIMARY KEY (id)
//   FOREIGN KEY profile_reports_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: risks
//   PRIMARY KEY risks_pkey: PRIMARY KEY (id)
// Table: tenants
//   PRIMARY KEY tenants_pkey: PRIMARY KEY (id)
// Table: user_tenants
//   PRIMARY KEY user_tenants_pkey: PRIMARY KEY (user_id, tenant_id)
//   FOREIGN KEY user_tenants_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
//   FOREIGN KEY user_tenants_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: assessment_schedules
//   Policy "tenant_isolation_assessments" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member(tenant_id)
//     WITH CHECK: is_tenant_member(tenant_id)
// Table: audit_logs
//   Policy "tenant_isolation_audit_logs" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member(tenant_id)
//     WITH CHECK: is_tenant_member(tenant_id)
// Table: compliance_history
//   Policy "tenant_isolation_history" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member(tenant_id)
//     WITH CHECK: is_tenant_member(tenant_id)
// Table: evidence_metadata
//   Policy "tenant_isolation_evidence" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member(tenant_id)
//     WITH CHECK: is_tenant_member(tenant_id)
// Table: evidence_requests
//   Policy "evidence_requests_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: is_tenant_member_uuid(tenant_id)
//   Policy "evidence_requests_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((assignee_email = (auth.jwt() ->> 'email'::text)) OR is_tenant_member_uuid(tenant_id))
//   Policy "evidence_requests_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((assignee_email = (auth.jwt() ->> 'email'::text)) OR is_tenant_member_uuid(tenant_id))
// Table: gaps
//   Policy "tenant_isolation_gaps" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member(tenant_id)
//     WITH CHECK: is_tenant_member(tenant_id)
// Table: invitations
//   Policy "auth_all_invitations" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: profile_reports
//   Policy "tenant_isolation_reports" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)
//     WITH CHECK: is_tenant_member_uuid(tenant_id)
// Table: risks
//   Policy "tenant_isolation_risks" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member(tenant_id)
//     WITH CHECK: is_tenant_member(tenant_id)
// Table: tenants
//   Policy "tenant_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(id)
//   Policy "tenant_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "tenant_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(id)
//   Policy "tenant_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(id)
// Table: user_tenants
//   Policy "ut_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (user_id = auth.uid())

// --- DATABASE FUNCTIONS ---
// FUNCTION fn_add_tenant_creator()
//   CREATE OR REPLACE FUNCTION public.fn_add_tenant_creator()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       INSERT INTO public.user_tenants (user_id, tenant_id) 
//       VALUES (auth.uid(), NEW.id) 
//       ON CONFLICT DO NOTHING;
//       RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION get_all_users()
//   CREATE OR REPLACE FUNCTION public.get_all_users()
//    RETURNS TABLE(user_id uuid, email text, name text, role text, classification text, status text, tenant_id uuid, tenant_name text, contact_phone text)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       RETURN QUERY
//       SELECT 
//           u.id as user_id,
//           u.email::text,
//           (u.raw_user_meta_data->>'name')::text as name,
//           ut.role,
//           ut.classification,
//           CASE WHEN u.email_confirmed_at IS NOT NULL THEN 'Ativo' ELSE 'Pendente' END as status,
//           ut.tenant_id,
//           t.name as tenant_name,
//           ut.contact_phone
//       FROM auth.users u
//       JOIN public.user_tenants ut ON u.id = ut.user_id
//       JOIN public.tenants t ON t.id = ut.tenant_id;
//   END;
//   $function$
//   
// FUNCTION get_tenant_users(uuid)
//   CREATE OR REPLACE FUNCTION public.get_tenant_users(target_tenant_id uuid)
//    RETURNS TABLE(user_id uuid, email text, name text, role text, classification text, status text, contact_phone text)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       RETURN QUERY
//       SELECT 
//           u.id as user_id,
//           u.email::text,
//           (u.raw_user_meta_data->>'name')::text as name,
//           ut.role,
//           ut.classification,
//           CASE WHEN u.email_confirmed_at IS NOT NULL THEN 'Ativo' ELSE 'Pendente' END as status,
//           ut.contact_phone
//       FROM auth.users u
//       JOIN public.user_tenants ut ON u.id = ut.user_id
//       WHERE ut.tenant_id = target_tenant_id;
//   END;
//   $function$
//   
// FUNCTION get_user_id_by_email(text)
//   CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email text)
//    RETURNS uuid
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       found_user_id uuid;
//   BEGIN
//       SELECT id INTO found_user_id FROM auth.users WHERE email = user_email LIMIT 1;
//       RETURN found_user_id;
//   END;
//   $function$
//   
// FUNCTION is_tenant_member(text)
//   CREATE OR REPLACE FUNCTION public.is_tenant_member(check_tenant_id text)
//    RETURNS boolean
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       RETURN EXISTS (
//           SELECT 1 FROM public.user_tenants ut
//           WHERE ut.user_id = auth.uid() AND ut.tenant_id::text = check_tenant_id
//       );
//   END;
//   $function$
//   
// FUNCTION is_tenant_member_uuid(uuid)
//   CREATE OR REPLACE FUNCTION public.is_tenant_member_uuid(check_tenant_id uuid)
//    RETURNS boolean
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       RETURN EXISTS (
//           SELECT 1 FROM public.user_tenants ut
//           WHERE ut.user_id = auth.uid() AND ut.tenant_id = check_tenant_id
//       );
//   END;
//   $function$
//   

// --- TRIGGERS ---
// Table: tenants
//   trg_add_tenant_creator: CREATE TRIGGER trg_add_tenant_creator AFTER INSERT ON public.tenants FOR EACH ROW EXECUTE FUNCTION fn_add_tenant_creator()

// --- INDEXES ---
// Table: invitations
//   CREATE UNIQUE INDEX invitations_email_tenant_idx ON public.invitations USING btree (email, tenant_id)

