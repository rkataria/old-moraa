import { useDyteSelector } from '@dytesdk/react-web-core'
import { IoShareOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function ScreenShareToggle() {
  const self = useDyteSelector((state) => state.self)
  const isScreenShared = useDyteSelector(
    (state) => state.self?.screenShareEnabled
  )

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        size: 'sm',
        variant: 'flat',
        className: cn('live-button', {
          active: isScreenShared,
        }),
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
      <IoShareOutline size={20} />
    </ControlButton>
  )
}
