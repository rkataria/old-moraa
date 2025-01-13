import { MediaSettingsToggle } from '../MediaSettingsToggle'
import { MicToggle } from '../MicToggle'
import { VideoBackgroundSettingsButtonWithModal } from '../VideoBackgroundSettingsButtonWithModal'
import { VideoToggle } from '../VideoToggle'

type VideoControlsProps = {
  onOpenSettings: () => void
}

export function VideoControls({ onOpenSettings }: VideoControlsProps) {
  return (
    <div className="w-full flex justify-between items-center gap-2">
      <MediaSettingsToggle
        label="Setting"
        buttonProps={{
          radius: 'md',
          variant: 'flat',
          className: 'bg-gray-300 text-primary hover:bg-white',
        }}
        onClick={onOpenSettings}
      />
      <div className="flex justify-center items-center gap-2">
        <MicToggle
          className="!bg-black/10 !text-white hover:!bg-black/20 hover:!text-gray-100"
          hideSpeakingAlert
        />
        <VideoToggle className="!bg-black/10 !text-white hover:!bg-black/20 hover:!text-gray-100" />
      </div>
      <VideoBackgroundSettingsButtonWithModal
        label="Background"
        buttonProps={{
          radius: 'md',
          variant: 'flat',
          className: 'bg-gray-300 text-primary hover:bg-white',
        }}
      />
    </div>
  )
}
