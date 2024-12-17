import { createContext, useContext, useMemo, useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'

import { useEventPermissions } from './useEventPermissions'
import { useStoreSelector } from './useRedux'

import { useEventContext } from '@/contexts/EventContext'
import {
  setAgendaPanelDisplayTypeAction,
  setExpandedSectionsAction,
} from '@/stores/slices/layout/studio.slice'
import { EventContextType } from '@/types/event-context.type'
import { getNextFrame, getPreviousFrame } from '@/utils/event-session.utils'
import { getFilteredFramesByStatus } from '@/utils/event.util'
import { FrameType } from '@/utils/frame-picker.util'
import { KeyboardShortcuts } from '@/utils/utils'

type ListDisplayMode = 'list' | 'grid'

type AgendaPanelContextType = {
  expandedSectionIds: string[]
  listDisplayMode: ListDisplayMode
  currentSectionId: string | null
  expanded: boolean
  toggleExpanded: () => void
  toggleExpandedSection: (sectionId: string) => void
  toggleListDisplayMode: () => void
  setCurrentSectionId: EventContextType['setCurrentSectionId']
}

const AgendaPanelContext = createContext<AgendaPanelContextType | undefined>(
  undefined
)

export const useAgendaPanelContext = () => useContext(AgendaPanelContext)

export function AgendaPanelContextProvider({
  children,
}: React.PropsWithChildren<object>) {
  const {
    sections,
    currentFrame,
    eventMode,
    overviewOpen,
    currentSectionId,
    setCurrentSectionId,
    setCurrentFrame,
    setOverviewOpen,
  } = useEventContext()
  const { permissions } = useEventPermissions()

  const dispatch = useDispatch()
  const listDisplayMode = useStoreSelector(
    (state) => state.layout.studio.agendaPanelDisplayType
  )
  const expandedSectionIds = useStoreSelector(
    (state) => state.layout.studio.expandedSections
  )

  const [expanded, setExpanded] = useState<boolean>(false)

  const showPublishedFrames = !permissions.canUpdateFrame

  const previousFrame = useMemo(
    () =>
      getPreviousFrame({
        sections,
        currentFrame,
        onlyPublished: showPublishedFrames && eventMode !== 'present',
      }),
    [sections, currentFrame, showPublishedFrames, eventMode]
  )

  const nextFrame = useMemo(
    () =>
      getNextFrame({
        sections,
        currentFrame,
        onlyPublished: showPublishedFrames && eventMode !== 'present',
      }),
    [sections, currentFrame, showPublishedFrames, eventMode]
  )

  const getNextSection = () => {
    if (!currentSectionId) {
      if (!currentFrame) {
        return sections?.[0]
      }

      const currentSection = sections.find(
        (s) => s.id === currentFrame.section_id
      )

      if (!currentSection) return null

      const currentIndex = sections.findIndex((s) => s.id === currentSection.id)

      return sections[currentIndex + 1]
    }

    const currentIndex = sections.findIndex((s) => s.id === currentSectionId)

    return sections[currentIndex + 1]
  }

  const getPreviousSection = () => {
    if (!currentSectionId) return null

    const currentIndex = sections.findIndex((s) => s.id === currentSectionId)

    return sections[currentIndex - 1]
  }

  const getSectionFrames = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId)

    if (!section) return []

    return getFilteredFramesByStatus({
      frames: section.frames,
      status:
        showPublishedFrames && eventMode !== 'present' ? 'PUBLISHED' : null,
    })
  }

  useHotkeys('ArrowUp', () => {
    // Don't allow participants to navigate through the agenda when the event is live
    if (!permissions.canUpdateFrame && eventMode === 'present') return

    const previousSection = getPreviousSection()

    // 1. Current Section is not highlighted
    if (!currentSectionId) {
      // 1.1 if current frame is not set, highlight the last section
      if (!currentFrame) {
        setCurrentSectionId(sections[sections.length - 1].id)

        return
      }

      // 1.1a if current frame is set, and it is first frame of the section, highlight the section of the current frame
      const currentSection = sections.find(
        (s) => s.id === currentFrame.section_id
      )
      const currentSectionFrames = currentSection
        ? getSectionFrames(currentSection.id)
        : []
      const isCurrentFrameFirst = currentSectionFrames[0].id === currentFrame.id
      if (isCurrentFrameFirst) {
        setCurrentSectionId(currentFrame.section_id as string)
        setCurrentFrame(null)

        return
      }

      // 1.2 if current frame is set, and there is a previous frame from same section, move to the previous frame
      if (
        previousFrame &&
        currentFrame.section_id === previousFrame.section_id
      ) {
        setCurrentFrame(previousFrame)

        return
      }

      // 1.3 if current frame is set, and the previous frame is from different section, and the section is not expanded, highlight the previous section
      if (
        previousFrame &&
        currentFrame.section_id !== previousFrame.section_id &&
        !expandedSectionIds.includes(previousFrame.section_id!)
      ) {
        setCurrentSectionId(previousSection?.id as string)
      }

      // 1.3 if current frame is set, and the previous frame is from different section, and the section is expanded, move to previous frame
      if (
        previousFrame &&
        currentFrame.section_id !== previousFrame.section_id &&
        expandedSectionIds.includes(previousFrame.section_id!)
      ) {
        setCurrentFrame(previousFrame)
      }
    } else {
      // 2. Current Section is highlighted

      // 2.1 if previous section does not exist, do nothing
      if (!previousSection) {
        setOverviewOpen(true)

        return
      }

      // 2.2 if previous section exists, and previous section is not expanded, highlight the previous section
      if (
        previousSection &&
        !expandedSectionIds.includes(previousSection.id as string)
      ) {
        setCurrentSectionId(previousSection.id as string)

        return
      }

      // 2.3 if previous section exists, and previous section is expanded and previous section doesn't have frames, collapse the previous section
      if (
        previousSection &&
        expandedSectionIds.includes(previousSection.id as string) &&
        getSectionFrames(previousSection.id as string).length === 0
      ) {
        toggleExpandedSection(previousSection.id as string)

        return
      }

      // 2.4 if previous section exists, and previous section is expanded and previous section has frames, move to the last frame in the previous section
      if (
        previousSection &&
        expandedSectionIds.includes(previousSection.id as string) &&
        getSectionFrames(previousSection.id as string).length > 0
      ) {
        const lastFrame = getSectionFrames(previousSection.id as string).slice(
          -1
        )[0]

        setCurrentSectionId(null)
        setCurrentFrame(lastFrame)
      }
    }
  })

  useHotkeys('ArrowDown', () => {
    // Don't allow participants to navigate through the agenda when the event is live
    if (!permissions.canUpdateFrame && eventMode === 'present') return

    const nextSection = getNextSection()

    if (overviewOpen) {
      setOverviewOpen(false)
      setCurrentSectionId(nextSection?.id as string)

      return
    }

    // 1. Current Section is not highlighted
    if (!currentSectionId) {
      // 1.1 if current frame is not set, highlight the first section
      if (!currentFrame) {
        setCurrentSectionId(sections[0].id)

        return
      }

      // 1.2 if current frame is set, and there is a next frame from same section, move to the next frame
      if (nextFrame && currentFrame.section_id === nextFrame.section_id) {
        setCurrentFrame(nextFrame)
        setCurrentSectionId(null)

        return
      }

      // 1.3 if current frame is set, and next frame is in a different section, highlight the next section
      if (nextFrame && currentFrame.section_id !== nextFrame.section_id) {
        setCurrentSectionId(nextSection?.id as string)
        setCurrentFrame(null)

        return
      }

      if (!nextFrame && !nextSection?.id) {
        return
      }

      // 1.4 if current frame is set, and there is no next frame, highlight the next section
      if (!nextFrame && nextSection?.id) {
        setCurrentSectionId(nextSection?.id as string)
        setCurrentFrame(null)
      }
    } else {
      // 2. Current Section is highlighted

      // 2.0 if current section is highlighted, and it is expanded, and current frame is from same section, set current section null
      if (
        expandedSectionIds.includes(currentSectionId) &&
        currentFrame?.section_id === currentSectionId
      ) {
        setCurrentSectionId(null)

        return
      }

      // 2.1 if next section does not exist, and current section is not expanded, do nothing
      if (!nextSection && !expandedSectionIds.includes(currentSectionId)) {
        return
      }

      // 2.2 if next section does not exist, and current section is expanded, and there is no frame, do nothing
      if (
        !nextSection &&
        expandedSectionIds.includes(currentSectionId) &&
        getSectionFrames(currentSectionId).length === 0
      ) {
        return
      }

      // 2.3 if next section does not exist, and current section is expanded, and there is a frame, move to the first frame
      if (!nextSection && expandedSectionIds.includes(currentSectionId)) {
        const firstFrame = getSectionFrames(currentSectionId)[0]

        setCurrentSectionId(null)
        setCurrentFrame(firstFrame)

        return
      }

      // 2.4 if next section exists, and current section is not expanded, highlight the next section
      if (nextSection && !expandedSectionIds.includes(currentSectionId)) {
        setCurrentSectionId(nextSection.id)
        setCurrentFrame(null)

        return
      }

      // 2.5 if next section exists, and current section is expanded, and there is no frame, collapse the current section and highlight the next section
      if (
        nextSection &&
        expandedSectionIds.includes(currentSectionId) &&
        getSectionFrames(currentSectionId).length === 0
      ) {
        toggleExpandedSection(currentSectionId)
        setCurrentSectionId(nextSection.id)
        setCurrentFrame(null)

        return
      }

      // 2.6 if next section exists or not, and current section is expanded, and there are frames in current section, next frame is in current section, move to the next frame in the current section
      if (
        expandedSectionIds.includes(currentSectionId) &&
        nextFrame?.section_id === currentSectionId
      ) {
        setCurrentSectionId(null)
        setCurrentFrame(nextFrame)
      }

      // 2.7 if next section exists or not, and current section is expanded, and there are frames in current section, next frame is in different section, highlight the first frame in the current section
      if (
        expandedSectionIds.includes(currentSectionId) &&
        nextFrame?.section_id !== currentSectionId
      ) {
        const firstFrame = getSectionFrames(currentSectionId)[0]

        setCurrentSectionId(null)
        setCurrentFrame(firstFrame)
      }
    }
  })
  useHotkeys('ArrowLeft', () => {
    // Don't allow participants to navigate through the agenda when the event is live
    if (!permissions.canUpdateFrame && eventMode === 'present') return

    if (
      currentFrame?.type === FrameType.GOOGLE_SLIDES &&
      !currentFrame.content?.individualFrame
    ) {
      return
    }

    // if curren section is not highlighted, do nothing
    if (!currentSectionId) {
      // if there is a current frame, highlight the section of the current frame
      if (currentFrame) {
        setCurrentSectionId(currentFrame.section_id!)
        setCurrentFrame(null)
      }

      return
    }

    // if current section is highlighted, and it is not expanded, do nothing
    if (!expandedSectionIds.includes(currentSectionId)) return

    // if current section is highlighted, and it is expanded, collapse it
    toggleExpandedSection(currentSectionId)
  })

  useHotkeys('ArrowRight', () => {
    // Don't allow participants to navigate through the agenda when the event is live
    if (!permissions.canUpdateFrame && eventMode === 'present') return

    // if curren section is not highlighted, do nothing
    if (!currentSectionId) return
    // if current section is highlighted, and it is expanded, do nothing
    if (expandedSectionIds.includes(currentSectionId)) return
    // if current section is highlighted, and it is not expanded, expand it
    toggleExpandedSection(currentSectionId)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleView = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return
    dispatch(
      setAgendaPanelDisplayTypeAction(
        listDisplayMode === 'list' ? 'grid' : 'list'
      )
    )
  }

  useHotkeys(
    [
      KeyboardShortcuts['Agenda Panel'].grid.key,
      KeyboardShortcuts['Agenda Panel'].list.key,
    ],
    toggleView
  )

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const toggleExpandedSection = (sectionId: string) => {
    if (expandedSectionIds.includes(sectionId)) {
      dispatch(
        setExpandedSectionsAction(
          expandedSectionIds.filter((id) => id !== sectionId)
        )
      )

      return
    }

    dispatch(setExpandedSectionsAction([...expandedSectionIds, sectionId]))
  }

  const toggleListDisplayMode = () => {
    dispatch(
      setAgendaPanelDisplayTypeAction(
        listDisplayMode === 'list' ? 'grid' : 'list'
      )
    )
  }

  return (
    <AgendaPanelContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        expandedSectionIds,
        listDisplayMode,
        currentSectionId,
        expanded,
        toggleExpanded,
        toggleExpandedSection,
        toggleListDisplayMode,
        setCurrentSectionId,
      }}>
      {children}
    </AgendaPanelContext.Provider>
  )
}

export const useAgendaPanel = () => {
  const context = useContext(AgendaPanelContext)

  if (context === undefined) {
    throw new Error('useAgendaPanel must be used within a AgendaPanelProvider')
  }

  return context
}
