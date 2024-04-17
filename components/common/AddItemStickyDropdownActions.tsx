/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useState } from 'react'

import { ChevronDownIcon } from 'lucide-react'
import { BsCardText, BsCollection } from 'react-icons/bs'

import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

const descriptionMap: {
  'new-section': string
  'new-slide': string
} = {
  'new-section': 'Add a new section after the last section',
  'new-slide': 'Add a new slide to the last section',
}

const iconMap: {
  'new-section': JSX.Element
  'new-slide': JSX.Element
} = {
  'new-section': <BsCollection className="h-4 w-4 text-slate-500" />,
  'new-slide': <BsCardText className="h-4 w-4 text-slate-500" />,
}

const labelMap: {
  'new-section': string
  'new-slide': string
} = {
  'new-section': 'New Section',
  'new-slide': 'New Slide',
}

export function AddItemStickyDropdownActions({
  onOpenContentTypePicker,
}: {
  onOpenContentTypePicker?: (open: boolean) => void
}) {
  const {
    preview,
    isOwner,
    eventMode,
    sections,
    meeting,
    showSectionPlaceholder,
    showSlidePlaceholder,
    setInsertInSectionId,
    setInsertAfterSectionId,
    setInsertAfterSlideId,
    addSection,
  } = useContext(EventContext) as EventContextType
  const [selectedOption, setSelectedOption] = useState(new Set(['new-slide']))

  const handleClick = () => {
    const selectedOptionValue = Array.from(selectedOption)[0]
    const lastSectionId = meeting.sections[meeting.sections.length - 1]
    const lastSection = sections.find((section) => section.id === lastSectionId)
    const lastSlideOfLastSection =
      lastSection?.slides[lastSection.slides.length - 1]

    if (selectedOptionValue === 'new-section') {
      setInsertAfterSectionId(lastSectionId)
      addSection({
        afterSectionId: lastSectionId,
      })
    }
    if (selectedOptionValue === 'new-slide') {
      if (lastSlideOfLastSection) {
        setInsertAfterSlideId(lastSlideOfLastSection.id)
      }
      if (lastSectionId) setInsertInSectionId(lastSectionId)
      onOpenContentTypePicker?.(true)
    }
  }

  if (!isOwner || eventMode !== 'edit' || preview) return null

  const selectedOptionValue = Array.from(selectedOption)[0]

  return (
    <ButtonGroup
      variant="flat"
      color="primary"
      fullWidth
      className="pt-2"
      isDisabled={showSectionPlaceholder || showSlidePlaceholder}>
      <Button onClick={handleClick}>
        {labelMap[selectedOptionValue as 'new-section' | 'new-slide']}
      </Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly>
            <ChevronDownIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          selectedKeys={selectedOption}
          selectionMode="single"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSelectionChange={(value: any) => {
            setSelectedOption(value)
          }}
          className="max-w-[300px]">
          <DropdownItem
            key="new-slide"
            startContent={iconMap['new-slide']}
            description={descriptionMap['new-slide']}>
            {labelMap['new-slide']}
          </DropdownItem>
          <DropdownItem
            key="new-section"
            startContent={iconMap['new-section']}
            description={descriptionMap['new-section']}>
            {labelMap['new-section']}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  )
}
