import { supabaseClient } from '@/utils/supabase/client'

const getReactions = async (frameId: string) => {
  const { data, error } = await supabaseClient
    .from('reaction')
    .select('*,frame_response!inner(*)')
    .eq('frame_response.frame_id', frameId)

  return {
    data,
    error,
  }
}

export const ReactionService = {
  getReactions,
}
