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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cards: {
        Row: {
          active: boolean
          brand: string
          created_at: string
          exp_month: number
          exp_year: number
          holder: string
          id: string
          is_default: boolean
          last4: string
          profile_id: string
        }
        Insert: {
          active?: boolean
          brand: string
          created_at?: string
          exp_month: number
          exp_year: number
          holder: string
          id?: string
          is_default?: boolean
          last4: string
          profile_id: string
        }
        Update: {
          active?: boolean
          brand?: string
          created_at?: string
          exp_month?: number
          exp_year?: number
          holder?: string
          id?: string
          is_default?: boolean
          last4?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_entries: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string
          id: string
          payment_order_id: string | null
          profile_id: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description: string
          id?: string
          payment_order_id?: string | null
          profile_id?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string
          id?: string
          payment_order_id?: string | null
          profile_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_payment_order_id_fkey"
            columns: ["payment_order_id"]
            isOneToOne: false
            referencedRelation: "payment_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_orders: {
        Row: {
          amount: number
          amount_received: number
          created_at: string
          fee: number
          id: string
          note: string | null
          receiver_country_code: string
          receiver_profile_id: string | null
          receiver_username: string
          reference: string
          sender_country_code: string
          sender_profile_id: string
          sender_username: string
          settled: boolean
          source_currency: string
          status: string
          target_currency: string
        }
        Insert: {
          amount: number
          amount_received: number
          created_at?: string
          fee: number
          id?: string
          note?: string | null
          receiver_country_code: string
          receiver_profile_id?: string | null
          receiver_username: string
          reference: string
          sender_country_code: string
          sender_profile_id: string
          sender_username: string
          settled?: boolean
          source_currency?: string
          status?: string
          target_currency?: string
        }
        Update: {
          amount?: number
          amount_received?: number
          created_at?: string
          fee?: number
          id?: string
          note?: string | null
          receiver_country_code?: string
          receiver_profile_id?: string | null
          receiver_username?: string
          reference?: string
          sender_country_code?: string
          sender_profile_id?: string
          sender_username?: string
          settled?: boolean
          source_currency?: string
          status?: string
          target_currency?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_orders_receiver_profile_id_fkey"
            columns: ["receiver_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_orders_sender_profile_id_fkey"
            columns: ["sender_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_accounts: {
        Row: {
          active: boolean
          alias: string | null
          created_at: string
          holder: string
          iban: string
          id: string
          is_default: boolean
          profile_id: string
        }
        Insert: {
          active?: boolean
          alias?: string | null
          created_at?: string
          holder: string
          iban: string
          id?: string
          is_default?: boolean
          profile_id: string
        }
        Update: {
          active?: boolean
          alias?: string | null
          created_at?: string
          holder?: string
          iban?: string
          id?: string
          is_default?: boolean
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_accounts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string
          country_code: string
          created_at: string
          currency: string
          display_name: string
          id: string
          id_number: string | null
          last_username_change_at: string | null
          user_id: string | null
          username: string
          verified: boolean
        }
        Insert: {
          avatar_url?: string | null
          country: string
          country_code: string
          created_at?: string
          currency?: string
          display_name: string
          id?: string
          id_number?: string | null
          last_username_change_at?: string | null
          user_id?: string | null
          username: string
          verified?: boolean
        }
        Update: {
          avatar_url?: string | null
          country?: string
          country_code?: string
          created_at?: string
          currency?: string
          display_name?: string
          id?: string
          id_number?: string | null
          last_username_change_at?: string | null
          user_id?: string | null
          username?: string
          verified?: boolean
        }
        Relationships: []
      }
      username_history: {
        Row: {
          changed_at: string
          id: string
          new_username: string
          old_username: string
          profile_id: string
        }
        Insert: {
          changed_at?: string
          id?: string
          new_username: string
          old_username: string
          profile_id: string
        }
        Update: {
          changed_at?: string
          id?: string
          new_username?: string
          old_username?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "username_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets_demo: {
        Row: {
          balance: number
          currency: string
          id: string
          profile_id: string
        }
        Insert: {
          balance?: number
          currency?: string
          id?: string
          profile_id: string
        }
        Update: {
          balance?: number
          currency?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_demo_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

