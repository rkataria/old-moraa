import { createContext, useContext, useMemo, useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'

import { useEventPermissions } from './useEventPermissions'
import { useStoreSelector } from './useRedux'

import { useEventContext } from '@/contexts/EventContext'
import {
  setAgendaPanelDisplayTypeAction,
  setExpandedSectionsAction,
  toggleContentStudioLeftSidebarVisibleAction,
  toggleContentStudioRightSidebarVisibleAction,
} from '@/stores/slices/layout/studio.slice'
import { EventContextType } from '@/types/event-context.type'
import { getNextFrame, getPreviousFrame } from '@/utils/event-session.utils'
import { KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

type ListDisplayMode = 'list' | 'grid'

type AgendaPanelContextType = {
  expandedSectionIds: string[]
  listDisplayMode: ListDisplayMode
  currentSectionId: string | null
  expanded: boolean
  draggingFrameId: string
  selectedFrameIds: string[]
  toggleExpanded: () => void
  toggleExpandedSection: (sectionId: string) => void
  toggleListDisplayMode: () => void
  onMultiSelect: (frameId: string) => void
  resetMultiSelect: () => void
  setDraggingFrameId: (frameId: string) => void
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
    currentSectionId,
    setCurrentSectionId,
    setCurrentFrame,
  } = useEventContext()
  const { permissions } = useEventPermissions()
  const [selectedFrameIds, setSelectedFrameIds] = useState<string[]>([])
  const [draggingFrameId, setDraggingFrameId] = useState('')

  const dispatch = useDispatch()

  const listDisplayMode = useStoreSelector(
    (state) => state.layout.studio.agendaPanelDisplayType
  )
  const expandedSectionIds = useStoreSelector(
    (state) => state.layout.studio.expandedSections
  )

  const [expanded, setExpanded] = useState<boolean>(false)

  const allowedToNavigate =
    permissions.canUpdateFrame || eventMode !== 'present'
  const showOnlyPublishedFrames =
    !permissions.canUpdateFrame && eventMode !== 'present'

  const previousFrame = useMemo(
    () =>
      getPreviousFrame({
        sections,
        currentFrame,
        onlyPublished: showOnlyPublishedFrames,
      }),
    [sections, currentFrame, showOnlyPublishedFrames]
  )

  const nextFrame = useMemo(
    () =>
      getNextFrame({
        sections,
        currentFrame,
        onlyPublished: showOnlyPublishedFrames,
      }),
    [sections, currentFrame, showOnlyPublishedFrames]
  )

  const getNextSection = () => {
    const currentSectionIndex = sections.findIndex(
      (s) => s.id === currentSectionId || s.id === currentFrame?.section_id
    )

    if (currentSectionIndex === -1) {
      return sections[0]
    }

    if (currentSectionIndex >= sections.length - 1) {
      return null
    }

    return sections[currentSectionIndex + 1]
  }

  const getPreviousSection = () => {
    const currentSectionIndex = sections.findIndex(
      (s) => s.id === currentSectionId || s.id === currentFrame?.section_id
    )

    if (currentSectionIndex === -1) {
      return sections[0]
    }

    if (currentSectionIndex === 0 || currentSectionIndex >= sections.length) {
      return null
    }

    return sections[currentSectionIndex - 1]
  }

  const toggleListDisplayMode = () => {
    dispatch(
      setAgendaPanelDisplayTypeAction(
        listDisplayMode === 'list' ? 'grid' : 'list'
      )
    )
  }

  useHotkeys('ArrowUp', () => {
    if (!allowedToNavigate) return

    // 1. Find previous frame and navigate to it
    // 2. Find previous section and navigate to it

    if (previousFrame) {
      setCurrentFrame(previousFrame)

      return
    }

    const previousSection = getPreviousSection()

    if (previousSection) {
      setCurrentSectionId(previousSection.id)
    }
  })

  useHotkeys('ArrowDown', () => {
    if (!allowedToNavigate) return

    // 1. Find next frame and navigate to it
    // 2. Find next section and navigate to it

    if (nextFrame) {
      setCurrentFrame(nextFrame)

      return
    }

    const nextSection = getNextSection()

    if (nextSection) {
      setCurrentSectionId(nextSection.id)
    }
  })

  // TODO: Fix this logic @nirajkaushal
  // useHotkeys('ArrowLeft', () => {
  //   // Don't allow participants to navigate through the agenda when the event is live
  //   if (!allowedToNavigate) return

  //   if (
  //     currentFrame?.type === FrameType.GOOGLE_SLIDES &&
  //     !currentFrame.content?.individualFrame
  //   ) {
  //     return
  //   }

  //   const currentSection = sections.find(
  //     (s) => s.id === currentFrame?.section_id
  //   )

  //   if (!currentSection) return

  //   const sectionExapnded = expandedSectionIds.includes(currentSection.id)

  //   if (sectionExapnded) {
  //     toggleExpandedSection(currentSection.id)
  //   }
  // })

  // TODO: Fix this logic @nirajkaushal
  // useHotkeys('ArrowRight', () => {
  //   // Don't allow participants to navigate through the agenda when the event is live
  //   if (!allowedToNavigate) return

  //   if (
  //     currentFrame?.type === FrameType.GOOGLE_SLIDES &&
  //     !currentFrame.content?.individualFrame
  //   ) {
  //     return
  //   }

  //   const currentSection = sections.find(
  //     (s) => s.id === currentFrame?.section_id
  //   )

  //   if (!currentSection) return

  //   const sectionExapnded = expandedSectionIds.includes(currentSection.id)

  //   if (!sectionExapnded) {
  //     toggleExpandedSection(currentSection.id)
  //   }
  // })

  useHotkeys(
    [
      KeyboardShortcuts['Agenda Panel'].grid.key,
      KeyboardShortcuts['Agenda Panel'].list.key,
    ],
    toggleListDisplayMode,
    liveHotKeyProps
  )

  useHotkeys(
    KeyboardShortcuts['Agenda Panel'].expandAndCollapse.keyWithCode,
    () => dispatch(toggleContentStudioLeftSidebarVisibleAction()),
    liveHotKeyProps
  )

  useHotkeys(
    KeyboardShortcuts['Agenda Panel'].expandAndCollapseRightSideBar.keyWithCode,
    () => dispatch(toggleContentStudioRightSidebarVisibleAction()),
    liveHotKeyProps
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

  const onMultiSelect = (frameId: string) => {
    const previousFrames = selectedFrameIds.length
      ? [...selectedFrameIds]
      : [currentFrame?.id || '']

    const updatedFrameIds = previousFrames.includes(frameId)
      ? previousFrames.filter((id) => id !== frameId)
      : [...previousFrames, frameId]

    setSelectedFrameIds(updatedFrameIds)
  }

  const resetMultiSelect = () => {
    setSelectedFrameIds([])
  }

  return (
    <AgendaPanelContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        expandedSectionIds,
        listDisplayMode,
        currentSectionId,
        expanded,
        draggingFrameId,
        selectedFrameIds,
        toggleExpanded,
        toggleExpandedSection,
        toggleListDisplayMode,
        setCurrentSectionId,
        onMultiSelect,
        resetMultiSelect,
        setDraggingFrameId,
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
