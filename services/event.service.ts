import { ICreateEventPayload } from "@/types/event.type"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

export type GetEventParams = {
  eventId: string
  fetchMeetingSlides?: boolean
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
  fetchMeetingSlides = false,
}: GetEventParams) => {
  const { data: meeting, error } = await supabase
    .from("meeting")
    .select("id, event:event_id(*)")
    .eq("event_id", eventId)
    .single()

  console.log("meeting: ", meeting)
  console.log("error: ", error)
  if (error) {
    return {
      event: null,
      contents: null,
      error,
    }
  }

  let slides

  if (fetchMeetingSlides) {
    const { data } = await supabase
      .from("slide")
      .select("*, meeting:meeting_id(*)")
      .eq("meeting_id", meeting.id)
    slides = data
  }

  return {
    event: meeting.event[0],
    meeting: meeting,
    meetingSlides: { slides: slides },
  }
}

const createEvent = async (event: ICreateEventPayload) => {
  console.log(event)
  const { data, error } = await supabase.from("event").insert([event]).select()

  console.log(data)
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
