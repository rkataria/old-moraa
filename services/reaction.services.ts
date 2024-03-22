import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

const getReactions = async (slideId: string) => {
  const { data, error } = await supabase
    .from('reaction')
    .select('*,slide_response!inner(*)')
    .eq('slide_response.slide_id', slideId)

  return {
    data,
    error,
  }
}

export const ReactionService = {
  getReactions,
}
