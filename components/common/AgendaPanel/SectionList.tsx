import { useContext, useEffect, useRef } from 'react'

import {
  BOTTOM_CONTROLS_HEIGHT,
  BOTTOM_CONTROLS_HEIGHT_WHEN_MINIMIZED,
} from './BottomControls'
import { HEADER_HEIGHT, HEADER_HEIGHT_WHEN_MINIMIZED } from './Header'
import { SectionItem } from './SectionItem'
import { HEADER_HEIGHT as MAIN_HEADER_HEIGHT } from '../StudioLayout/Header'

import { EventContext } from '@/contexts/EventContext'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { cn, scrollParentToChild } from '@/utils/utils'

const SECTION_LIST_CONTAINER_MAX_HEIGHT = `calc(100vh -  ${MAIN_HEADER_HEIGHT}px - ${HEADER_HEIGHT}px - ${BOTTOM_CONTROLS_HEIGHT}px)`
const SECTION_LIST_CONTAINER_MAX_HEIGHT_WHEN_MANIMIZED = `calc(100vh -  ${MAIN_HEADER_HEIGHT}px - ${HEADER_HEIGHT_WHEN_MINIMIZED}px - ${BOTTOM_CONTROLS_HEIGHT_WHEN_MINIMIZED}px)`

export function SectionList() {
  const { currentFrame, sections } = useContext(
    EventContext
  ) as EventContextType
  const { eventMode, isOwner, preview } = useContext(
    EventContext
  ) as EventContextType
  const sectionListRef = useRef<HTMLDivElement>(null)
  const { leftSidebarVisiblity } = useStudioLayout()

  const expanded = leftSidebarVisiblity === 'maximized'

  useEffect(() => {
    if (!currentFrame) return

    const currentFrameElement = document.querySelector(
      `div[data-miniframe-id="${currentFrame.id}"]`
    )

    if (!currentFrameElement) return

    scrollParentToChild({
      parent: sectionListRef.current!,
      child: currentFrameElement as HTMLElement,
      topOffset: 100,
      bottomOffset: 100,
    })
  }, [currentFrame])

  const actionDisabled = eventMode !== 'edit' || !isOwner || preview

  const maxHeight = expanded
    ? SECTION_LIST_CONTAINER_MAX_HEIGHT
    : SECTION_LIST_CONTAINER_MAX_HEIGHT_WHEN_MANIMIZED

  return (
    <div
      ref={sectionListRef}
      className={cn(
        'flex flex-col gap-3 overflow-y-auto scrollbar-none scroll-smooth h-full w-full px-2 py-4',
        {
          'gap-2 py-2': !expanded,
        }
      )}
      style={{
        maxHeight,
      }}>
      {sections.map((section) => (
        <SectionItem
          key={section.id}
          section={section}
          actionDisabled={actionDisabled}
        />
      ))}
    </div>
  )
}
