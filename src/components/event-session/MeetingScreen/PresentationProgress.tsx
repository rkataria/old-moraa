import { useMemo } from 'react'

import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { EventSessionMode } from '@/types/event-session.type'
import { getFrameCount } from '@/utils/utils'

export function PresentationProgress() {
  const { sections } = useEventContext()
  const { isHost } = useEventSession()
  const { currentSectionId, isOverviewOpen } = useStoreSelector(
    (store) => store.event.currentEvent.eventState
  )
  const currentFrame = useCurrentFrame()
  const { eventSessionMode } = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState
  )

  const frameCount = useMemo(() => getFrameCount(sections), [sections])
  const currentFrameIndex = useMemo(() => {
    if (!currentFrame) return -1

    const frameIds = sections
      .flat(2)
      .map((f) => f.frames)
      .flat(2)
      .map((f) => f.id)

    return frameIds.indexOf(currentFrame.id)
  }, [sections, currentFrame])

  const getProgressWidth = () => {
    if (isOverviewOpen) return 0

    if (currentFrameIndex === -1) return 0

    if (currentFrameIndex === frameCount - 1) return '100%'

    return `${((currentFrameIndex + 1) / frameCount) * 100}%`
  }

  const getProgressText = () => {
    if (currentSectionId) {
      return sections.find((s) => s.id === currentSectionId)?.name
    }

    if (!currentFrame) return null

    return currentFrame?.name
  }

  const progressText = getProgressText()

  if (isHost || eventSessionMode === EventSessionMode.PRESENTATION) {
    return (
      <div
        className="relative h-8 w-64 flex justify-start gap-2 px-2 items-center rounded-md overflow-hidden live-button after:contents-[''] after:absolute after:left-0 after:top-0 after:h-full after:bg-black/10 after:transition-all after:duration-300 after:w-[var(--frame-progress-width)] after:z-0"
        style={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          '--frame-progress-width': getProgressWidth(),
        }}>
        <span className="w-full line-clamp-1 truncate text-ellipsis z-[1]">
          {progressText}
        </span>
      </div>
    )
  }

  return null
}
