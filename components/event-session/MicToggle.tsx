import { useDyteSelector } from '@dytesdk/react-web-core'
import { IoMicSharp, IoMicOffSharp } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function MicToggle({ className = '' }: { className?: string }) {
  const self = useDyteSelector((state) => state.self)
  const isMicEnabled = useDyteSelector((state) => state.self?.audioEnabled)

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'full',
        variant: 'flat',
        className: cn('transition-all duration-300', className, {
          'bg-red-500 text-white': !isMicEnabled,
        }),
      }}
      tooltipProps={{
        content: isMicEnabled ? 'Mute' : 'Unmute',
      }}
      onClick={() => {
        if (isMicEnabled) {
          self.disableAudio()

          return
        }

        self.enableAudio()
      }}>
      {isMicEnabled ? <IoMicSharp size={16} /> : <IoMicOffSharp size={16} />}
    </ControlButton>
  )
}
