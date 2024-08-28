import { Tables } from './supabase-db'

export type EventModel = Tables<{ schema: 'public' }, 'event'>
export type MeetingModel = Tables<{ schema: 'public' }, 'meeting'>
export type SectionModel = Tables<{ schema: 'public' }, 'section'>
export type FrameModel = Tables<{ schema: 'public' }, 'frame'>
export type SessionModel = Tables<{ schema: 'public' }, 'session'>
