import { UserType } from '@/types/common'
import { supabaseClient } from '@/utils/supabase/client'

export type UpdateProfile = {
  userId: string
  payload: {
    first_name?: string
    last_name?: string
    user_type?: UserType
  }
}

const getProfile = async (userId: string) => {
  const { data, error } = await supabaseClient
    .from('profile')
    .select('*')

    .eq('id', userId)

  return {
    data: data?.[0],
    error,
  }
}

const updateProfile = async (variables: UpdateProfile) => {
  const { data, error } = await supabaseClient
    .from('profile')
    .update(variables.payload)
    .eq('id', variables.userId)
    .select()

  return {
    data: data?.[0],
    error,
  }
}

export const ProfileService = {
  getProfile,
  updateProfile,
}
