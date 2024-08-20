import { SupabaseTables } from '../../types/supabase-db-overrides'

export type CreateEventPayload = Pick<
  SupabaseTables<'event'>,
  'name' | 'description' | 'type'
>

// export type ScheduleEventPayload = Pick<
//   SupabaseTables<'event'>,
//   'startDate' | 'endDate' | 'timezone' | 'id'
// >

export type ScheduleEventPayload = {
  id: string
  startDate: string
  endDate: string
  timezone: string
  imageUrl: string
  name: string
  description: string
}
