import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoVideocamOffOutline, IoVideocamOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { useUserPreferences } from '@/hooks/userPreferences'
import { cn, KeyboardShortcuts } from '@/utils/utils'

export function VideoToggle({ className = '' }: { className?: string }) {
  const { userPreferencesMeetingVideo } = useUserPreferences()
  const self = useDyteSelector((state) => state.self)
  const isVideoEnabled = useDyteSelector((state) => state.self?.videoEnabled)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleVideo = (e?: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return

    if (isVideoEnabled) {
      self.disableVideo()
      userPreferencesMeetingVideo(false)

      return
    }

    self.enableVideo()
    userPreferencesMeetingVideo(true)
  }

  useHotkeys(KeyboardShortcuts.Live.startAndStopVideo.key, handleVideo, [
    self,
    isVideoEnabled,
  ])

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        size: 'sm',
        variant: 'flat',
        className: cn('live-button', className, {
          '!bg-red-500 !text-white hover:!bg-red-500': !isVideoEnabled,
        }),
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
