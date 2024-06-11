import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

const getReactions = async (frameId: string) => {
  const { data, error } = await supabase
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
