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
      ai_usage_logs: {
        Row: {
          created_at: string
          id: string
          input_tokens: number
          model: string
          output_tokens: number
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          input_tokens?: number
          model: string
          output_tokens?: number
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          input_tokens?: number
          model?: string
          output_tokens?: number
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'ai_usage_logs_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
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
      communication_logs: {
        Row: {
          body: string
          channel: string
          created_at: string
          external_id: string | null
          id: string
          status: string
          subject: string
          tenant_id: string | null
          to_email: string | null
          to_phone: string | null
          updated_at: string
        }
        Insert: {
          body: string
          channel?: string
          created_at?: string
          external_id?: string | null
          id?: string
          status?: string
          subject: string
          tenant_id?: string | null
          to_email?: string | null
          to_phone?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          external_id?: string | null
          id?: string
          status?: string
          subject?: string
          tenant_id?: string | null
          to_email?: string | null
          to_phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'communication_logs_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      compliance_documents: {
        Row: {
          audience: string | null
          confidentiality: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          period_ref: string | null
          status: string
          template_id: string | null
          tenant_id: string
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          audience?: string | null
          confidentiality?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          period_ref?: string | null
          status?: string
          template_id?: string | null
          tenant_id: string
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          audience?: string | null
          confidentiality?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          period_ref?: string | null
          status?: string
          template_id?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: 'compliance_documents_template_id_fkey'
            columns: ['template_id']
            isOneToOne: false
            referencedRelation: 'document_templates'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'compliance_documents_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
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
      controls_library: {
        Row: {
          code: string
          control_type: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          nature: string | null
          owner_id: string | null
          status: string
          tenant_id: string
        }
        Insert: {
          code: string
          control_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          nature?: string | null
          owner_id?: string | null
          status?: string
          tenant_id: string
        }
        Update: {
          code?: string
          control_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          nature?: string | null
          owner_id?: string | null
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'controls_library_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      dd_conflict_declarations: {
        Row: {
          created_at: string
          details_json: Json | null
          employee_id: string | null
          employee_name: string | null
          has_conflict: boolean | null
          id: string
          reviewer_id: string | null
          status: string | null
          tenant_id: string
          year: number
        }
        Insert: {
          created_at?: string
          details_json?: Json | null
          employee_id?: string | null
          employee_name?: string | null
          has_conflict?: boolean | null
          id?: string
          reviewer_id?: string | null
          status?: string | null
          tenant_id: string
          year: number
        }
        Update: {
          created_at?: string
          details_json?: Json | null
          employee_id?: string | null
          employee_name?: string | null
          has_conflict?: boolean | null
          id?: string
          reviewer_id?: string | null
          status?: string | null
          tenant_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: 'dd_conflict_declarations_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      dd_red_flags: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_resolved: boolean | null
          mitigation_plan: string | null
          process_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          is_resolved?: boolean | null
          mitigation_plan?: string | null
          process_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_resolved?: boolean | null
          mitigation_plan?: string | null
          process_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dd_red_flags_process_id_fkey'
            columns: ['process_id']
            isOneToOne: false
            referencedRelation: 'due_diligence_processes'
            referencedColumns: ['id']
          },
        ]
      }
      document_templates: {
        Row: {
          ai_instructions: string
          base_structure: string
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          tenant_id: string | null
        }
        Insert: {
          ai_instructions: string
          base_structure: string
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          tenant_id?: string | null
        }
        Update: {
          ai_instructions?: string
          base_structure?: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'document_templates_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      document_versions: {
        Row: {
          change_reason: string | null
          content: string
          created_at: string
          created_by: string | null
          document_id: string
          id: string
          version_number: number
        }
        Insert: {
          change_reason?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          document_id: string
          id?: string
          version_number: number
        }
        Update: {
          change_reason?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          document_id?: string
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: 'document_versions_document_id_fkey'
            columns: ['document_id']
            isOneToOne: false
            referencedRelation: 'compliance_documents'
            referencedColumns: ['id']
          },
        ]
      }
      due_diligence_processes: {
        Row: {
          analyst_id: string | null
          created_at: string
          dd_level: string | null
          decision_date: string | null
          decision_justification: string | null
          expiration_date: string | null
          id: string
          risk_level: string | null
          risk_score: number | null
          status: string
          target_document: string | null
          target_name: string
          target_type: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          analyst_id?: string | null
          created_at?: string
          dd_level?: string | null
          decision_date?: string | null
          decision_justification?: string | null
          expiration_date?: string | null
          id?: string
          risk_level?: string | null
          risk_score?: number | null
          status?: string
          target_document?: string | null
          target_name: string
          target_type: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          analyst_id?: string | null
          created_at?: string
          dd_level?: string | null
          decision_date?: string | null
          decision_justification?: string | null
          expiration_date?: string | null
          id?: string
          risk_level?: string | null
          risk_score?: number | null
          status?: string
          target_document?: string | null
          target_name?: string
          target_type?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'due_diligence_processes_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          name: string
          subject: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          name: string
          subject: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'email_templates_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
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
            foreignKeyName: 'evidence_requests_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      form_collection_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string
          form_type: string
          id: string
          is_revoked: boolean
          is_used: boolean
          tenant_id: string | null
          token: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at: string
          form_type: string
          id?: string
          is_revoked?: boolean
          is_used?: boolean
          tenant_id?: string | null
          token?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          form_type?: string
          id?: string
          is_revoked?: boolean
          is_used?: boolean
          tenant_id?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: 'form_collection_tokens_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
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
            foreignKeyName: 'invitations_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
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
            foreignKeyName: 'profile_reports_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      report_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          report_id: string
          sender_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          report_id: string
          sender_type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          report_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'report_messages_report_id_fkey'
            columns: ['report_id']
            isOneToOne: false
            referencedRelation: 'whistleblower_reports'
            referencedColumns: ['id']
          },
        ]
      }
      risk_assessments: {
        Row: {
          created_at: string
          evaluated_by: string | null
          id: string
          inherent_impact: number | null
          inherent_prob: number | null
          inherent_score: number | null
          justification: string | null
          residual_impact: number | null
          residual_prob: number | null
          residual_score: number | null
          risk_id: string
          status: string
          version_id: string | null
        }
        Insert: {
          created_at?: string
          evaluated_by?: string | null
          id?: string
          inherent_impact?: number | null
          inherent_prob?: number | null
          inherent_score?: number | null
          justification?: string | null
          residual_impact?: number | null
          residual_prob?: number | null
          residual_score?: number | null
          risk_id: string
          status?: string
          version_id?: string | null
        }
        Update: {
          created_at?: string
          evaluated_by?: string | null
          id?: string
          inherent_impact?: number | null
          inherent_prob?: number | null
          inherent_score?: number | null
          justification?: string | null
          residual_impact?: number | null
          residual_prob?: number | null
          residual_score?: number | null
          risk_id?: string
          status?: string
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'risk_assessments_risk_id_fkey'
            columns: ['risk_id']
            isOneToOne: false
            referencedRelation: 'risk_register'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'risk_assessments_version_id_fkey'
            columns: ['version_id']
            isOneToOne: false
            referencedRelation: 'risk_methodology_versions'
            referencedColumns: ['id']
          },
        ]
      }
      risk_controls: {
        Row: {
          control_id: string
          created_at: string
          design_effectiveness: string | null
          id: string
          operational_effectiveness: string | null
          risk_id: string
        }
        Insert: {
          control_id: string
          created_at?: string
          design_effectiveness?: string | null
          id?: string
          operational_effectiveness?: string | null
          risk_id: string
        }
        Update: {
          control_id?: string
          created_at?: string
          design_effectiveness?: string | null
          id?: string
          operational_effectiveness?: string | null
          risk_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'risk_controls_control_id_fkey'
            columns: ['control_id']
            isOneToOne: false
            referencedRelation: 'controls_library'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'risk_controls_risk_id_fkey'
            columns: ['risk_id']
            isOneToOne: false
            referencedRelation: 'risk_register'
            referencedColumns: ['id']
          },
        ]
      }
      risk_methodologies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'risk_methodologies_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      risk_methodology_versions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          methodology_id: string
          model_type: string
          parameters: Json
          status: string
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          methodology_id: string
          model_type?: string
          parameters?: Json
          status?: string
          version_number: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          methodology_id?: string
          model_type?: string
          parameters?: Json
          status?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: 'risk_methodology_versions_methodology_id_fkey'
            columns: ['methodology_id']
            isOneToOne: false
            referencedRelation: 'risk_methodologies'
            referencedColumns: ['id']
          },
        ]
      }
      risk_register: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string | null
          id: string
          owner_id: string | null
          process: string | null
          source: string | null
          status: string
          subcategory: string | null
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string | null
          process?: string | null
          source?: string | null
          status?: string
          subcategory?: string | null
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string | null
          process?: string | null
          source?: string | null
          status?: string
          subcategory?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'risk_register_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      risk_treatments: {
        Row: {
          created_at: string
          deadline: string | null
          description: string
          effectiveness_indicator: string | null
          id: string
          owner_id: string | null
          response_type: string
          risk_id: string
          status: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description: string
          effectiveness_indicator?: string | null
          id?: string
          owner_id?: string | null
          response_type: string
          risk_id: string
          status?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string
          effectiveness_indicator?: string | null
          id?: string
          owner_id?: string | null
          response_type?: string
          risk_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'risk_treatments_risk_id_fkey'
            columns: ['risk_id']
            isOneToOne: false
            referencedRelation: 'risk_register'
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
          context_data: Json | null
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
          context_data?: Json | null
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
          context_data?: Json | null
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
            foreignKeyName: 'user_tenants_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      whistleblower_reports: {
        Row: {
          access_password_hash: string
          admissibility_decided_at: string | null
          admissibility_decided_by: string | null
          admissibility_decision: string | null
          admissibility_justification: string | null
          assigned_investigator_id: string | null
          category: string
          closed_at: string | null
          conclusion: string | null
          created_at: string
          description: string
          id: string
          incident_date_end: string | null
          incident_date_start: string | null
          incident_location: string | null
          involved_persons: string | null
          is_anonymous: boolean
          protocol_number: string
          reporter_email: string | null
          reporter_name: string | null
          reporter_phone: string | null
          severity: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          access_password_hash: string
          admissibility_decided_at?: string | null
          admissibility_decided_by?: string | null
          admissibility_decision?: string | null
          admissibility_justification?: string | null
          assigned_investigator_id?: string | null
          category: string
          closed_at?: string | null
          conclusion?: string | null
          created_at?: string
          description: string
          id?: string
          incident_date_end?: string | null
          incident_date_start?: string | null
          incident_location?: string | null
          involved_persons?: string | null
          is_anonymous?: boolean
          protocol_number: string
          reporter_email?: string | null
          reporter_name?: string | null
          reporter_phone?: string | null
          severity?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          access_password_hash?: string
          admissibility_decided_at?: string | null
          admissibility_decided_by?: string | null
          admissibility_decision?: string | null
          admissibility_justification?: string | null
          assigned_investigator_id?: string | null
          category?: string
          closed_at?: string | null
          conclusion?: string | null
          created_at?: string
          description?: string
          id?: string
          incident_date_end?: string | null
          incident_date_start?: string | null
          incident_location?: string | null
          involved_persons?: string | null
          is_anonymous?: boolean
          protocol_number?: string
          reporter_email?: string | null
          reporter_name?: string | null
          reporter_phone?: string | null
          severity?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'whistleblower_reports_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_report_credentials: {
        Args: { p_password: string; p_protocol: string; p_tenant_id: string }
        Returns: string
      }
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
      submit_form_collection: {
        Args: { p_payload: Json; p_token: string }
        Returns: Json
      }
    }
    Enums: {
      dd_level_enum: 'SDD' | 'CDD' | 'EDD'
      dd_risk_level: 'Baixo' | 'Médio' | 'Alto'
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
    Enums: {
      dd_level_enum: ['SDD', 'CDD', 'EDD'],
      dd_risk_level: ['Baixo', 'Médio', 'Alto'],
    },
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
// Table: ai_usage_logs
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (nullable)
//   user_id: uuid (nullable)
//   model: text (not null)
//   input_tokens: integer (not null, default: 0)
//   output_tokens: integer (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
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
// Table: communication_logs
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (nullable)
//   to_email: text (nullable)
//   subject: text (not null)
//   body: text (not null)
//   status: text (not null, default: 'sent'::text)
//   external_id: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   channel: text (not null, default: 'email'::text)
//   to_phone: text (nullable)
// Table: compliance_documents
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   template_id: uuid (nullable)
//   title: text (not null)
//   status: text (not null, default: 'draft'::text)
//   content: text (not null)
//   version: integer (not null, default: 1)
//   audience: text (nullable)
//   confidentiality: text (nullable)
//   period_ref: text (nullable)
//   created_by: uuid (nullable, default: auth.uid())
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: compliance_history
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: text (not null, default: 'default'::text)
//   month: text (not null)
//   conformity_score: integer (not null)
//   deviations: integer (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: controls_library
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   code: text (not null)
//   name: text (not null)
//   description: text (nullable)
//   control_type: text (nullable)
//   nature: text (nullable)
//   owner_id: uuid (nullable)
//   status: text (not null, default: 'Ativo'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: dd_conflict_declarations
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   employee_id: uuid (nullable)
//   employee_name: text (nullable)
//   year: integer (not null)
//   has_conflict: boolean (nullable, default: false)
//   details_json: jsonb (nullable, default: '{}'::jsonb)
//   reviewer_id: uuid (nullable)
//   status: text (nullable, default: 'Pendente'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: dd_red_flags
//   id: uuid (not null, default: gen_random_uuid())
//   process_id: uuid (not null)
//   category: text (not null)
//   description: text (not null)
//   mitigation_plan: text (nullable)
//   is_resolved: boolean (nullable, default: false)
//   created_at: timestamp with time zone (not null, default: now())
// Table: document_templates
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (nullable)
//   name: text (not null)
//   category: text (not null)
//   description: text (nullable)
//   base_structure: text (not null)
//   ai_instructions: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: document_versions
//   id: uuid (not null, default: gen_random_uuid())
//   document_id: uuid (not null)
//   version_number: integer (not null)
//   content: text (not null)
//   change_reason: text (nullable)
//   created_by: uuid (nullable, default: auth.uid())
//   created_at: timestamp with time zone (not null, default: now())
// Table: due_diligence_processes
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   target_type: text (not null)
//   target_name: text (not null)
//   target_document: text (nullable)
//   risk_score: integer (nullable, default: 0)
//   risk_level: text (nullable)
//   dd_level: text (nullable)
//   status: text (not null, default: 'Em Análise'::text)
//   analyst_id: uuid (nullable)
//   decision_date: timestamp with time zone (nullable)
//   decision_justification: text (nullable)
//   expiration_date: date (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: email_templates
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (nullable)
//   name: text (not null)
//   subject: text (not null)
//   body: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
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
// Table: form_collection_tokens
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (nullable)
//   form_type: text (not null)
//   token: uuid (not null, default: gen_random_uuid())
//   expires_at: timestamp with time zone (not null)
//   is_used: boolean (not null, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   is_revoked: boolean (not null, default: false)
//   created_by: uuid (nullable)
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
// Table: report_messages
//   id: uuid (not null, default: gen_random_uuid())
//   report_id: uuid (not null)
//   sender_type: text (not null)
//   message: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: risk_assessments
//   id: uuid (not null, default: gen_random_uuid())
//   risk_id: uuid (not null)
//   version_id: uuid (nullable)
//   inherent_prob: integer (nullable)
//   inherent_impact: integer (nullable)
//   inherent_score: integer (nullable)
//   residual_prob: integer (nullable)
//   residual_impact: integer (nullable)
//   residual_score: integer (nullable)
//   justification: text (nullable)
//   status: text (not null, default: 'Em Avaliação'::text)
//   evaluated_by: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: risk_controls
//   id: uuid (not null, default: gen_random_uuid())
//   risk_id: uuid (not null)
//   control_id: uuid (not null)
//   design_effectiveness: text (nullable)
//   operational_effectiveness: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: risk_methodologies
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   name: text (not null)
//   description: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: risk_methodology_versions
//   id: uuid (not null, default: gen_random_uuid())
//   methodology_id: uuid (not null)
//   version_number: integer (not null)
//   model_type: text (not null, default: 'basic'::text)
//   parameters: jsonb (not null, default: '{}'::jsonb)
//   status: text (not null, default: 'draft'::text)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: risk_register
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   code: text (not null)
//   title: text (not null)
//   description: text (nullable)
//   category: text (not null)
//   subcategory: text (nullable)
//   process: text (nullable)
//   owner_id: uuid (nullable)
//   source: text (nullable)
//   status: text (not null, default: 'Identificado'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: risk_treatments
//   id: uuid (not null, default: gen_random_uuid())
//   risk_id: uuid (not null)
//   response_type: text (not null)
//   description: text (not null)
//   owner_id: uuid (nullable)
//   deadline: date (nullable)
//   status: text (not null, default: 'Planejado'::text)
//   effectiveness_indicator: text (nullable)
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
//   context_data: jsonb (nullable, default: '{}'::jsonb)
// Table: user_tenants
//   user_id: uuid (not null)
//   tenant_id: uuid (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   role: text (not null, default: 'viewer'::text)
//   classification: text (nullable)
//   contact_phone: text (nullable)
// Table: whistleblower_reports
//   id: uuid (not null, default: gen_random_uuid())
//   tenant_id: uuid (not null)
//   protocol_number: character varying (not null)
//   access_password_hash: character varying (not null)
//   is_anonymous: boolean (not null, default: true)
//   reporter_name: text (nullable)
//   reporter_email: text (nullable)
//   reporter_phone: text (nullable)
//   category: text (not null)
//   description: text (not null)
//   involved_persons: text (nullable)
//   incident_date_start: date (nullable)
//   incident_date_end: date (nullable)
//   incident_location: character varying (nullable)
//   status: text (not null, default: 'nova'::text)
//   severity: text (nullable)
//   admissibility_decision: text (nullable)
//   admissibility_justification: text (nullable)
//   admissibility_decided_by: uuid (nullable)
//   admissibility_decided_at: timestamp with time zone (nullable)
//   assigned_investigator_id: uuid (nullable)
//   conclusion: text (nullable)
//   closed_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: ai_usage_logs
//   PRIMARY KEY ai_usage_logs_pkey: PRIMARY KEY (id)
//   FOREIGN KEY ai_usage_logs_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
//   FOREIGN KEY ai_usage_logs_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
// Table: assessment_schedules
//   PRIMARY KEY assessment_schedules_pkey: PRIMARY KEY (id)
// Table: audit_logs
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
// Table: communication_logs
//   PRIMARY KEY communication_logs_pkey: PRIMARY KEY (id)
//   FOREIGN KEY communication_logs_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: compliance_documents
//   FOREIGN KEY compliance_documents_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id)
//   PRIMARY KEY compliance_documents_pkey: PRIMARY KEY (id)
//   FOREIGN KEY compliance_documents_template_id_fkey: FOREIGN KEY (template_id) REFERENCES document_templates(id) ON DELETE SET NULL
//   FOREIGN KEY compliance_documents_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: compliance_history
//   PRIMARY KEY compliance_history_pkey: PRIMARY KEY (id)
// Table: controls_library
//   FOREIGN KEY controls_library_owner_id_fkey: FOREIGN KEY (owner_id) REFERENCES auth.users(id)
//   PRIMARY KEY controls_library_pkey: PRIMARY KEY (id)
//   FOREIGN KEY controls_library_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: dd_conflict_declarations
//   FOREIGN KEY dd_conflict_declarations_employee_id_fkey: FOREIGN KEY (employee_id) REFERENCES auth.users(id)
//   PRIMARY KEY dd_conflict_declarations_pkey: PRIMARY KEY (id)
//   FOREIGN KEY dd_conflict_declarations_reviewer_id_fkey: FOREIGN KEY (reviewer_id) REFERENCES auth.users(id)
//   FOREIGN KEY dd_conflict_declarations_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: dd_red_flags
//   PRIMARY KEY dd_red_flags_pkey: PRIMARY KEY (id)
//   FOREIGN KEY dd_red_flags_process_id_fkey: FOREIGN KEY (process_id) REFERENCES due_diligence_processes(id) ON DELETE CASCADE
// Table: document_templates
//   PRIMARY KEY document_templates_pkey: PRIMARY KEY (id)
//   FOREIGN KEY document_templates_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: document_versions
//   FOREIGN KEY document_versions_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id)
//   FOREIGN KEY document_versions_document_id_fkey: FOREIGN KEY (document_id) REFERENCES compliance_documents(id) ON DELETE CASCADE
//   PRIMARY KEY document_versions_pkey: PRIMARY KEY (id)
// Table: due_diligence_processes
//   FOREIGN KEY due_diligence_processes_analyst_id_fkey: FOREIGN KEY (analyst_id) REFERENCES auth.users(id)
//   PRIMARY KEY due_diligence_processes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY due_diligence_processes_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: email_templates
//   PRIMARY KEY email_templates_pkey: PRIMARY KEY (id)
//   FOREIGN KEY email_templates_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: evidence_metadata
//   PRIMARY KEY evidence_metadata_pkey: PRIMARY KEY (id)
// Table: evidence_requests
//   FOREIGN KEY evidence_requests_assignee_id_fkey: FOREIGN KEY (assignee_id) REFERENCES auth.users(id)
//   PRIMARY KEY evidence_requests_pkey: PRIMARY KEY (id)
//   FOREIGN KEY evidence_requests_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: form_collection_tokens
//   FOREIGN KEY form_collection_tokens_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
//   PRIMARY KEY form_collection_tokens_pkey: PRIMARY KEY (id)
//   FOREIGN KEY form_collection_tokens_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: gaps
//   PRIMARY KEY gaps_pkey: PRIMARY KEY (id)
// Table: invitations
//   PRIMARY KEY invitations_pkey: PRIMARY KEY (id)
//   FOREIGN KEY invitations_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: profile_reports
//   PRIMARY KEY profile_reports_pkey: PRIMARY KEY (id)
//   FOREIGN KEY profile_reports_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: report_messages
//   PRIMARY KEY report_messages_pkey: PRIMARY KEY (id)
//   FOREIGN KEY report_messages_report_id_fkey: FOREIGN KEY (report_id) REFERENCES whistleblower_reports(id) ON DELETE CASCADE
// Table: risk_assessments
//   FOREIGN KEY risk_assessments_evaluated_by_fkey: FOREIGN KEY (evaluated_by) REFERENCES auth.users(id)
//   PRIMARY KEY risk_assessments_pkey: PRIMARY KEY (id)
//   FOREIGN KEY risk_assessments_risk_id_fkey: FOREIGN KEY (risk_id) REFERENCES risk_register(id) ON DELETE CASCADE
//   FOREIGN KEY risk_assessments_version_id_fkey: FOREIGN KEY (version_id) REFERENCES risk_methodology_versions(id)
// Table: risk_controls
//   FOREIGN KEY risk_controls_control_id_fkey: FOREIGN KEY (control_id) REFERENCES controls_library(id) ON DELETE CASCADE
//   PRIMARY KEY risk_controls_pkey: PRIMARY KEY (id)
//   FOREIGN KEY risk_controls_risk_id_fkey: FOREIGN KEY (risk_id) REFERENCES risk_register(id) ON DELETE CASCADE
// Table: risk_methodologies
//   PRIMARY KEY risk_methodologies_pkey: PRIMARY KEY (id)
//   FOREIGN KEY risk_methodologies_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: risk_methodology_versions
//   FOREIGN KEY risk_methodology_versions_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id)
//   FOREIGN KEY risk_methodology_versions_methodology_id_fkey: FOREIGN KEY (methodology_id) REFERENCES risk_methodologies(id) ON DELETE CASCADE
//   PRIMARY KEY risk_methodology_versions_pkey: PRIMARY KEY (id)
// Table: risk_register
//   FOREIGN KEY risk_register_owner_id_fkey: FOREIGN KEY (owner_id) REFERENCES auth.users(id)
//   PRIMARY KEY risk_register_pkey: PRIMARY KEY (id)
//   FOREIGN KEY risk_register_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
// Table: risk_treatments
//   FOREIGN KEY risk_treatments_owner_id_fkey: FOREIGN KEY (owner_id) REFERENCES auth.users(id)
//   PRIMARY KEY risk_treatments_pkey: PRIMARY KEY (id)
//   FOREIGN KEY risk_treatments_risk_id_fkey: FOREIGN KEY (risk_id) REFERENCES risk_register(id) ON DELETE CASCADE
// Table: risks
//   PRIMARY KEY risks_pkey: PRIMARY KEY (id)
// Table: tenants
//   PRIMARY KEY tenants_pkey: PRIMARY KEY (id)
// Table: user_tenants
//   PRIMARY KEY user_tenants_pkey: PRIMARY KEY (user_id, tenant_id)
//   FOREIGN KEY user_tenants_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
//   FOREIGN KEY user_tenants_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: whistleblower_reports
//   FOREIGN KEY whistleblower_reports_admissibility_decided_by_fkey: FOREIGN KEY (admissibility_decided_by) REFERENCES auth.users(id)
//   FOREIGN KEY whistleblower_reports_assigned_investigator_id_fkey: FOREIGN KEY (assigned_investigator_id) REFERENCES auth.users(id)
//   PRIMARY KEY whistleblower_reports_pkey: PRIMARY KEY (id)
//   UNIQUE whistleblower_reports_protocol_number_key: UNIQUE (protocol_number)
//   FOREIGN KEY whistleblower_reports_tenant_id_fkey: FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: ai_usage_logs
//   Policy "auth_insert_ai_logs" (INSERT, PERMISSIVE) roles={anon,authenticated}
//     WITH CHECK: true
//   Policy "auth_read_ai_logs" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: assessment_schedules
//   Policy "tenant_isolation_assessments" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member(tenant_id)
//     WITH CHECK: is_tenant_member(tenant_id)
// Table: audit_logs
//   Policy "tenant_isolation_audit_logs" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member(tenant_id)
//     WITH CHECK: is_tenant_member(tenant_id)
// Table: communication_logs
//   Policy "auth_read_logs" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((tenant_id IS NULL) OR is_tenant_member_uuid(tenant_id))
// Table: compliance_documents
//   Policy "tenant_docs_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)
//     WITH CHECK: is_tenant_member_uuid(tenant_id)
// Table: compliance_history
//   Policy "tenant_isolation_history" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member(tenant_id)
//     WITH CHECK: is_tenant_member(tenant_id)
// Table: controls_library
//   Policy "auth_all_ctrl_lib" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)
// Table: dd_conflict_declarations
//   Policy "auth_insert_ddcd" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: is_tenant_member_uuid(tenant_id)
//   Policy "auth_select_ddcd" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)
//   Policy "auth_update_ddcd" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)
// Table: dd_red_flags
//   Policy "auth_delete_ddrf" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM due_diligence_processes ddp   WHERE ((ddp.id = dd_red_flags.process_id) AND is_tenant_member_uuid(ddp.tenant_id))))
//   Policy "auth_insert_ddrf" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM due_diligence_processes ddp   WHERE ((ddp.id = dd_red_flags.process_id) AND is_tenant_member_uuid(ddp.tenant_id))))
//   Policy "auth_select_ddrf" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM due_diligence_processes ddp   WHERE ((ddp.id = dd_red_flags.process_id) AND is_tenant_member_uuid(ddp.tenant_id))))
//   Policy "auth_update_ddrf" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM due_diligence_processes ddp   WHERE ((ddp.id = dd_red_flags.process_id) AND is_tenant_member_uuid(ddp.tenant_id))))
// Table: document_templates
//   Policy "auth_insert_templates_doc" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((tenant_id IS NOT NULL) AND is_tenant_member_uuid(tenant_id))
//   Policy "auth_read_templates_doc" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((tenant_id IS NULL) OR is_tenant_member_uuid(tenant_id))
//   Policy "auth_update_templates_doc" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((tenant_id IS NOT NULL) AND is_tenant_member_uuid(tenant_id))
// Table: document_versions
//   Policy "tenant_doc_versions_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM compliance_documents d   WHERE ((d.id = document_versions.document_id) AND is_tenant_member_uuid(d.tenant_id))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM compliance_documents d   WHERE ((d.id = document_versions.document_id) AND is_tenant_member_uuid(d.tenant_id))))
// Table: due_diligence_processes
//   Policy "auth_insert_ddp" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: is_tenant_member_uuid(tenant_id)
//   Policy "auth_select_ddp" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)
//   Policy "auth_update_ddp" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)
// Table: email_templates
//   Policy "auth_all_templates" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "auth_read_templates" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((tenant_id IS NULL) OR is_tenant_member_uuid(tenant_id))
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
// Table: form_collection_tokens
//   Policy "anon_read_tokens" (SELECT, PERMISSIVE) roles={anon}
//     USING: ((is_used = false) AND (is_revoked = false) AND (expires_at > now()))
//   Policy "auth_all_tokens" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)
//     WITH CHECK: is_tenant_member_uuid(tenant_id)
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
// Table: report_messages
//   Policy "anon_insert_messages" (INSERT, PERMISSIVE) roles={anon}
//     WITH CHECK: true
//   Policy "anon_select_messages" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "auth_insert_messages" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM whistleblower_reports wr   WHERE ((wr.id = report_messages.report_id) AND is_tenant_member_uuid(wr.tenant_id))))
//   Policy "auth_select_messages" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM whistleblower_reports wr   WHERE ((wr.id = report_messages.report_id) AND is_tenant_member_uuid(wr.tenant_id))))
// Table: risk_assessments
//   Policy "auth_all_risk_ass" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM risk_register r   WHERE ((r.id = risk_assessments.risk_id) AND is_tenant_member_uuid(r.tenant_id))))
// Table: risk_controls
//   Policy "auth_all_risk_ctrl" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM risk_register r   WHERE ((r.id = risk_controls.risk_id) AND is_tenant_member_uuid(r.tenant_id))))
// Table: risk_methodologies
//   Policy "auth_all_risk_meth" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)
// Table: risk_methodology_versions
//   Policy "auth_all_risk_meth_ver" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM risk_methodologies m   WHERE ((m.id = risk_methodology_versions.methodology_id) AND is_tenant_member_uuid(m.tenant_id))))
// Table: risk_register
//   Policy "auth_all_risk_reg" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)
// Table: risk_treatments
//   Policy "auth_all_risk_treat" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM risk_register r   WHERE ((r.id = risk_treatments.risk_id) AND is_tenant_member_uuid(r.tenant_id))))
// Table: risks
//   Policy "tenant_isolation_risks" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member(tenant_id)
//     WITH CHECK: is_tenant_member(tenant_id)
// Table: tenants
//   Policy "anon_read_tenants" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
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
// Table: whistleblower_reports
//   Policy "anon_insert_reports" (INSERT, PERMISSIVE) roles={anon}
//     WITH CHECK: true
//   Policy "auth_insert_reports" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: is_tenant_member_uuid(tenant_id)
//   Policy "auth_select_reports" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)
//   Policy "auth_update_reports" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: is_tenant_member_uuid(tenant_id)

// --- DATABASE FUNCTIONS ---
// FUNCTION check_report_credentials(uuid, text, text)
//   CREATE OR REPLACE FUNCTION public.check_report_credentials(p_tenant_id uuid, p_protocol text, p_password text)
//    RETURNS uuid
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_report_id UUID;
//   BEGIN
//       SELECT id INTO v_report_id
//       FROM public.whistleblower_reports
//       WHERE tenant_id = p_tenant_id
//         AND protocol_number = p_protocol
//         AND access_password_hash = crypt(p_password, access_password_hash)
//       LIMIT 1;
//
//       RETURN v_report_id;
//   END;
//   $function$
//
// FUNCTION cleanup_tenant_mock_data()
//   CREATE OR REPLACE FUNCTION public.cleanup_tenant_mock_data()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       DELETE FROM public.assessment_schedules WHERE tenant_id = OLD.id::text;
//       DELETE FROM public.audit_logs WHERE tenant_id = OLD.id::text;
//       DELETE FROM public.compliance_history WHERE tenant_id = OLD.id::text;
//       DELETE FROM public.evidence_metadata WHERE tenant_id = OLD.id::text;
//       DELETE FROM public.gaps WHERE tenant_id = OLD.id::text;
//       DELETE FROM public.risks WHERE tenant_id = OLD.id::text;
//       RETURN OLD;
//   END;
//   $function$
//
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
// FUNCTION hash_report_password()
//   CREATE OR REPLACE FUNCTION public.hash_report_password()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     IF NEW.access_password_hash IS NOT NULL THEN
//       -- Only hash if it doesn't look like a bcrypt hash already
//       IF NEW.access_password_hash NOT LIKE '$2a$%' THEN
//         NEW.access_password_hash = crypt(NEW.access_password_hash, gen_salt('bf'));
//       END IF;
//     END IF;
//     RETURN NEW;
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
// FUNCTION submit_form_collection(uuid, jsonb)
//   CREATE OR REPLACE FUNCTION public.submit_form_collection(p_token uuid, p_payload jsonb)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_token_record record;
//   BEGIN
//       SELECT * INTO v_token_record
//       FROM public.form_collection_tokens
//       WHERE token = p_token AND is_used = false AND is_revoked = false AND expires_at > NOW();
//
//       IF NOT FOUND THEN
//           RAISE EXCEPTION 'Token inválido, revogado ou expirado.';
//       END IF;
//
//       IF v_token_record.form_type = 'onboarding' THEN
//           UPDATE public.tenants
//           SET
//               step_1 = COALESCE(p_payload->'step_1', step_1),
//               step_2 = COALESCE(p_payload->'step_2', step_2),
//               step_3 = COALESCE(p_payload->'step_3', step_3),
//               step_4 = COALESCE(p_payload->'step_4', step_4),
//               step_5 = COALESCE(p_payload->'step_5', step_5),
//               step_6 = COALESCE(p_payload->'step_6', step_6),
//               name = COALESCE(p_payload->'step_1'->>'razao_social', name),
//               cnpj = COALESCE(p_payload->'step_1'->>'cnpj', cnpj)
//           WHERE id = v_token_record.tenant_id;
//       ELSIF v_token_record.form_type = 'context' THEN
//           UPDATE public.tenants
//           SET context_data = p_payload
//           WHERE id = v_token_record.tenant_id;
//       END IF;
//
//       UPDATE public.form_collection_tokens
//       SET is_used = true
//       WHERE id = v_token_record.id;
//
//       INSERT INTO public.audit_logs (tenant_id, clause_id, action, user_email)
//       VALUES (v_token_record.tenant_id, 'form_collection', 'Dados recebidos via formulário externo (' || v_token_record.form_type || ')', 'cliente_externo');
//
//       RETURN jsonb_build_object('success', true, 'tenant_id', v_token_record.tenant_id);
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: tenants
//   trg_add_tenant_creator: CREATE TRIGGER trg_add_tenant_creator AFTER INSERT ON public.tenants FOR EACH ROW EXECUTE FUNCTION fn_add_tenant_creator()
//   trg_cleanup_tenant_mock_data: CREATE TRIGGER trg_cleanup_tenant_mock_data AFTER DELETE ON public.tenants FOR EACH ROW EXECUTE FUNCTION cleanup_tenant_mock_data()
// Table: whistleblower_reports
//   trg_hash_report_password: CREATE TRIGGER trg_hash_report_password BEFORE INSERT OR UPDATE OF access_password_hash ON public.whistleblower_reports FOR EACH ROW EXECUTE FUNCTION hash_report_password()

// --- INDEXES ---
// Table: ai_usage_logs
//   CREATE INDEX ai_usage_logs_created_at_idx ON public.ai_usage_logs USING btree (created_at)
//   CREATE INDEX ai_usage_logs_tenant_id_idx ON public.ai_usage_logs USING btree (tenant_id)
// Table: invitations
//   CREATE UNIQUE INDEX invitations_email_tenant_idx ON public.invitations USING btree (email, tenant_id)
// Table: whistleblower_reports
//   CREATE UNIQUE INDEX whistleblower_reports_protocol_number_key ON public.whistleblower_reports USING btree (protocol_number)
