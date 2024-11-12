import { supabaseClient } from '@/utils/supabase/client'

const getResponses = async (frameId: string) => {
  const { data, error } = await supabaseClient
    .from('frame_response')
    .select(
      '* , participant:participant_id(*, enrollment:enrollment_id(*, profile:user_id(*)))'
    )
    .eq('frame_id', frameId)

  return {
    responses: data,
    error,
  }
}

const deleteResponses = async (frameId: string) => {
  const { error } = await supabaseClient
    .from('frame_response')
    .delete()
    .eq('frame_id', frameId)

  if (error) {
    console.error('Error deleting responses:', error)

    return { error }
  }

  return { error: null }
}

export const FrameResponseService = {
  getResponses,
  deleteResponses,
}
