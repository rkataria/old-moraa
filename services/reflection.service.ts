import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

const getResponses = async (slideId: string) => {
  const { data, error } = await supabase
    .from('slide_response')
    .select(
      '* , participant:participant_id(*, enrollment:enrollment_id(*, profile:user_id(*))),reaction(id,reaction)'
    )
    .eq('slide_id', slideId)

  return {
    responses: data,
    error,
  }
}

export const ReflectionService = {
  getResponses,
}
