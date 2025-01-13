import { useDyteSelector } from '@dytesdk/react-web-core'
import { useHotkeys } from 'react-hotkeys-hook'
import { BsCameraVideo, BsFillCameraVideoOffFill } from 'react-icons/bs'

import { ControlButton } from '../common/ControlButton'

import { useUserPreferences } from '@/hooks/userPreferences'
import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

export function VideoToggle({ className = '' }: { className?: string }) {
  const { userPreferencesMeetingVideo } = useUserPreferences()
  const self = useDyteSelector((state) => state.self)
  const isVideoEnabled = useDyteSelector((state) => state.self?.videoEnabled)

  const handleVideo = () => {
    if (isVideoEnabled) {
      self.disableVideo()
      userPreferencesMeetingVideo(false)

      return
    }

    self.enableVideo()
    userPreferencesMeetingVideo(true)
  }

  useHotkeys(
    KeyboardShortcuts.Live.startAndStopVideo.key,
    handleVideo,
    [self, isVideoEnabled],
    liveHotKeyProps
  )

  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        size: 'sm',
        variant: 'flat',
        className: cn('live-button', className, {
          '!text-red-500 hover:!text-red-500': !isVideoEnabled,
        }),
        disableAnimation: true,
        disableRipple: true,
      }}
      tooltipProps={{
        label: KeyboardShortcuts.Live.startAndStopVideo.label,
        actionKey: KeyboardShortcuts.Live.startAndStopVideo.key,
      }}
      onClick={handleVideo}>
      {isVideoEnabled ? (
        <BsCameraVideo size={18} />
      ) : (
        <BsFillCameraVideoOffFill size={18} />
      )}
    </ControlButton>
  )
}
