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
      enrollment: {
        Row: {
          created_at: string
          email: string | null
          event_id: string | null
          event_role: string | null
          id: string
          meeting_token: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_id?: string | null
          event_role?: string | null
          id?: string
          meeting_token?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          event_id?: string | null
          event_role?: string | null
          id?: string
          meeting_token?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'enrollment_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'event'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'enrollment_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
      event: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          meeting_id: string | null
          name: string | null
          owner_id: string | null
          start_date: string | null
          status: string | null
          timezone: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          meeting_id?: string | null
          name?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          timezone?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          meeting_id?: string | null
          name?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          timezone?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'event_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
      meeting: {
        Row: {
          created_at: string
          dyte_meeting_id: string | null
          event_id: string | null
          id: string
          slides: string[] | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          dyte_meeting_id?: string | null
          event_id?: string | null
          id?: string
          slides?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          dyte_meeting_id?: string | null
          event_id?: string | null
          id?: string
          slides?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'meeting_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'event'
            referencedColumns: ['id']
          },
        ]
      }
      participant: {
        Row: {
          created_at: string
          enrollment_id: string | null
          id: string
          session_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          enrollment_id?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          enrollment_id?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'participant_enrollment_id_fkey'
            columns: ['enrollment_id']
            isOneToOne: false
            referencedRelation: 'enrollment'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'participant_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'session'
            referencedColumns: ['id']
          },
        ]
      }
      profile: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profile_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      reaction: {
        Row: {
          created_at: string
          id: string
          participant_id: string | null
          reaction: string | null
          slide_response_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          participant_id?: string | null
          reaction?: string | null
          slide_response_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          participant_id?: string | null
          reaction?: string | null
          slide_response_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_reaction_participant_id_fkey'
            columns: ['participant_id']
            isOneToOne: false
            referencedRelation: 'participant'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_reaction_slide_response_id_fkey'
            columns: ['slide_response_id']
            isOneToOne: false
            referencedRelation: 'slide_response'
            referencedColumns: ['id']
          },
        ]
      }
      session: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          meeting_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          meeting_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          meeting_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'session_meeting_id_fkey'
            columns: ['meeting_id']
            isOneToOne: false
            referencedRelation: 'meeting'
            referencedColumns: ['id']
          },
        ]
      }
      slide: {
        Row: {
          config: Json | null
          content: Json | null
          created_at: string
          id: string
          meeting_id: string | null
          name: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          content?: Json | null
          created_at?: string
          id?: string
          meeting_id?: string | null
          name?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          content?: Json | null
          created_at?: string
          id?: string
          meeting_id?: string | null
          name?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'slide_meeting_id_fkey'
            columns: ['meeting_id']
            isOneToOne: false
            referencedRelation: 'meeting'
            referencedColumns: ['id']
          },
        ]
      }
      slide_response: {
        Row: {
          created_at: string
          dyte_meeting_id: string | null
          id: string
          participant_id: string | null
          response: Json | null
          slide_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          dyte_meeting_id?: string | null
          id?: string
          participant_id?: string | null
          response?: Json | null
          slide_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          dyte_meeting_id?: string | null
          id?: string
          participant_id?: string | null
          response?: Json | null
          slide_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'slide_response_participant_id_fkey'
            columns: ['participant_id']
            isOneToOne: false
            referencedRelation: 'participant'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'slide_response_slide_id_fkey'
            columns: ['slide_id']
            isOneToOne: false
            referencedRelation: 'slide'
            referencedColumns: ['id']
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
