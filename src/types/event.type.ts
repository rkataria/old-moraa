import { IFrame } from './frame.type'

export interface ICreateEventPayload {
  name: FormDataEntryValue | null
  description: FormDataEntryValue | null
  type: FormDataEntryValue | null
  start_date: FormDataEntryValue | null
  end_date: FormDataEntryValue | null
  owner_id: FormDataEntryValue | null
}

export interface IMeetingFramesPayload {
  name?: string
  description?: string
  frames?: IFrame[]
}

export type AgendaFrameDisplayType = 'thumbnail' | 'list'

export enum STUDIO_TABS {
  LANDING_PAGE = 'landing-page',
  SESSION_PLANNER = 'session-planner',
  CONTENT_STUDIO = 'content-studio',
  RECORDINGS = 'recordings',
}
