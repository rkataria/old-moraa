import { Tables } from './supabase-db'

export type ProfileModel = Tables<{ schema: 'public' }, 'profile'>
export type EventModel = Tables<{ schema: 'public' }, 'event'>
export type MeetingModel = Tables<{ schema: 'public' }, 'meeting'>
export type SectionModel = Tables<{ schema: 'public' }, 'section'>
export type FrameModel = Tables<{ schema: 'public' }, 'frame'>
export type SessionModel = Tables<{ schema: 'public' }, 'session'>
export type ParticipantModel = Tables<{ schema: 'public' }, 'participant'>
export type EnrollmentModel = Tables<{ schema: 'public' }, 'enrollment'>
export type FramesLibraryModel = Tables<{ schema: 'public' }, 'library'>
export type AssetsLibraryModel = Tables<{ schema: 'public' }, 'asset_library'>
