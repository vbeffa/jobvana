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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          created_at: string
          id: number
          name: string
          num_employees: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          num_employees: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          num_employees?: number
        }
        Relationships: []
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
            foreignKeyName: "job_skill_versions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_skill_versions_skill_version_id_fkey"
            columns: ["skill_version_id"]
            isOneToOne: false
            referencedRelation: "skill_versions"
            referencedColumns: ["id"]
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
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company_id: number
          created_at: string
          description: string | null
          id: number
          salary_range: unknown
          status: Database["public"]["Enums"]["job_status"]
          title: string
        }
        Insert: {
          company_id: number
          created_at?: string
          description?: string | null
          id?: number
          salary_range: unknown
          status?: Database["public"]["Enums"]["job_status"]
          title: string
        }
        Update: {
          company_id?: number
          created_at?: string
          description?: string | null
          id?: number
          salary_range?: unknown
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs2_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          role: string
        }
        Insert: {
          id?: number
          role: string
        }
        Update: {
          id?: number
          role?: string
        }
        Relationships: []
      }
      skill_relations: {
        Row: {
          related_skill_id: number
          skill_id: number
        }
        Insert: {
          related_skill_id: number
          skill_id: number
        }
        Update: {
          related_skill_id?: number
          skill_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "skill_relations_related_skill_id_fkey"
            columns: ["related_skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_relations_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_types: {
        Row: {
          description: string | null
          id: number
          name: string
          notes: string | null
          parent_skill_type_id: number | null
          reference: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          notes?: string | null
          parent_skill_type_id?: number | null
          reference?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          notes?: string | null
          parent_skill_type_id?: number | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_types_parent_skill_type_id_fkey"
            columns: ["parent_skill_type_id"]
            isOneToOne: false
            referencedRelation: "skill_types"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_versions: {
        Row: {
          id: number
          notes: string | null
          reference: string | null
          release_date: string | null
          skill_id: number
          version: string
        }
        Insert: {
          id?: number
          notes?: string | null
          reference?: string | null
          release_date?: string | null
          skill_id: number
          version: string
        }
        Update: {
          id?: number
          notes?: string | null
          reference?: string | null
          release_date?: string | null
          skill_id?: number
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_versions_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
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
          skill_type_id: number
        }
        Insert: {
          abbreviation?: string | null
          description?: string | null
          id?: number
          name: string
          notes?: string | null
          reference?: string | null
          skill_type_id: number
        }
        Update: {
          abbreviation?: string | null
          description?: string | null
          id?: number
          name?: string
          notes?: string | null
          reference?: string | null
          skill_type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "skills_skill_type_id_fkey"
            columns: ["skill_type_id"]
            isOneToOne: false
            referencedRelation: "skill_types"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: number
          last_name: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: number
          last_name: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: number
          last_name?: string
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
      job_status: "open" | "filled" | "closed"
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
    Enums: {
      job_status: ["open", "filled", "closed"],
    },
  },
} as const
