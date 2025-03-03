/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo } from 'react'

import { GrEmptyCircle } from 'react-icons/gr'

import { ContentLoading } from '../ContentLoading'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { SectionOverview } from '../SectionOverview'

import { GetStartedPlaceholder } from '@/components/event-content/overview-frame/SessionPlanner/GetStartedPlaceholder'
import { Frame } from '@/components/frames/Frame/Frame'
import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { STUDIO_TABS } from '@/types/event.type'
import { getFirstFrame } from '@/utils/event.util'
import { isFrameHasVideoAspectRatio } from '@/utils/frame-picker.util'
import { getFrameCount, getPublishedFrameCount } from '@/utils/utils'

export function ContentStudioContentContainer() {
  const { permissions } = useEventPermissions()
  const {
    currentFrame,
    currentSectionId,
    sections,
    setCurrentFrame,
    insertAfterFrameId,
    insertInSectionId,
  } = useEventContext()
  const frameCount = useMemo(() => getFrameCount(sections), [sections])
  const publishedFrameCount = useMemo(
    () => getPublishedFrameCount(sections),
    [sections]
  )

  useEffect(() => {
    if (
      currentFrame ||
      currentSectionId ||
      insertAfterFrameId ||
      insertInSectionId ||
      frameCount === 0
    ) {
      return
    }

    setCurrentFrame(getFirstFrame(sections))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentFrame,
    currentSectionId,
    sections,
    insertAfterFrameId,
    insertInSectionId,
    frameCount,
  ])

  const renderContent = () => {
    if (currentSectionId) {
      return <SectionOverview />
    }

    if (frameCount === 0) {
      if (permissions.canUpdateFrame) {
        return (
          <GetStartedPlaceholder
            fromTab={STUDIO_TABS.CONTENT_STUDIO}
            className="h-full mt-0 flex justify-center items-center"
          />
        )
      }

      return (
        <EmptyPlaceholder
          icon={<GrEmptyCircle size={96} />}
          title="No frame published"
          description="Frames will appear here when creator will publish frames"
        />
      )
    }

    if (currentFrame) {
      return isFrameHasVideoAspectRatio(currentFrame.type) ? (
        <div className="relative w-full pt-[56.25%]">
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <Frame key={currentFrame?.id} frame={currentFrame} />
          </div>
        </div>
      ) : (
        <div className="bg-white border w-full h-full p-4 rounded-lg">
          <Frame key={currentFrame?.id} frame={currentFrame} />
        </div>
      )
    }

    if (permissions.canUpdateFrame) {
      return <ContentLoading />
    }

    if (publishedFrameCount === 0) {
      return (
        <EmptyPlaceholder
          icon={<GrEmptyCircle size={96} />}
          title="No frame published"
          description="Frames will appear here when creator will publish frames"
        />
      )
    }

    return (
      <EmptyPlaceholder
        icon={<GrEmptyCircle size={96} />}
        title="No frame selected"
        description="Select a frame to get started"
      />
    )
  }

  return (
    <div className="w-full h-full rounded-md bg-white overflow-hidden overflow-y-auto scrollbar-thin bg-transparent">
      {renderContent()}
    </div>
  )
}
