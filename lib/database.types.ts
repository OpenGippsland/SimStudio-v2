export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      coach_payments: {
        Row: {
          id: number
          coach_id: number
          user_id: number
          amount: number
          reference_id: string
          status: string
          created_at: string
          booking_id: number | null
        }
        Insert: {
          id?: number
          coach_id: number
          user_id: number
          amount: number
          reference_id: string
          status: string
          created_at?: string
          booking_id?: number | null
        }
        Update: {
          id?: number
          coach_id?: number
          user_id?: number
          amount?: number
          reference_id?: string
          status?: string
          created_at?: string
          booking_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_payments_coach_id_fkey"
            columns: ["coach_id"]
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_payments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_payments_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      coach_profiles: {
        Row: {
          id: number
          user_id: number
          hourly_rate: number
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: number
          hourly_rate: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          hourly_rate?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      temp_users: {
        Row: {
          id: number
          reference_id: string
          email: string
          first_name: string | null
          created_at: string
        }
        Insert: {
          id?: number
          reference_id: string
          email: string
          first_name?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          reference_id?: string
          email?: string
          first_name?: string | null
          created_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_type: string | null
          cancellation_reason: string | null
          coach: string | null
          coaching_fee: number | null
          end_time: string | null
          has_coaching: boolean | null
          id: number
          payment_ref: string | null
          payment_status: string | null
          simulator_id: number | null
          start_time: string | null
          status: string | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          booking_type?: string | null
          cancellation_reason?: string | null
          coach?: string | null
          coaching_fee?: number | null
          end_time?: string | null
          has_coaching?: boolean | null
          id?: number
          payment_ref?: string | null
          payment_status?: string | null
          simulator_id?: number | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          booking_type?: string | null
          cancellation_reason?: string | null
          coach?: string | null
          coaching_fee?: number | null
          end_time?: string | null
          has_coaching?: boolean | null
          id?: number
          payment_ref?: string | null
          payment_status?: string | null
          simulator_id?: number | null
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          close_hour: number
          day_of_week: number
          id: number
          is_closed: boolean | null
          open_hour: number
        }
        Insert: {
          close_hour?: number
          day_of_week: number
          id?: number
          is_closed?: boolean | null
          open_hour?: number
        }
        Update: {
          close_hour?: number
          day_of_week?: number
          id?: number
          is_closed?: boolean | null
          open_hour?: number
        }
        Relationships: []
      }
      coach_availability: {
        Row: {
          coach_id: string
          day_of_week: number
          end_hour: number
          id: number
          start_hour: number
        }
        Insert: {
          coach_id: string
          day_of_week: number
          end_hour: number
          id?: number
          start_hour: number
        }
        Update: {
          coach_id?: string
          day_of_week?: number
          end_hour?: number
          id?: number
          start_hour?: number
        }
        Relationships: []
      }
      credits: {
        Row: {
          coaching_sessions: number | null
          simulator_hours: number | null
          user_id: number
        }
        Insert: {
          coaching_sessions?: number | null
          simulator_hours?: number | null
          user_id: number
        }
        Update: {
          coaching_sessions?: number | null
          simulator_hours?: number | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          description: string | null
          hours: number
          id: number
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          description?: string | null
          hours: number
          id?: number
          is_active?: boolean | null
          name: string
          price: number
        }
        Update: {
          description?: string | null
          hours?: number
          id?: number
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      special_dates: {
        Row: {
          close_hour: number | null
          date: string
          description: string | null
          id: number
          is_closed: boolean | null
          open_hour: number | null
        }
        Insert: {
          close_hour?: number | null
          date: string
          description?: string | null
          id?: number
          is_closed?: boolean | null
          open_hour?: number | null
        }
        Update: {
          close_hour?: number | null
          date?: string
          description?: string | null
          id?: number
          is_closed?: boolean | null
          open_hour?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: number
          user_id: string
          reference_id: string
          amount: number
          hours: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          reference_id: string
          amount: number
          hours: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          reference_id?: string
          amount?: number
          hours?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          updated_at: string | null
          name: string | null
          is_coach: boolean | null
          is_admin: boolean | null
          mobile_number: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          updated_at?: string | null
          name?: string | null
          is_coach?: boolean | null
          is_admin?: boolean | null
          mobile_number?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          updated_at?: string | null
          name?: string | null
          is_coach?: boolean | null
          is_admin?: boolean | null
          mobile_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_payments_table: {
        Args: Record<string, never>
        Returns: undefined
      },
      create_coach_profiles_table: {
        Args: Record<string, never>
        Returns: undefined
      },
      exec_sql: {
        Args: {
          sql: string
        }
        Returns: unknown
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
    Enums: {},
  },
} as const
