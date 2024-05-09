import { useDyteSelector } from '@dytesdk/react-web-core'
import { IoShare } from 'react-icons/io5'

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
        variant: 'flat',
        className: cn('transition-all duration-300', {
          'bg-red-500 text-white': isScreenShared,
        }),
      }}
      tooltipProps={{
        content: isScreenShared ? 'Stop Screen Share' : 'Scree Share',
      }}
      onClick={async () => {
        if (isScreenShared) {
          await self.disableScreenShare()

          return
        }

        await self.enableScreenShare()
      }}>
      <IoShare size={20} />
    </ControlButton>
  )
}
