import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoMicSharp, IoMicOffSharp } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function MicToggle({ className = '' }: { className?: string }) {
  const self = useDyteSelector((state) => state.self)
  const isMicEnabled = useDyteSelector((state) => state.self?.audioEnabled)

  const handleMic = () => {
    if (isMicEnabled) {
      self.disableAudio()

      return
    }

    self.enableAudio()
  }

  useHotkeys('m', handleMic, [self, isMicEnabled])

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        variant: 'flat',
        className: cn('transition-all duration-300', className, {
          'bg-red-500 text-white': !isMicEnabled,
        }),
      }}
      tooltipProps={{
        content: isMicEnabled ? 'Mute' : 'Unmute',
      }}
      onClick={handleMic}>
      {isMicEnabled ? <IoMicSharp size={20} /> : <IoMicOffSharp size={20} />}
    </ControlButton>
  )
}
