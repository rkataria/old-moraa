import { useDyteSelector } from '@dytesdk/react-web-core'
import { IoShareOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

export function ScreenShareToggle() {
  const { isHost } = useEventSession()
  const self = useDyteSelector((state) => state.self)
  const isScreenShared = useDyteSelector(
    (state) => state.self?.screenShareEnabled
  )
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )

  // ALlow only to share screen if the user is a host
  if (!isHost && !isInBreakoutMeeting) return null

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        size: 'sm',
        variant: 'light',
        className: cn('live-button', {
          active: isScreenShared,
        }),
        disableAnimation: true,
        disableRipple: true,
      }}
      tooltipProps={{
        label: isScreenShared ? 'Stop Screen Share' : 'Start Screen Share',
      }}
      onClick={async () => {
        if (isScreenShared) {
          await self.disableScreenShare()

          return
        }

        await self.enableScreenShare()
      }}>
      <IoShareOutline size={18} />
    </ControlButton>
  )
}
