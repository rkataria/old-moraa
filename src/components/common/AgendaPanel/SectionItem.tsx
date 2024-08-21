/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useState } from 'react'

import { IoChevronForward } from 'react-icons/io5'
import { LuLayers } from 'react-icons/lu'
import { v4 as uuidv4 } from 'uuid'

import { FrameList } from './FrameList'
import { DeleteConfirmationModal } from '../DeleteConfirmationModal'
import { EditableLabel } from '../EditableLabel'
import { SectionDropdownActions } from '../SectionDropdownActions'
import { StrictModeDroppable } from '../StrictModeDroppable'

import { Button } from '@/components/ui/Button'
import { EventContext } from '@/contexts/EventContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { IFrame, ISection } from '@/types/frame.type'
import { getFilteredFramesByStatus } from '@/utils/event.util'
import { cn } from '@/utils/utils'

type SectionItemProps = {
  section: ISection
  actionDisabled: boolean
}

export function SectionItem({ section, actionDisabled }: SectionItemProps) {
  const {
    setInsertAfterFrameId,
    setInsertInSectionId,
    setCurrentFrame,
    updateSection,
    eventMode,
    overviewOpen,
    deleteSection,
    setOverviewOpen,
    addFrameToSection,
  } = useContext(EventContext) as EventContextType

  const { permissions } = useEventPermissions()

  const {
    expandedSectionIds,
    currentSectionId,
    toggleExpandedSection,
    setCurrentSectionId,
  } = useAgendaPanel()
  const { leftSidebarVisiblity } = useStudioLayout()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const frames =
    permissions.canUpdateFrame &&
    (eventMode === 'edit' || eventMode === 'present')
      ? section.frames
      : getFilteredFramesByStatus({
          frames: section.frames,
          status: 'PUBLISHED',
        })

  // When a section is clicked, it should be expanded and the current section should be active in the agenda panel
  const handleSectionClick = () => {
    setInsertInSectionId(section.id)
    setInsertAfterFrameId(null)
    setCurrentSectionId(section.id)
    setCurrentFrame(null)
    setOverviewOpen(false)
  }

  const sectionExpanded = expandedSectionIds.includes(section.id)
  const sidebarExpanded = leftSidebarVisiblity === 'maximized'
  const sectionActive = !overviewOpen && currentSectionId === section.id

  const duplicateFrame = (frame: IFrame) => {
    const newFrame = {
      id: uuidv4(),
      config: frame.config,
      content: frame.content,
      status: frame.status,
      type: frame.type,
      section_id: frame.section_id,
      meeting_id: frame.meeting_id,
      name: `Copy-${frame.name}`,
    }

    addFrameToSection({
      frame: newFrame,
      section,
      afterFrameId: frame.id!,
    })
  }

  const renderItem = () => {
    if (sidebarExpanded) {
      return (
        <div
          className={cn(
            'flex justify-between items-center rounded-md px-2 group/section-item hover:bg-gray-200 hover:border-gray-200',
            {
              'bg-primary-100': sectionActive,
            }
          )}>
          <div
            className="flex justify-start items-center flex-auto gap-2 h-8 border-0 rounded-md"
            onClick={handleSectionClick}>
            <IoChevronForward
              className={cn('duration-300 shrink-0 cursor-pointer', {
                'rotate-90': sectionExpanded,
              })}
              onClick={(e) => {
                e.stopPropagation()
                toggleExpandedSection(section.id)
              }}
            />
            <LuLayers size={18} className="flex-none" />
            <EditableLabel
              readOnly={actionDisabled}
              label={section.name}
              className="text-sm font-semibold tracking-tight cursor-pointer"
              onUpdate={(value: string) => {
                updateSection({
                  sectionPayload: { name: value },
                  sectionId: section.id,
                })
              }}
            />
          </div>
          <div className={cn('hidden group-hover/section-item:block')}>
            <SectionDropdownActions
              section={section}
              onDelete={() => setIsDeleteModalOpen(true)}
            />
          </div>
        </div>
      )
    }

    return (
      <div className={cn('flex justify-center items-center')}>
        <Button
          size="sm"
          isIconOnly
          className={cn('m-auto bg-gray-100', {
            'bg-primary-200': sectionActive,
          })}
          onClick={handleSectionClick}>
          <LuLayers size={18} />
        </Button>
      </div>
    )
  }

  return (
    <div>
      {renderItem()}
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
              duplicateFrame={duplicateFrame}
            />
          </div>
        )}
      </StrictModeDroppable>
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        description={
          <p>
            Are you sure to delete this section <strong>{section.name}</strong>?
            This will also delete <strong>{section.frames.length}</strong>{' '}
            {section.frames.length > 1 ? 'frames' : 'frame'}.
          </p>
        }
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteSection({
            sectionId: section.id,
          })
          setIsDeleteModalOpen(false)
        }}
      />
    </div>
  )
}
