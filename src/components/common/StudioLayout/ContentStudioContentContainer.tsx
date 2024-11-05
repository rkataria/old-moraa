/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo } from 'react'

import { GrEmptyCircle } from 'react-icons/gr'
import { LuPlusCircle } from 'react-icons/lu'

import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { SectionOverview } from '../SectionOverview'

import { Frame } from '@/components/common/Frame/Frame'
import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { getFrameCount, getPublishedFrameCount } from '@/utils/utils'

export function ContentStudioContentContainer() {
  const { permissions } = useEventPermissions()
  const { currentFrame, currentSectionId, sections } = useEventContext()
  const frameCount = useMemo(() => getFrameCount(sections), [sections])
  const publishedFrameCount = useMemo(
    () => getPublishedFrameCount(sections),
    [sections]
  )

  const renderContent = () => {
    if (currentSectionId) {
      return <SectionOverview />
    }

    if (frameCount === 0) {
      if (permissions.canUpdateFrame) {
        return (
          <EmptyPlaceholder
            icon={<LuPlusCircle />}
            title="No frames"
            description="Add a frame to get started"
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
      return (
        <div className="relative w-full pt-[54.25%]">
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <Frame frame={currentFrame} />
          </div>
        </div>
      )
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
