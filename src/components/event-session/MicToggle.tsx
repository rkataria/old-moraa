import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoMicOff, IoMicOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { useDetectSpeaking } from '@/hooks/useDetectSpeaking'
import { useUserPreferences } from '@/hooks/userPreferences'
import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

export function MicToggle({ className = '' }: { className?: string }) {
  const { userPreferencesMeetingAudio } = useUserPreferences()
  const self = useDyteSelector((state) => state.self)
  const isMicEnabled = useDyteSelector((state) => state.self?.audioEnabled)
  const { isSpeaking } = useDetectSpeaking({
    detect: !isMicEnabled,
  })

  const handleMic = () => {
    if (isMicEnabled) {
      self.disableAudio()
      userPreferencesMeetingAudio(false)

      return
    }

    self.enableAudio()
    userPreferencesMeetingAudio(true)
  }

  useHotkeys(
    KeyboardShortcuts.Live.muteUnmute.key,
    handleMic,
    [self, isMicEnabled],
    liveHotKeyProps
  )

  const getTooltipProps = () => {
    if (isSpeaking && !isMicEnabled) {
      return {
        label:
          'Are you speaking? You are on mute. Clik the mic button or press the shortcut to unmute',
        actionKey: KeyboardShortcuts.Live.muteUnmute.key,
        isOpen: true,
      }
    }

    return {
      label: KeyboardShortcuts.Live.muteUnmute.label,
      actionKey: KeyboardShortcuts.Live.muteUnmute.key,
    }
  }

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
      tooltipProps={getTooltipProps()}
      onClick={handleMic}>
      {isMicEnabled ? <IoMicOutline size={18} /> : <IoMicOff size={18} />}
    </ControlButton>
  )
}
