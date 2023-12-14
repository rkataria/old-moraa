import { createClient } from "@/utils/supabase/client"

export type Event = {
  name: FormDataEntryValue | null
  description: FormDataEntryValue | null
  type: FormDataEntryValue | null
  start_date: FormDataEntryValue | null
  end_date: FormDataEntryValue | null
  owner_id: FormDataEntryValue | null
}

const supabase = createClient()

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

const createEvent = async (event: Event) => {
  const { data, error } = await supabase.from("event").insert([event]).select()

  return {
    data,
    error,
  }
}

export const EventService = {
  getEvents,
  createEvent,
}
