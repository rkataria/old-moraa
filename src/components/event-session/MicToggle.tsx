import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoMicOutline, IoMicOffOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { cn, KeyboardShortcuts } from '@/utils/utils'

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
        size: 'sm',
        radius: 'md',
        variant: 'flat',
        className: cn(
          'transition-all duration-300 bg-[#F3F4F6] text-[#444444]',
          className,
          {
            'bg-red-500 text-white': !isMicEnabled,
          }
        ),
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.muteUnmute.label,
        actionKey: KeyboardShortcuts.Live.muteUnmute.key,
      }}
      onClick={handleMic}>
      {isMicEnabled ? (
        <IoMicOutline size={20} />
      ) : (
        <IoMicOffOutline size={20} />
      )}
    </ControlButton>
  )
}
