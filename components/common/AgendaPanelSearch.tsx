import { useContext } from 'react'

import { SearchInput } from './SearchInput'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { getSlidesFromSections } from '@/utils/utils'

export function AgendaPanelSearch({
  setExpandedSections,
}: {
  setExpandedSections: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const { isOwner, sections, setCurrentSlide } = useContext(
    EventContext
  ) as EventContextType

  const handleSlideSearch = (value: string) => {
    const slides = getSlidesFromSections(sections, !isOwner)

    const slide = slides.find((s) =>
      s.name.toLowerCase().includes(value.toLowerCase())
    )

    if (!slide) return

    const section = sections.find((s) => s.id === slide.section_id)

    if (!section) return

    setCurrentSlide(slide)
    setExpandedSections((prev) => {
      if (!prev.includes(section.id)) {
        return [...prev, section.id]
      }

      return prev
    })
  }

  return (
    <SearchInput
      onSearch={handleSlideSearch}
      inputProps={{
        variant: 'flat',
        radius: 'md',
        placeholder: 'Search...',
        classNames: { input: 'p-0', inputWrapper: 'h-6 relative' },
      }}
    />
  )
}
