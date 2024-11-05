import { redirect } from '@tanstack/react-router'

import { ProfileService } from '@/services/profile.service'
import { supabaseClient } from '@/utils/supabase/client'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const beforeLoad = async ({
  location,
  context,
}: {
  location: any
  context: {
    auth: {
      isAuthenticated: boolean
      loading: boolean
    }
  }
}) => {
  const session = await supabaseClient.auth.getSession()
  if (context.auth.loading) return

  if (!context.auth.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    })
  }

  if (!session?.data?.session?.user.id) return

  const { data: userProfile } = await ProfileService.getProfile(
    session.data.session.user.id
  )

  if (
    !userProfile?.user_type ||
    !userProfile?.first_name ||
    !userProfile?.last_name
  ) {
    const missingParams = {
      userType: !userProfile?.user_type,
      firstName: !userProfile?.first_name,
      lastName: !userProfile?.last_name,
    }

    throw redirect({
      to: '/onboarding',
      search: {
        redirect: location.href,
        userPersona: missingParams.userType,
        firstName: missingParams.firstName,
        lastName: missingParams.lastName,
      },
    })
  }
}
