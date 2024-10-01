import React from 'react'

import { LiveblocksProvider as LBLiveblocksProvider } from '@liveblocks/react/suspense'
import uniqolor from 'uniqolor'

import { useProfile } from '@/hooks/useProfile'
import { LiveBlockService } from '@/services/liveblocks.service'

export function LiveblocksProvider({ children }: React.PropsWithChildren) {
  const { data: user } = useProfile()

  return (
    <LBLiveblocksProvider
      authEndpoint={async () => {
        const response = await LiveBlockService.getUserToken({
          userId: user?.id,
          userInfo: {
            avatar: user?.avatar_url,
            color: uniqolor(user.id).color,
            name: `${user.first_name} ${user.last_name}`,
          },
        })

        return {
          token: response.token,
        }
      }}
      throttle={100}>
      {children}
    </LBLiveblocksProvider>
  )
}
