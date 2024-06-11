/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useEffect, useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { BottomControls } from './AgendaPanel/BottomControls'
import { Header } from './AgendaPanel/Header'
import { SectionList } from './AgendaPanel/SectionList'

import { EventContext } from '@/contexts/EventContext'
import { AgendaPanelContextProvider } from '@/hooks/useAgendaPanel'
import { EventContextType } from '@/types/event-context.type'
import { ISection } from '@/types/frame.type'

export function AgendaPanel() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const { currentFrame, sections, selectedSectionId } = useContext(
    EventContext
  ) as EventContextType

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
      <div className="w-full h-full max-h-full">
        <Header />
        <SectionList />
        <BottomControls />
      </div>
    </AgendaPanelContextProvider>
  )
}
