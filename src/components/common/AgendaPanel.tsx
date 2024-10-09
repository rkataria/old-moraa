/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { SectionList } from './AgendaPanel/SectionList'

import { useEventContext } from '@/contexts/EventContext'
import { AgendaPanelContextProvider } from '@/hooks/useAgendaPanel'
import { ISection } from '@/types/frame.type'
import { cn } from '@/utils/utils'

export function AgendaPanel({ header }: { header?: React.ReactNode }) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const { currentFrame, sections, selectedSectionId } = useEventContext()

  useEffect(() => {
    if (selectedSectionId) {
      setExpandedSections([selectedSectionId])

      return
    }

    if (currentFrame) {
      const section = sections.find(
        (s) => s.id === currentFrame.section_id
      ) as ISection

      if (section) {
        setExpandedSections((prev) => {
          if (!prev.includes(section.id)) {
            return [...prev, section.id]
          }

          return prev
        })
      }
    }
  }, [currentFrame, sections, selectedSectionId])

  const expandAndCollapseSections = () => {
    if (expandedSections.length === 0) {
      setExpandedSections(sections.map((s) => s.id))

      return
    }

    setExpandedSections([])
  }

  useHotkeys('Minus', expandAndCollapseSections, [sections, expandedSections])

  return (
    <AgendaPanelContextProvider>
      <div className={cn('flex flex-col w-full h-full p-2')}>
        {header}
        <SectionList />
      </div>
    </AgendaPanelContextProvider>
  )
}
