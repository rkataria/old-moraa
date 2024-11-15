import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoMicOff, IoMicOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { useUserPreferences } from '@/hooks/userPreferences'
import { cn, KeyboardShortcuts } from '@/utils/utils'

export function MicToggle({ className = '' }: { className?: string }) {
  const { userPreferencesMeetingAudio } = useUserPreferences()
  const self = useDyteSelector((state) => state.self)
  const isMicEnabled = useDyteSelector((state) => state.self?.audioEnabled)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMic = (e?: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return

    if (isMicEnabled) {
      self.disableAudio()
      userPreferencesMeetingAudio(false)

      return
    }

    self.enableAudio()
    userPreferencesMeetingAudio(true)
  }

  useHotkeys(KeyboardShortcuts.Live.muteUnmute.key, handleMic, [
    self,
    isMicEnabled,
  ])

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        size: 'sm',
        radius: 'md',
        variant: 'flat',
        className: cn('live-button', className, {
          '!text-red-500 hover:!text-red-500': !isMicEnabled,
        }),
        disableAnimation: true,
        disableRipple: true,
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.muteUnmute.label,
        actionKey: KeyboardShortcuts.Live.muteUnmute.key,
      }}
      onClick={handleMic}>
      {isMicEnabled ? <IoMicOutline size={18} /> : <IoMicOff size={18} />}
    </ControlButton>
  )
}
