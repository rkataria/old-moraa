/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext } from 'react'

import { LuLayers } from 'react-icons/lu'

import { Chip } from '@nextui-org/react'

import { SlideList } from './SlideList'
import { EditableLabel } from '../EditableLabel'

import { EventContext } from '@/contexts/EventContext'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { EventContextType } from '@/types/event-context.type'
import { ISection } from '@/types/slide.type'
import { getFilteredSlidesByStatus } from '@/utils/event.util'
import { cn } from '@/utils/utils'

type SectionItemProps = {
  section: ISection
  actionDisabled: boolean
}

export function SectionItem({ section, actionDisabled }: SectionItemProps) {
  const {
    isOwner,
    setInsertAfterSlideId,
    setInsertInSectionId,
    setCurrentSlide,
    updateSection,
    eventMode,
  } = useContext(EventContext) as EventContextType
  const {
    expandedSectionIds,
    currentSectionId,
    toggleExpandedSection,
    setCurrentSectionId,
  } = useAgendaPanel()
  const { leftSidebarVisiblity } = useStudioLayout()

  const slides = getFilteredSlidesByStatus({
    slides: section.slides,
    status: isOwner && eventMode !== 'present' ? null : 'PUBLISHED',
  })

  const handleSectionClick = () => {
    const isSectionExpanded = expandedSectionIds.includes(section.id)

    setInsertInSectionId(section.id)
    setInsertAfterSlideId(null)

    toggleExpandedSection(section.id)

    if (!isSectionExpanded) {
      const firstSlide = section.slides[0]
      if (firstSlide) {
        setCurrentSlide(firstSlide)
      }
    } else {
      setCurrentSectionId(section.id)
    }
  }

  const sectionExpanded = expandedSectionIds.includes(section.id)
  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  const renderSectionHeader = () => {
    if (sidebarExpanded) {
      return (
        <>
          <div
            className="flex justify-start items-center gap-2"
            onClick={handleSectionClick}>
            <LuLayers size={22} />
            <EditableLabel
              readOnly={actionDisabled}
              label={section.name}
              className="text-sm font-semibold cursor-pointer"
              onUpdate={(value: string) => {
                updateSection({
                  sectionPayload: { name: value },
                  sectionId: section.id,
                })
              }}
            />
          </div>
          <span className="flex-none">
            <Chip
              size="sm"
              className="aspect-square flex justify-center items-center">
              {slides.length}
            </Chip>
          </span>
        </>
      )
    }

    return (
      <div
        className="flex justify-center items-center cursor-pointer"
        onClick={handleSectionClick}>
        <LuLayers size={22} />
      </div>
    )
  }

  return (
    <div>
      <div
        className={cn(
          'flex justify-between items-center p-1.5 border-1 border-transparent',
          {
            'border-black': currentSectionId === section.id,
            'justify-center': !sidebarExpanded,
          }
        )}>
        {renderSectionHeader()}
      </div>
      {sectionExpanded && <SlideList slides={slides} />}
    </div>
  )
}
