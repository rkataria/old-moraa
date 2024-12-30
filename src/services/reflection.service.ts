import { supabaseClient } from '@/utils/supabase/client'

const getResponses = async (frameId: string) => {
  const { data, error } = await supabaseClient
    .from('frame_response')
    .select(
      '* , participant:participant_id(*, enrollment:enrollment_id(*, profile:user_id(*))),reaction(id,reaction,details)'
    )
    .eq('frame_id', frameId)

  return {
    responses: data,
    error,
  }
}

export const ReflectionService = {
  getResponses,
}
