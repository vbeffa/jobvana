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
    PostgrestVersion: '13.0.4'
  }
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string
          id: number
          job_id: number
          reason: string | null
          status: Database['public']['Enums']['application_status'] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          job_id: number
          reason?: string | null
          status?: Database['public']['Enums']['application_status'] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          job_id?: number
          reason?: string | null
          status?: Database['public']['Enums']['application_status'] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'job_applications_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
        ]
      }
      companies: {
        Row: {
          contact_email: string | null
          created_at: string
          description: string
          id: number
          industry_id: number
          interview_process: Json | null
          name: string
          num_employees: number
          user_id: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          description: string
          id?: number
          industry_id: number
          interview_process?: Json | null
          name: string
          num_employees: number
          user_id?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          description?: string
          id?: number
          industry_id?: number
          interview_process?: Json | null
          name?: string
          num_employees?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'companies_industry_id_fkey'
            columns: ['industry_id']
            isOneToOne: false
            referencedRelation: 'industries'
            referencedColumns: ['id']
          },
        ]
      }
      company_addresses: {
        Row: {
          city: string
          company_id: number
          id: number
          phone: string | null
          state: string
          street: string
          street_2: string | null
          type: Database['public']['Enums']['address_type']
          zip: string
        }
        Insert: {
          city: string
          company_id: number
          id?: number
          phone?: string | null
          state: string
          street: string
          street_2?: string | null
          type: Database['public']['Enums']['address_type']
          zip: string
        }
        Update: {
          city?: string
          company_id?: number
          id?: number
          phone?: string | null
          state?: string
          street?: string
          street_2?: string | null
          type?: Database['public']['Enums']['address_type']
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: 'addresses_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      company_tech_stacks: {
        Row: {
          company_id: number
          skill_version_id: number
        }
        Insert: {
          company_id: number
          skill_version_id: number
        }
        Update: {
          company_id?: number
          skill_version_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'tech_stacks_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tech_stacks_skill_version_id_fkey'
            columns: ['skill_version_id']
            isOneToOne: false
            referencedRelation: 'skill_versions'
            referencedColumns: ['id']
          },
        ]
      }
      industries: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      interview_rounds: {
        Row: {
          created_at: string
          id: number
          interview_id: number
          round: number
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          interview_id: number
          round: number
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          interview_id?: number
          round?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'interview_rounds_interview_id_fkey'
            columns: ['interview_id']
            isOneToOne: false
            referencedRelation: 'interviews'
            referencedColumns: ['id']
          },
        ]
      }
      interviews: {
        Row: {
          application_id: number
          created_at: string
          id: number
          status: string | null
        }
        Insert: {
          application_id: number
          created_at?: string
          id?: number
          status?: string | null
        }
        Update: {
          application_id?: number
          created_at?: string
          id?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'interviews_application_id_fkey'
            columns: ['application_id']
            isOneToOne: true
            referencedRelation: 'applications'
            referencedColumns: ['id']
          },
        ]
      }
      job_roles: {
        Row: {
          job_id: number
          percent: number
          role_id: number
          role_level: number
        }
        Insert: {
          job_id: number
          percent: number
          role_id: number
          role_level?: number
        }
        Update: {
          job_id?: number
          percent?: number
          role_id?: number
          role_level?: number
        }
        Relationships: [
          {
            foreignKeyName: 'job_roles_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'job_roles_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          },
        ]
      }
      job_skill_versions: {
        Row: {
          job_id: number
          skill_version_id: number
        }
        Insert: {
          job_id: number
          skill_version_id: number
        }
        Update: {
          job_id?: number
          skill_version_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'job_skill_versions_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'job_skill_versions_skill_version_id_fkey'
            columns: ['skill_version_id']
            isOneToOne: false
            referencedRelation: 'skill_versions'
            referencedColumns: ['id']
          },
        ]
      }
      job_skills: {
        Row: {
          job_id: number
          skill_id: number
        }
        Insert: {
          job_id: number
          skill_id: number
        }
        Update: {
          job_id?: number
          skill_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'job_skills_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'job_skills_skill_id_fkey'
            columns: ['skill_id']
            isOneToOne: false
            referencedRelation: 'skills'
            referencedColumns: ['id']
          },
        ]
      }
      jobs: {
        Row: {
          company_address_id: number | null
          company_id: number
          created_at: string
          description: string | null
          id: number
          salary_high: number
          salary_low: number
          salary_type: Database['public']['Enums']['job_salary_type']
          status: Database['public']['Enums']['job_status']
          title: string
          type: Database['public']['Enums']['job_type']
          updated_at: string
        }
        Insert: {
          company_address_id?: number | null
          company_id: number
          created_at?: string
          description?: string | null
          id?: number
          salary_high: number
          salary_low: number
          salary_type?: Database['public']['Enums']['job_salary_type']
          status?: Database['public']['Enums']['job_status']
          title: string
          type?: Database['public']['Enums']['job_type']
          updated_at?: string
        }
        Update: {
          company_address_id?: number | null
          company_id?: number
          created_at?: string
          description?: string | null
          id?: number
          salary_high?: number
          salary_low?: number
          salary_type?: Database['public']['Enums']['job_salary_type']
          status?: Database['public']['Enums']['job_status']
          title?: string
          type?: Database['public']['Enums']['job_type']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'jobs_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'jobs_location_fkey'
            columns: ['company_address_id']
            isOneToOne: false
            referencedRelation: 'company_addresses'
            referencedColumns: ['id']
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: number
          name: string
          reference: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          reference?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          reference?: string | null
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          description: string | null
          id: number
          name: string
          notes: string | null
          parent_skill_category_id: number | null
          reference: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          notes?: string | null
          parent_skill_category_id?: number | null
          reference?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          notes?: string | null
          parent_skill_category_id?: number | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'skill_categories_parent_skill_category_id_fkey'
            columns: ['parent_skill_category_id']
            isOneToOne: false
            referencedRelation: 'skill_categories'
            referencedColumns: ['id']
          },
        ]
      }
      skill_relations: {
        Row: {
          is_bidirectional: boolean
          related_skill_id: number
          skill_id: number
        }
        Insert: {
          is_bidirectional?: boolean
          related_skill_id: number
          skill_id: number
        }
        Update: {
          is_bidirectional?: boolean
          related_skill_id?: number
          skill_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'skill_relations_related_skill_id_fkey'
            columns: ['related_skill_id']
            isOneToOne: false
            referencedRelation: 'skills'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'skill_relations_skill_id_fkey'
            columns: ['skill_id']
            isOneToOne: false
            referencedRelation: 'skills'
            referencedColumns: ['id']
          },
        ]
      }
      skill_versions: {
        Row: {
          id: number
          notes: string | null
          ordinal: number
          reference: string | null
          release_date: string
          skill_id: number
          version: string
        }
        Insert: {
          id?: number
          notes?: string | null
          ordinal: number
          reference?: string | null
          release_date: string
          skill_id: number
          version: string
        }
        Update: {
          id?: number
          notes?: string | null
          ordinal?: number
          reference?: string | null
          release_date?: string
          skill_id?: number
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: 'skill_versions_skill_id_fkey'
            columns: ['skill_id']
            isOneToOne: false
            referencedRelation: 'skills'
            referencedColumns: ['id']
          },
        ]
      }
      skills: {
        Row: {
          abbreviation: string | null
          description: string | null
          id: number
          name: string
          notes: string | null
          reference: string | null
          skill_category_id: number
        }
        Insert: {
          abbreviation?: string | null
          description?: string | null
          id?: number
          name: string
          notes?: string | null
          reference?: string | null
          skill_category_id: number
        }
        Update: {
          abbreviation?: string | null
          description?: string | null
          id?: number
          name?: string
          notes?: string | null
          reference?: string | null
          skill_category_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'skills_skill_category_id_fkey'
            columns: ['skill_category_id']
            isOneToOne: false
            referencedRelation: 'skill_categories'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      foo: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      address_type: 'headquarters' | 'office'
      application_status: 'accepted' | 'rejected'
      job_salary_type: 'annual' | 'hourly'
      job_status: 'open' | 'filled' | 'closed'
      job_type: 'full_time' | 'part_time' | 'contract' | 'internship'
      user_type: 'company' | 'job_seeker'
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
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
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
      address_type: ['headquarters', 'office'],
      application_status: ['accepted', 'rejected'],
      job_salary_type: ['annual', 'hourly'],
      job_status: ['open', 'filled', 'closed'],
      job_type: ['full_time', 'part_time', 'contract', 'internship'],
      user_type: ['company', 'job_seeker'],
    },
  },
} as const
