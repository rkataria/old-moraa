import { ICreateEventPayload } from "@/types/event.type"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

export type GetEventParams = {
  eventId: string
  fetchEventContent?: boolean
}

const getEvents = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("enrollment")
    .select("*,event(*)")
    .eq("user_id", user.id)

  return data?.map((item) => item.event)
}

const getEvent = async ({
  eventId,
  fetchEventContent = false,
}: GetEventParams) => {
  const { data: event, error } = await supabase
    .from("event")
    .select("*")
    .eq("id", eventId)

  if (error) {
    return {
      event: null,
      contents: null,
      error,
    }
  }

  let eventContent

  if (fetchEventContent) {
    const { data } = await supabase
      .from("event_content")
      .select("*")
      .eq("event_id", eventId)

    eventContent = data
  }

  return {
    event: event[0],
    eventContent: eventContent?.[0],
  }
}

const createEvent = async (event: ICreateEventPayload) => {
  const { data, error } = await supabase.from("event").insert([event]).select()

  return {
    data: data?.[0],
    error,
  }
}

export const EventService = {
  getEvents,
  getEvent,
  createEvent,
}
