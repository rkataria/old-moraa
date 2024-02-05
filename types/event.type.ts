import { ISlide } from "./slide.type"

export interface ICreateEventPayload {
  name: FormDataEntryValue | null
  description: FormDataEntryValue | null
  type: FormDataEntryValue | null
  start_date: FormDataEntryValue | null
  end_date: FormDataEntryValue | null
  owner_id: FormDataEntryValue | null
}

export interface IMeetingSlidesPayload {
  name?: string
  description?: string
  slides?: ISlide[]
}
