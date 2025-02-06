/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'

import { SelfPresence } from './SelfPresence'
import { Trigger } from './Trigger'
import { UserPresenceList } from './UserPresenceList'
import { RenderIf } from '../RenderIf/RenderIf'

import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/utils'

type Presence = {
  id: string
  isHost: boolean
  name: string
  role: string
  avatar: string
}

export function UserPresences({
  self,
  others,
  followingUserId,
  hostPresence,
  isFollowingHost,
  onBringAllToHost,
  toggleFollowUser,
}: {
  self: Presence
  others: Presence[]
  hostPresence?: Presence
  followingUserId?: string
  isFollowingHost?: boolean
  onBringAllToHost?: () => void
  toggleFollowUser?: (userId: string) => void
}) {
  return (
    <div>
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <div>
            <Trigger avatar={self.avatar} totalPresences={others.length + 1} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 relative overflow-hidden">
          <div className="p-2 min-w-72 max-h-80 flex flex-col justify-start items-start rounded-md overflow-hidden overflow-y-auto">
            <div className="w-full flex flex-col justify-start items-start">
              <SelfPresence presence={self} />

              <UserPresenceList
                presences={others}
                followingUserId={followingUserId}
                onFollowUser={toggleFollowUser}
              />
            </div>
          </div>
          <RenderIf isTrue={self.isHost && others.length > 0}>
            <div className="left-0 bottom-0 w-full bg-white p-2">
              {/* <HideMyCursor /> */}
              <Button
                variant="light"
                fullWidth
                size="md"
                disableRipple
                className="text- font-light bg-gray-100 hover:!bg-primary-50"
                onClick={onBringAllToHost}>
                Bring everyone to me
              </Button>
            </div>
          </RenderIf>
          <RenderIf isTrue={!self.isHost && !!hostPresence}>
            <div className="left-0 bottom-0 w-full bg-white p-2">
              {/* <HideMyCursor /> */}
              <Button
                variant="light"
                fullWidth
                size="md"
                disableRipple
                className={cn(
                  'text- font-light bg-gray-100 hover:!bg-primary-50',
                  {
                    'bg-primary-100': isFollowingHost,
                  }
                )}
                onClick={() => toggleFollowUser?.(hostPresence?.id as string)}>
                {isFollowingHost ? 'Stop following host' : 'Follow host'}
              </Button>
            </div>
          </RenderIf>
        </PopoverContent>
      </Popover>
    </div>
  )
}
