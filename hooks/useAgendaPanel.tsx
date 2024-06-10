import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { getNextSlide, getPreviousSlide } from '@/utils/event-session.utils'
import { getFilteredSlidesByStatus } from '@/utils/event.util'

type ListDisplayMode = 'list' | 'grid'

type AgendaPanelContextType = {
  expandedSectionIds: string[]
  listDisplayMode: ListDisplayMode
  currentSectionId: string | null
  expanded: boolean
  toggleExpanded: () => void
  toggleExpandedSection: (sectionId: string) => void
  toggleListDisplayMode: () => void
  setCurrentSectionId: (sectionId: string) => void
}

const AgendaPanelContext = createContext<AgendaPanelContextType>({
  expandedSectionIds: [],
  listDisplayMode: 'list',
  currentSectionId: null,
  expanded: false,
  toggleExpanded: () => {},
  toggleExpandedSection: () => {},
  toggleListDisplayMode: () => {},
  setCurrentSectionId: () => {},
})

export const useAgendaPanelContext = () => useContext(AgendaPanelContext)

export function AgendaPanelContextProvider({
  children,
}: React.PropsWithChildren<object>) {
  const { sections, currentSlide, isOwner, eventMode, setCurrentSlide } =
    useContext(EventContext) as EventContextType
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>([])
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)
  const [listDisplayMode, setListDisplayMode] =
    useState<ListDisplayMode>('list')
  const [expanded, setExpanded] = useState<boolean>(false)

  // hotkeys
  useHotkeys('l', () => setListDisplayMode('list'), [])
  useHotkeys('g', () => setListDisplayMode('grid'), [])

  const previousSlide = useMemo(
    () =>
      getPreviousSlide({
        sections,
        currentSlide,
        onlyPublished: !isOwner && eventMode !== 'present',
      }),
    [sections, currentSlide, isOwner, eventMode]
  )
  const nextSlide = useMemo(
    () =>
      getNextSlide({
        sections,
        currentSlide,
        onlyPublished: !isOwner && eventMode !== 'present',
      }),
    [sections, currentSlide, isOwner, eventMode]
  )

  const getNextSection = () => {
    if (!currentSectionId) {
      if (!currentSlide) {
        return sections?.[0]
      }

      const currentSection = sections.find(
        (s) => s.id === currentSlide.section_id
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

  const getSectionSlides = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId)

    if (!section) return []

    return getFilteredSlidesByStatus({
      slides: section.slides,
      status: isOwner && eventMode !== 'present' ? null : 'PUBLISHED',
    })
  }

  console.log('slides --agenda', getSectionSlides(currentSectionId!))

  useHotkeys('ArrowUp', () => {
    const previousSection = getPreviousSection()

    // 1. Current Section is not highlighted
    if (!currentSectionId) {
      // 1.1 if current slide is not set, highlight the last section
      if (!currentSlide) {
        setCurrentSectionId(sections[sections.length - 1].id)

        return
      }

      // 1.1a if current slide is set, and it is first slide of the section, highlight the section of the current slide
      const currentSection = sections.find(
        (s) => s.id === currentSlide.section_id
      )
      const currentSectionSlides = currentSection
        ? getSectionSlides(currentSection.id)
        : []
      const isCurrentSlideFirst = currentSectionSlides[0].id === currentSlide.id
      if (isCurrentSlideFirst) {
        setCurrentSectionId(currentSlide.section_id as string)

        return
      }

      // 1.2 if current slide is set, and there is a previous slide from same section, move to the previous slide
      if (
        previousSlide &&
        currentSlide.section_id === previousSlide.section_id
      ) {
        setCurrentSlide(previousSlide)

        return
      }

      // 1.3 if current slide is set, and the previous slide is from different section, and the section is not expanded, highlight the previous section
      if (
        previousSlide &&
        currentSlide.section_id !== previousSlide.section_id &&
        !expandedSectionIds.includes(previousSlide.section_id!)
      ) {
        setCurrentSectionId(previousSection?.id as string)
      }

      // 1.3 if current slide is set, and the previous slide is from different section, and the section is expanded, move to previous slide
      if (
        previousSlide &&
        currentSlide.section_id !== previousSlide.section_id &&
        expandedSectionIds.includes(previousSlide.section_id!)
      ) {
        setCurrentSlide(previousSlide)
      }
    } else {
      // 2. Current Section is highlighted

      // 2.1 if previous section does not exist, do nothing
      if (!previousSection) return

      // 2.2 if previous section exists, and previous section is not expanded, highlight the previous section
      if (
        previousSection &&
        !expandedSectionIds.includes(previousSection.id as string)
      ) {
        setCurrentSectionId(previousSection.id as string)

        return
      }

      // 2.3 if previous section exists, and previous section is expanded and previous section doesn't have slides, collapse the previous section
      if (
        previousSection &&
        expandedSectionIds.includes(previousSection.id as string) &&
        getSectionSlides(previousSection.id as string).length === 0
      ) {
        toggleExpandedSection(previousSection.id as string)

        return
      }

      // 2.4 if previous section exists, and previous section is expanded and previous section has slides, move to the last slide in the previous section
      if (
        previousSection &&
        expandedSectionIds.includes(previousSection.id as string) &&
        getSectionSlides(previousSection.id as string).length > 0
      ) {
        const lastSlide = getSectionSlides(previousSection.id as string).slice(
          -1
        )[0]

        setCurrentSectionId(null)
        setCurrentSlide(lastSlide)
      }
    }

    // console.log('previousSection', currentSectionId, previousSection?.id)

    // if (previousSlide) {
    //   // if previous slide is in the same section, just move to the previous slide
    //   if (currentSlide?.section_id === previousSlide.section_id) {
    //     setCurrentSlide(previousSlide)

    //     return
    //   }

    //   // if previous slide is in a different section, and the section is expanded, move to the last slide in the section
    //   if (expandedSectionIds.includes(previousSlide.section_id!)) {
    //     setCurrentSectionId(null)
    //     setCurrentSlide(previousSlide)

    //     return
    //   }

    //   // if previous slide is in a different section, and the section is not expanded, highlight the section
    //   setCurrentSectionId(previousSection?.id as string)
    // }
  })

  useHotkeys('ArrowDown', () => {
    const nextSection = getNextSection()

    // 1. Current Section is not highlighted
    if (!currentSectionId) {
      // 1.1 if current slide is not set, highlight the first section
      if (!currentSlide) {
        setCurrentSectionId(sections[0].id)

        return
      }

      // 1.2 if current slide is set, and there is a next slide from same section, move to the next slide
      if (nextSlide && currentSlide.section_id === nextSlide.section_id) {
        setCurrentSlide(nextSlide)
        setCurrentSectionId(null)

        return
      }

      // 1.3 if current slide is set, and next slide is in a different section, highlight the next section
      if (nextSlide && currentSlide.section_id !== nextSlide.section_id) {
        setCurrentSectionId(nextSection?.id as string)

        return
      }

      // 1.4 if current slide is set, and there is no next slide, highlight the next section
      if (!nextSlide) {
        setCurrentSectionId(nextSection?.id as string)
      }
    } else {
      // 2. Current Section is highlighted

      // 2.1 if next section does not exist, and current section is not expanded, do nothing
      if (!nextSection && !expandedSectionIds.includes(currentSectionId)) {
        return
      }

      // 2.2 if next section does not exist, and current section is expanded, and there is no slide, do nothing
      if (
        !nextSection &&
        expandedSectionIds.includes(currentSectionId) &&
        getSectionSlides(currentSectionId).length === 0
      ) {
        return
      }

      // 2.3 if next section does not exist, and current section is expanded, and there is a slide, move to the first slide
      if (!nextSection && expandedSectionIds.includes(currentSectionId)) {
        const firstSlide = getSectionSlides(currentSectionId)[0]

        setCurrentSectionId(null)
        setCurrentSlide(firstSlide)

        return
      }

      // 2.4 if next section exists, and current section is not expanded, highlight the next section
      if (nextSection && !expandedSectionIds.includes(currentSectionId)) {
        setCurrentSectionId(nextSection.id)

        return
      }

      // 2.5 if next section exists, and current section is expanded, and there is no slide, collapse the current section and highlight the next section
      if (
        nextSection &&
        expandedSectionIds.includes(currentSectionId) &&
        getSectionSlides(currentSectionId).length === 0
      ) {
        toggleExpandedSection(currentSectionId)
        setCurrentSectionId(nextSection.id)

        return
      }

      // 2.6 if next section exists or not, and current section is expanded, and there are slides in current section, next slide is in current section, move to the next slide in the current section
      if (
        expandedSectionIds.includes(currentSectionId) &&
        nextSlide?.section_id === currentSectionId
      ) {
        setCurrentSectionId(null)
        setCurrentSlide(nextSlide)
      }

      // 2.7 if next section exists or not, and current section is expanded, and there are slides in current section, next slide is in different section, highlight the first slide in the current section
      if (
        expandedSectionIds.includes(currentSectionId) &&
        nextSlide?.section_id !== currentSectionId
      ) {
        const firstSlide = getSectionSlides(currentSectionId)[0]

        setCurrentSectionId(null)
        setCurrentSlide(firstSlide)
      }
    }
  })

  useHotkeys('ArrowLeft', () => {
    // if curren section is not highlighted, do nothing
    if (!currentSectionId) {
      // if there is a current slide, highlight the section of the current slide
      if (currentSlide) {
        setCurrentSectionId(currentSlide.section_id!)
      }

      return
    }

    // if current section is highlighted, and it is not expanded, do nothing
    if (!expandedSectionIds.includes(currentSectionId)) return

    // if current section is highlighted, and it is expanded, collapse it
    toggleExpandedSection(currentSectionId)
  })

  useHotkeys('ArrowRight', () => {
    // if curren section is not highlighted, do nothing
    if (!currentSectionId) return
    // if current section is highlighted, and it is expanded, do nothing
    if (expandedSectionIds.includes(currentSectionId)) return
    // if current section is highlighted, and it is not expanded, expand it
    toggleExpandedSection(currentSectionId)
  })

  useEffect(() => {
    if (!currentSlide) return

    setExpandedSectionIds((prev) => {
      if (!currentSlide.section_id) return prev

      if (prev.includes(currentSlide.section_id)) {
        return prev
      }

      return [...prev, currentSlide.section_id]
    })
    setCurrentSectionId(null)
  }, [currentSlide])

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const toggleExpandedSection = (sectionId: string) => {
    setExpandedSectionIds((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter((id) => id !== sectionId)
      }

      return [...prev, sectionId]
    })
  }

  const toggleListDisplayMode = () => {
    setListDisplayMode((prev) => (prev === 'list' ? 'grid' : 'list'))
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

export const useAgendaPanel = () => useAgendaPanelContext()
