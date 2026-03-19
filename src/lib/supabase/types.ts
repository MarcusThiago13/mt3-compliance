// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
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
            foreignKeyName: 'profile_reports_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
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
// Table: gaps
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: text (not null, default: 'default'::text)
//   rule: text (not null)
//   description: text (not null)
//   severity: text (not null)
//   status: text (not null, default: 'Open'::text)
//   created_at: timestamp with time zone (not null, default: now())
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

// --- CONSTRAINTS ---
// Table: assessment_schedules
//   PRIMARY KEY assessment_schedules_pkey: PRIMARY KEY (id)
// Table: audit_logs
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
// Table: compliance_history
//   PRIMARY KEY compliance_history_pkey: PRIMARY KEY (id)
// Table: evidence_metadata
//   PRIMARY KEY evidence_metadata_pkey: PRIMARY KEY (id)
// Table: gaps
//   PRIMARY KEY gaps_pkey: PRIMARY KEY (id)
// Table: profile_reports
//   PRIMARY KEY profile_reports_pkey: PRIMARY KEY (id)
//   FOREIGN KEY profile_reports_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: risks
//   PRIMARY KEY risks_pkey: PRIMARY KEY (id)
// Table: tenants
//   PRIMARY KEY tenants_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: assessment_schedules
//   Policy "auth_all_assessment_schedules" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: audit_logs
//   Policy "auth_all_audit_logs" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: compliance_history
//   Policy "auth_all_compliance_history" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: evidence_metadata
//   Policy "auth_all_evidence" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: gaps
//   Policy "auth_all_gaps" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: profile_reports
//   Policy "auth_all_reports" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: risks
//   Policy "auth_all_risks" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: tenants
//   Policy "auth_all_tenants" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
