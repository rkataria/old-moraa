import { Embed } from './Embed'
import { LoadError } from './LoadError'

import { useEventPermissions } from '@/hooks/useEventPermissions'
import { type GoogleSlidesFrame } from '@/types/frame-picker.type'
import { isValidGoogleSlidesUrl } from '@/utils/utils'

type PreviewProps = {
  frame: GoogleSlidesFrame
  startPage?: number
  onPageChange?: (pageNumber: number) => void
}
export function Preview({ frame, startPage, onPageChange }: PreviewProps) {
  const { permissions } = useEventPermissions()

  if (
    frame.content?.googleSlideUrl &&
    isValidGoogleSlidesUrl(frame.content.googleSlideUrl)
  ) {
    return (
      <Embed
        url={frame.content.googleSlideUrl}
        showControls={
          !frame.content.individualFrame &&
          permissions.canAcessAllSessionControls
        }
        startPage={startPage || frame.content.startPosition}
        onPageChange={(pageNumber) => {
          if (permissions.canAcessAllSessionControls) {
            onPageChange?.(pageNumber)
          }
        }}
      />
    )
  }

  return (
    <LoadError
      invalidUrl={!frame.content?.googleSlideUrl}
      canUpdateFrame={permissions.canUpdateFrame}
    />
  )
}
