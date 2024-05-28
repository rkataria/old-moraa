import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoVideocam, IoVideocamOff } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function VideoToggle({ className = '' }: { className?: string }) {
  const self = useDyteSelector((state) => state.self)
  const isVideoEnabled = useDyteSelector((state) => state.self?.videoEnabled)

  const handleVideo = () => {
    if (isVideoEnabled) {
      self.disableVideo()

      return
    }

    self.enableVideo()
  }

  useHotkeys('v', handleVideo, [self, isVideoEnabled])

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        variant: 'flat',
        className: cn('transition-all duration-300', className, {
          'bg-red-500 text-white': !isVideoEnabled,
        }),
      }}
      tooltipProps={{
        content: isVideoEnabled ? 'Hide video' : 'Show video',
      }}
      onClick={handleVideo}>
      {isVideoEnabled ? <IoVideocam size={20} /> : <IoVideocamOff size={20} />}
    </ControlButton>
  )
}
