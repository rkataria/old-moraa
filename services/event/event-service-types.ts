import { SupabaseTables } from '../types/supabase-db-overrides'

export type CreateEventPayload = Pick<
  SupabaseTables<'event'>,
  'name' | 'description' | 'type'
>

export type ScheduleEventPayload = Pick<
  SupabaseTables<'event'>,
  'start_date' | 'end_date' | 'timezone' | 'id'
>
