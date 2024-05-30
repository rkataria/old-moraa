/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext } from 'react'

import { ChevronDownIcon } from 'lucide-react'
import { BsCardText, BsCollection } from 'react-icons/bs'
import { LuPlusCircle } from 'react-icons/lu'

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
    showSectionPlaceholder,
    showSlidePlaceholder,
    currentSlide,
    addSection,
    setInsertAfterSlideId,
    setInsertInSectionId,
  } = useContext(EventContext) as EventContextType

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddItem = (itemKey: any) => {
    const selectedOptionValue = Array.from(itemKey)[0]

    if (currentSlide) {
      setInsertAfterSlideId(currentSlide.id)
    }

    setInsertInSectionId(null)

    if (selectedOptionValue === 'new-section') {
      addSection({ afterSectionId: currentSlide?.section_id })
    }
    if (selectedOptionValue === 'new-slide') {
      onOpenContentTypePicker?.(true)
    }
  }

  if (!isOwner || eventMode !== 'edit' || preview) return null

  return (
    <ButtonGroup
      variant="flat"
      className="bg-black text-white max-w-[300px] rounded-md overflow-hidden mt-2"
      isDisabled={showSectionPlaceholder || showSlidePlaceholder}>
      <Button
        startContent={<LuPlusCircle />}
        className="bg-black text-white"
        onClick={() => {
          if (currentSlide) setInsertAfterSlideId(currentSlide.id)
          setInsertInSectionId(null)
          handleAddItem(new Set(['new-slide']))
        }}>
        {labelMap['new-slide']}
      </Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly className="bg-black text-white">
            <ChevronDownIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          selectionMode="single"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSelectionChange={handleAddItem}
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
