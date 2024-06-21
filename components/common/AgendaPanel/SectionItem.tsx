/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext } from 'react'

import { IoChevronForward } from 'react-icons/io5'
import { LuLayers } from 'react-icons/lu'

import { Chip } from '@nextui-org/react'

import { FrameList } from './FrameList'
import { EditableLabel } from '../EditableLabel'
import { StrictModeDroppable } from '../StrictModeDroppable'

import { EventContext } from '@/contexts/EventContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { ISection } from '@/types/frame.type'
import { getFilteredFramesByStatus } from '@/utils/event.util'
import { cn } from '@/utils/utils'

type SectionItemProps = {
  section: ISection
  actionDisabled: boolean
}

export function SectionItem({ section, actionDisabled }: SectionItemProps) {
  const {
    isOwner,
    setInsertAfterFrameId,
    setInsertInSectionId,
    setCurrentFrame,
    updateSection,
    eventMode,
    overviewOpen,
  } = useContext(EventContext) as EventContextType
  const {
    expandedSectionIds,
    currentSectionId,
    toggleExpandedSection,
    setCurrentSectionId,
  } = useAgendaPanel()
  const { leftSidebarVisiblity } = useStudioLayout()

  const frames =
    isOwner && eventMode === 'edit'
      ? section.frames
      : getFilteredFramesByStatus({
          frames: section.frames,
          status: 'PUBLISHED',
        })

  const handleSectionClick = () => {
    const isSectionExpanded = expandedSectionIds.includes(section.id)

    setInsertInSectionId(section.id)
    setInsertAfterFrameId(null)

    toggleExpandedSection(section.id)

    if (!isSectionExpanded) {
      const firstFrame = section.frames[0]
      if (firstFrame) {
        setCurrentFrame(firstFrame)
      }
    } else {
      setCurrentSectionId(section.id)
    }
  }

  const sectionExpanded = expandedSectionIds.includes(section.id)
  const sidebarExpanded = leftSidebarVisiblity === 'maximized'
  const sectionActive = !overviewOpen && currentSectionId === section.id

  const renderSectionHeader = () => {
    if (sidebarExpanded) {
      return (
        <>
          <div
            className="flex justify-start items-center flex-auto gap-2 p-1.5"
            onClick={handleSectionClick}>
            <IoChevronForward
              className={cn('duration-300 shrink-0', {
                'rotate-90': sectionExpanded,
              })}
            />
            <LuLayers size={22} className="flex-none" />
            <EditableLabel
              readOnly={actionDisabled}
              label={section.name}
              className="text-sm font-semibold cursor-pointer tracking-tight"
              onUpdate={(value: string) => {
                updateSection({
                  sectionPayload: { name: value },
                  sectionId: section.id,
                })
              }}
            />
          </div>

          <Chip
            size="sm"
            variant="bordered"
            className="aspect-square flex justify-center items-center border-1 border-gray-300 mr-1">
            {frames.length}
          </Chip>
        </>
      )
    }

    return (
      <div
        className="flex justify-center items-center cursor-pointer p-1"
        onClick={handleSectionClick}>
        <LuLayers size={22} />
      </div>
    )
  }

  return (
    <div>
      <div
        className={cn(
          'flex justify-between items-center border-2 border-transparent rounded-md',
          {
            'border-purple-200 bg-purple-200': sectionActive,
            'justify-center': !sidebarExpanded,
          }
        )}>
        {renderSectionHeader()}
      </div>
      <StrictModeDroppable
        droppableId={`frame-droppable-sectionId-${section.id}`}
        type="frame">
        {(frameDroppableProvided, snapshot) => (
          <div
            key={`frame-draggable-${section.id}`}
            ref={frameDroppableProvided.innerRef}
            className={cn('rounded-sm transition-all w-full', {
              'bg-gray-50': snapshot.isDraggingOver,
              // 'cursor-grab': !actionDisabled,
            })}
            {...frameDroppableProvided.droppableProps}>
            <FrameList
              frames={frames}
              showList={sectionExpanded}
              droppablePlaceholder={frameDroppableProvided.placeholder}
            />
          </div>
        )}
      </StrictModeDroppable>
    </div>
  )
}
