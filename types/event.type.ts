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
