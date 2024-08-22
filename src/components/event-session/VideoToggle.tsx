import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoVideocamOffOutline, IoVideocamOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn, KeyboardShortcuts } from '@/utils/utils'

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
        size: 'sm',
        variant: 'flat',
        className: cn(
          'transition-all duration-300 bg-[#F3F4F6] text-[#444444]',
          className,
          {
            'bg-red-500 text-white': !isVideoEnabled,
          }
        ),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.startAndStopVideo.label,
        actionKey: KeyboardShortcuts.Live.startAndStopVideo.key,
      }}
      onClick={handleVideo}>
      {isVideoEnabled ? (
        <IoVideocamOutline size={20} />
      ) : (
        <IoVideocamOffOutline size={20} />
      )}
    </ControlButton>
  )
}
