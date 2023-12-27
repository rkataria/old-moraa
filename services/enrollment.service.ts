import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

const getEnrollment = async ({
  eventId,
  userId,
}: {
  eventId: string
  userId: string
}) => {
  const { data } = await supabase
    .from("enrollment")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", userId)

  return data?.[0]
}

export const EnrollmentService = {
  getEnrollment,
}
