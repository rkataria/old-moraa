import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

export interface IUpsertEventSession {
  data?: any
}

const getEventSession = async ({ eventId }: { eventId: string }) => {
  const { data } = await supabase
    .from("event_session")
    .select("*")
    .eq("event_id", eventId)

  return data?.[0].data
}

const upsertEventSession = async ({
  eventId,
  payload,
}: {
  eventId: string
  payload: IUpsertEventSession
}) => {
  const { error } = await supabase
    .from("event_session")
    .update({
      data: payload.data,
      updated_at: new Date(),
    })
    .eq("event_id", eventId)

  return {
    error,
  }
}

export const EventSessionService = {
  getEventSession,
  upsertEventSession,
}
