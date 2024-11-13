import { useSearch } from '@tanstack/react-router'

import { ContentLoading } from '../ContentLoading'
import { LiveFrame } from '../Frame/LiveFrame'

import { useEventContext } from '@/contexts/EventContext'

export function PresentationEmbed() {
  const searchParams = useSearch({
    from: '/presentation/$eventId/',
  }) as {
    frameId: string
  }
  const { getFrameById } = useEventContext()

  const frame = getFrameById(searchParams.frameId)

  if (!frame) return <ContentLoading />

  return (
    <div className="w-full h-full">
      <LiveFrame frame={frame} />
    </div>
  )
}
