export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      doctors: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          inami_number: string | null
          is_active: boolean | null
          last_name: string
          phone: string | null
          postal_code: string | null
          specialty: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          inami_number?: string | null
          is_active?: boolean | null
          last_name: string
          phone?: string | null
          postal_code?: string | null
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          inami_number?: string | null
          is_active?: boolean | null
          last_name?: string
          phone?: string | null
          postal_code?: string | null
          specialty?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      medication_composition: {
        Row: {
          active_substance: string
          cnk: string
          created_at: string
          id: string
          strength: string | null
          unit: string | null
        }
        Insert: {
          active_substance: string
          cnk: string
          created_at?: string
          id?: string
          strength?: string | null
          unit?: string | null
        }
        Update: {
          active_substance?: string
          cnk?: string
          created_at?: string
          id?: string
          strength?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_composition_cnk_fkey"
            columns: ["cnk"]
            isOneToOne: false
            referencedRelation: "medication_info"
            referencedColumns: ["cnk"]
          },
        ]
      }
      medication_doses: {
        Row: {
          created_at: string
          id: string
          is_taken: boolean
          medication_id: string
          scheduled_date: string
          taken_at: string | null
          time_of_day: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_taken?: boolean
          medication_id: string
          scheduled_date: string
          taken_at?: string | null
          time_of_day: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_taken?: boolean
          medication_id?: string
          scheduled_date?: string
          taken_at?: string | null
          time_of_day?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_doses_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_info: {
        Row: {
          atc_code: string | null
          category: string | null
          cnk: string
          company: string | null
          created_at: string
          delivery_status: string | null
          id: string
          name: string
          pack_size: string | null
          prescription_type: string | null
          public_price: number | null
          reimbursement_code: string | null
          reimbursement_rate: string | null
          updated_at: string
        }
        Insert: {
          atc_code?: string | null
          category?: string | null
          cnk: string
          company?: string | null
          created_at?: string
          delivery_status?: string | null
          id?: string
          name: string
          pack_size?: string | null
          prescription_type?: string | null
          public_price?: number | null
          reimbursement_code?: string | null
          reimbursement_rate?: string | null
          updated_at?: string
        }
        Update: {
          atc_code?: string | null
          category?: string | null
          cnk?: string
          company?: string | null
          created_at?: string
          delivery_status?: string | null
          id?: string
          name?: string
          pack_size?: string | null
          prescription_type?: string | null
          public_price?: number | null
          reimbursement_code?: string | null
          reimbursement_rate?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      medication_presentations: {
        Row: {
          cnk: string
          created_at: string
          delivery_status: string | null
          id: string
          name: string
          pack_size: string | null
          presentation_cnk: string
          public_price: number | null
          reimbursement_code: string | null
          reimbursement_rate: string | null
        }
        Insert: {
          cnk: string
          created_at?: string
          delivery_status?: string | null
          id?: string
          name: string
          pack_size?: string | null
          presentation_cnk: string
          public_price?: number | null
          reimbursement_code?: string | null
          reimbursement_rate?: string | null
        }
        Update: {
          cnk?: string
          created_at?: string
          delivery_status?: string | null
          id?: string
          name?: string
          pack_size?: string | null
          presentation_cnk?: string
          public_price?: number | null
          reimbursement_code?: string | null
          reimbursement_rate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_presentations_cnk_fkey"
            columns: ["cnk"]
            isOneToOne: false
            referencedRelation: "medication_info"
            referencedColumns: ["cnk"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          days_of_week: string[]
          description: string | null
          doctor_id: string | null
          dosage: string
          id: string
          info_link: string | null
          medication_info_cnk: string | null
          name: string
          notes: string | null
          prescribing_doctor: string | null
          time_of_day: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          days_of_week: string[]
          description?: string | null
          doctor_id?: string | null
          dosage: string
          id?: string
          info_link?: string | null
          medication_info_cnk?: string | null
          name: string
          notes?: string | null
          prescribing_doctor?: string | null
          time_of_day: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          days_of_week?: string[]
          description?: string | null
          doctor_id?: string | null
          dosage?: string
          id?: string
          info_link?: string | null
          medication_info_cnk?: string | null
          name?: string
          notes?: string | null
          prescribing_doctor?: string | null
          time_of_day?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_medication_info_cnk_fkey"
            columns: ["medication_info_cnk"]
            isOneToOne: false
            referencedRelation: "medication_info"
            referencedColumns: ["cnk"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_verified: boolean | null
          last_login: string | null
          last_name: string | null
          name: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          is_verified?: boolean | null
          last_login?: string | null
          last_name?: string | null
          name?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_login?: string | null
          last_name?: string | null
          name?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          created_at: string
          emoji: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          emoji?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          emoji?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      verify_user_password: {
        Args: { user_email: string; current_password: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
