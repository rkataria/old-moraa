import { supabaseClient } from '@/utils/supabase/client'

const getUserToken = async ({
  userId,
  userInfo,
}: {
  userId: string
  userInfo: {
    name: string
    color: string
    avatar: string
  }
}) => {
  const response = await supabaseClient.functions.invoke(
    'create-liveblocks-user-token',
    {
      body: {
        userId,
        userInfo,
      },
    }
  )

  return JSON.parse(response.data) as { token: string }
}

export const LiveBlockService = {
  getUserToken,
}
