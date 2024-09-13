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
          role_id: string | null
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
          role_id?: string | null
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
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'enrollment_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'role'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_enrollment_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'event'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_enrollment_user_id_fkey'
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
          image_url: string | null
          name: string | null
          owner_id: string | null
          start_date: string | null
          status: string | null
          theme: Json | null
          timezone: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          theme?: Json | null
          timezone?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
          theme?: Json | null
          timezone?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_event_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
      frame: {
        Row: {
          config: Json | null
          content: Json | null
          created_at: string
          id: string
          meeting_id: string | null
          name: string | null
          notes: string | null
          section_id: string | null
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
          notes?: string | null
          section_id?: string | null
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
          notes?: string | null
          section_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'frame_meeting_id_fkey'
            columns: ['meeting_id']
            isOneToOne: false
            referencedRelation: 'meeting'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'frame_section_id_fkey'
            columns: ['section_id']
            isOneToOne: false
            referencedRelation: 'section'
            referencedColumns: ['id']
          },
        ]
      }
      frame_response: {
        Row: {
          created_at: string
          dyte_meeting_id: string | null
          frame_id: string | null
          id: string
          participant_id: string | null
          response: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          dyte_meeting_id?: string | null
          frame_id?: string | null
          id?: string
          participant_id?: string | null
          response?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          dyte_meeting_id?: string | null
          frame_id?: string | null
          id?: string
          participant_id?: string | null
          response?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'frame_response_frame_id_fkey'
            columns: ['frame_id']
            isOneToOne: false
            referencedRelation: 'frame'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'frame_response_participant_id_fkey'
            columns: ['participant_id']
            isOneToOne: false
            referencedRelation: 'participant'
            referencedColumns: ['id']
          },
        ]
      }
      meeting: {
        Row: {
          created_at: string
          dyte_meeting_id: string | null
          event_id: string | null
          frames: string[] | null
          id: string
          sections: string[] | null
          slides: string[] | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          dyte_meeting_id?: string | null
          event_id?: string | null
          frames?: string[] | null
          id?: string
          sections?: string[] | null
          slides?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          dyte_meeting_id?: string | null
          event_id?: string | null
          frames?: string[] | null
          id?: string
          sections?: string[] | null
          slides?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_meeting_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'event'
            referencedColumns: ['id']
          },
        ]
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          frame_id: string | null
          id: string
          slide_id: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          frame_id?: string | null
          id?: string
          slide_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          frame_id?: string | null
          id?: string
          slide_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'notes_frame_id_fkey'
            columns: ['frame_id']
            isOneToOne: true
            referencedRelation: 'frame'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'notes_slide_id_fkey'
            columns: ['slide_id']
            isOneToOne: true
            referencedRelation: 'slide'
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
            foreignKeyName: 'public_participant_enrollment_id_fkey'
            columns: ['enrollment_id']
            isOneToOne: false
            referencedRelation: 'enrollment'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_participant_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'session'
            referencedColumns: ['id']
          },
        ]
      }
      profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_profile_id_fkey'
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
          dyte_meeting_id: string | null
          frame_response_id: string | null
          id: string
          participant_id: string | null
          reaction: string | null
          slide_response_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          dyte_meeting_id?: string | null
          frame_response_id?: string | null
          id?: string
          participant_id?: string | null
          reaction?: string | null
          slide_response_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          dyte_meeting_id?: string | null
          frame_response_id?: string | null
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
            foreignKeyName: 'reaction_frame_response_id_fkey'
            columns: ['frame_response_id']
            isOneToOne: false
            referencedRelation: 'frame_response'
            referencedColumns: ['id']
          },
        ]
      }
      role: {
        Row: {
          created_at: string
          id: string
          name: string | null
          permissions: Json[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          permissions?: Json[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          permissions?: Json[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      section: {
        Row: {
          config: Json | null
          created_at: string
          frames: string[] | null
          id: string
          meeting_id: string | null
          name: string | null
          slides: string[] | null
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string
          frames?: string[] | null
          id?: string
          meeting_id?: string | null
          name?: string | null
          slides?: string[] | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string
          frames?: string[] | null
          id?: string
          meeting_id?: string | null
          name?: string | null
          slides?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_section_meeting_id_fkey'
            columns: ['meeting_id']
            isOneToOne: false
            referencedRelation: 'meeting'
            referencedColumns: ['id']
          },
        ]
      }
      session: {
        Row: {
          connected_dyte_meeting_id: string | null
          created_at: string
          data: Json | null
          id: string
          meeting_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          connected_dyte_meeting_id?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          meeting_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          connected_dyte_meeting_id?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          meeting_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_session_meeting_id_fkey'
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
          section_id: string | null
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
          section_id?: string | null
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
          section_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_slide_meeting_id_fkey'
            columns: ['meeting_id']
            isOneToOne: false
            referencedRelation: 'meeting'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_slide_section_id_fkey'
            columns: ['section_id']
            isOneToOne: false
            referencedRelation: 'section'
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
            foreignKeyName: 'public_slide_response_participant_id_fkey'
            columns: ['participant_id']
            isOneToOne: false
            referencedRelation: 'participant'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_slide_response_slide_id_fkey'
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
      add_object_to_frame: {
        Args: {
          p_frame_id: string
          p_object_id: string
          p_object_value: Json
        }
        Returns: undefined
      }
      add_or_replace_object_in_frame: {
        Args: {
          p_frame_id: string
          p_object_id: string
          p_object_value: Json
        }
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
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
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
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
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
