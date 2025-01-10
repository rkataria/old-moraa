/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo } from 'react'

import { GrEmptyCircle } from 'react-icons/gr'

import { ContentLoading } from '../ContentLoading'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { SectionOverview } from '../SectionOverview'

import { Frame } from '@/components/common/Frame/Frame'
import { GetStartedPlaceholder } from '@/components/event-content/overview-frame/SessionPlanner/GetStartedPlaceholder'
import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { isFrameHasVideoAspectRatio } from '@/utils/frame-picker.util'
import { getFrameCount, getPublishedFrameCount } from '@/utils/utils'

export function ContentStudioContentContainer() {
  const { permissions } = useEventPermissions()
  const { currentFrame, currentSectionId, sections } = useEventContext()
  const frameCount = useMemo(() => getFrameCount(sections), [sections])
  const publishedFrameCount = useMemo(
    () => getPublishedFrameCount(sections),
    [sections]
  )

  // TODO: Fix this logic later
  // useEffect(() => {
  //   if (!currentFrame && !currentSectionId) {
  //     setCurrentFrame(sections[0]?.frames[0])
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentFrame, currentSectionId, sections])

  const renderContent = () => {
    if (currentSectionId) {
      return <SectionOverview />
    }

    if (frameCount === 0) {
      if (permissions.canUpdateFrame) {
        return (
          <GetStartedPlaceholder className="h-full mt-0 flex justify-center items-center" />
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
        <div className="relative w-full pt-[54.25%]">
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <Frame frame={currentFrame} />
          </div>
        </div>
      ) : (
        <Frame frame={currentFrame} />
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
    <div className="w-full h-full rounded-md overflow-hidden overflow-y-auto scrollbar-thin bg-transparent">
      {renderContent()}
    </div>
  )
}
