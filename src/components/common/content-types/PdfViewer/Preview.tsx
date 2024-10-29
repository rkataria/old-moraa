import { Embed } from './Embed'
import { LoadError } from './LoadError'

import { useEventPermissions } from '@/hooks/useEventPermissions'
import { PdfFrame } from '@/types/frame-picker.type'

type PreviewProps = {
  frame: PdfFrame
  hideControls?: boolean
}
export function Preview({ frame, hideControls = false }: PreviewProps) {
  const { permissions } = useEventPermissions()

  if (frame.content?.pdfPath) {
    return <Embed frame={frame} hideControls={hideControls} />
  }

  return (
    <LoadError
      invalidUrl={!frame.content?.googleSlideUrl}
      canUpdateFrame={permissions.canUpdateFrame}
    />
  )
}
