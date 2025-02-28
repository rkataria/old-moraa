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
      asset_library: {
        Row: {
          created_at: string
          deleted_at: string | null
          file_type: string | null
          id: string
          is_deleted: boolean | null
          path: string | null
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          file_type?: string | null
          id?: string
          is_deleted?: boolean | null
          path?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          file_type?: string | null
          id?: string
          is_deleted?: boolean | null
          path?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'asset_library_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
      breakout_activity: {
        Row: {
          activity_frame_id: string | null
          breakout_frame_id: string | null
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          activity_frame_id?: string | null
          breakout_frame_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          activity_frame_id?: string | null
          breakout_frame_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'breakout_activity_activity_frame_id_fkey'
            columns: ['activity_frame_id']
            isOneToOne: false
            referencedRelation: 'frame'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'breakout_activity_breakout_frame_id_fkey'
            columns: ['breakout_frame_id']
            isOneToOne: false
            referencedRelation: 'frame'
            referencedColumns: ['id']
          },
        ]
      }
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
          active: boolean | null
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
          active?: boolean | null
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
          active?: boolean | null
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
      library: {
        Row: {
          created_at: string
          frame_id: string | null
          id: number
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          frame_id?: string | null
          id?: number
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          frame_id?: string | null
          id?: number
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'library_frame_id_fkey'
            columns: ['frame_id']
            isOneToOne: false
            referencedRelation: 'frame'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'library_profile_id_fkey'
            columns: ['profile_id']
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
          sections: string[] | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          dyte_meeting_id?: string | null
          event_id?: string | null
          id?: string
          sections?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          dyte_meeting_id?: string | null
          event_id?: string | null
          id?: string
          sections?: string[] | null
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
          presence_color: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          presence_color?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          presence_color?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      reaction: {
        Row: {
          created_at: string
          details: Json | null
          dyte_meeting_id: string | null
          frame_response_id: string | null
          id: string
          name: string | null
          participant_id: string | null
          reaction: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          dyte_meeting_id?: string | null
          frame_response_id?: string | null
          id?: string
          name?: string | null
          participant_id?: string | null
          reaction?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          dyte_meeting_id?: string | null
          frame_response_id?: string | null
          id?: string
          name?: string | null
          participant_id?: string | null
          reaction?: string | null
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
      recording: {
        Row: {
          created_at: string
          duration: number | null
          dyte_session_id: string | null
          file_size: number | null
          id: string
          meeting_id: string | null
          recording_name: string | null
          recording_url: string | null
          started_at: string | null
          stopped_at: string | null
          summary_name: string | null
          summary_url: string | null
          transcript_name: string | null
          transcript_url: string | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          dyte_session_id?: string | null
          file_size?: number | null
          id?: string
          meeting_id?: string | null
          recording_name?: string | null
          recording_url?: string | null
          started_at?: string | null
          stopped_at?: string | null
          summary_name?: string | null
          summary_url?: string | null
          transcript_name?: string | null
          transcript_url?: string | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          dyte_session_id?: string | null
          file_size?: number | null
          id?: string
          meeting_id?: string | null
          recording_name?: string | null
          recording_url?: string | null
          started_at?: string | null
          stopped_at?: string | null
          summary_name?: string | null
          summary_url?: string | null
          transcript_name?: string | null
          transcript_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'recording_meeting_id_fkey'
            columns: ['meeting_id']
            isOneToOne: false
            referencedRelation: 'meeting'
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
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string
          frames?: string[] | null
          id?: string
          meeting_id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string
          frames?: string[] | null
          id?: string
          meeting_id?: string | null
          name?: string | null
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
      get_breakout_activities_for_meeting: {
        Args: {
          meeting_id_input: string
          limit_input: number
          offset_input: number
          search_input: string
        }
        Returns: Json
      }
      get_or_create_session: {
        Args: {
          meeting_id_input: string
          dyte_meeting_id_input: string
          default_data_input: Json
        }
        Returns: Record<string, unknown>
      }
      insert_breakout_activities: {
        Args: {
          breakout_id_input: string
          activity_count: number
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
