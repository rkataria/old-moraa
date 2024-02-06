import { ICreateEventPayload } from "@/types/event.type"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

export type GetEventParams = {
  eventId: string
  fetchMeetingSlides?: boolean
  fetchActiveSession?: boolean
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
  fetchActiveSession = false,
}: GetEventParams) => {
  const { data: meeting, error } = await supabase
    .from("meeting")
    .select("*, event:event_id(*)")
    .eq("event_id", eventId)
    .single()

  if (error) {
    console.error("error while fetching meeting and event: ", error)
    return {
      event: null,
      contents: null,
      error,
    }
  }

  let slides, session

  if (fetchMeetingSlides) {
    const { data } = await supabase
      .from("slide")
      .select("*, meeting:meeting_id(*)")
      .eq("meeting_id", meeting.id)
    slides = data
  }

  if (fetchActiveSession) {
    const { data, error } = await supabase
      .from("session")
      .select("*")
      .eq("meeting_id", meeting.id)
      .eq("status", "ACTIVE")
      .single()
    if (!error) {
      session = data
    }
  }

  return {
    event: meeting.event,
    meeting: meeting,
    meetingSlides: { slides: slides },
    session: session,
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
