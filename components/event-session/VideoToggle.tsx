import { useDyteSelector } from '@dytesdk/react-web-core'
import { IoVideocam, IoVideocamOff } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function VideoToggle({ className = '' }: { className?: string }) {
  const self = useDyteSelector((state) => state.self)
  const isVideoEnabled = useDyteSelector((state) => state.self?.videoEnabled)

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'full',
        variant: 'flat',
        className: cn('transition-all duration-300', className, {
          'bg-red-500 text-white': !isVideoEnabled,
        }),
      }}
      tooltipProps={{
        content: isVideoEnabled ? 'Hide video' : 'Show video',
      }}
      onClick={() => {
        if (isVideoEnabled) {
          self.disableVideo()

          return
        }

        self.enableVideo()
      }}>
      {isVideoEnabled ? <IoVideocam size={16} /> : <IoVideocamOff size={16} />}
    </ControlButton>
  )
}
