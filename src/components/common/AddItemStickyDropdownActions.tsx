/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import {
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { ChevronDownIcon } from 'lucide-react'
import { BsCardText, BsCollection } from 'react-icons/bs'
import { GoPlus } from 'react-icons/go'

import { Button } from '../ui/Button'

import { useEventContext } from '@/contexts/EventContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

const descriptionMap: {
  'new-section': string
  'new-frame': string
} = {
  'new-section': 'Add a new section to the agenda',
  'new-frame': 'Add a new frame to the current section',
}

const iconMap: {
  'new-section': JSX.Element
  'new-frame': JSX.Element
} = {
  'new-section': <BsCollection className="h-4 w-4 text-slate-500" />,
  'new-frame': <BsCardText className="h-4 w-4 text-slate-500" />,
}

const labelMap: {
  'new-section': string
  'new-frame': string
} = {
  'new-section': 'New Section',
  'new-frame': 'Add Frame',
}

export function AddItemStickyDropdownActions({
  className = '',
  onOpenContentTypePicker,
}: {
  className?: string
  onOpenContentTypePicker?: (open: boolean) => void
}) {
  const {
    preview,
    isOwner,
    eventMode,
    currentFrame,
    insertInSectionId,
    addSection,
    setInsertAfterFrameId,
    setInsertInSectionId,
  } = useEventContext()
  const isAddSectionLoading = useStoreSelector(
    (state) =>
      state.event.currentEvent.sectionState.createSectionThunk.isLoading
  )
  const isAddFrameLoading = useStoreSelector(
    (state) => state.event.currentEvent.frameState.addFrameThunk.isLoading
  )

  const addItem = (selectedOptionValue: string) => {
    if (selectedOptionValue === 'new-section') {
      addSection({ afterSectionId: currentFrame?.section_id })
    }
    if (selectedOptionValue === 'new-frame') {
      onOpenContentTypePicker?.(true)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddItem = (itemKey: any) => {
    const selectedOptionValue = Array.from(itemKey)[0]

    if (insertInSectionId) {
      addItem(selectedOptionValue as string)

      return
    }

    if (currentFrame) {
      setInsertAfterFrameId(currentFrame.id)
    }

    setInsertInSectionId(null)

    addItem(selectedOptionValue as string)
  }

  if (!isOwner || eventMode !== 'edit' || preview) return null

  return (
    <ButtonGroup
      size="sm"
      variant="bordered"
      className={cn(
        'rounded-lg overflow-hidden mt-2 border justify-between',
        className
      )}
      isDisabled={isAddSectionLoading || isAddFrameLoading}>
      <Button
        variant="light"
        disableRipple
        startContent={<GoPlus size={18} />}
        onClick={() => handleAddItem(new Set(['new-frame']))}
        className="bg-transparent w-full text-xs font-medium">
        {labelMap['new-frame']}
      </Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button
            variant="light"
            isIconOnly
            disableRipple
            className="bg-transparent w-[50px]">
            <ChevronDownIcon size={16} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="light"
          disallowEmptySelection
          selectionMode="single"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSelectionChange={handleAddItem}
          className="max-w-[300px]">
          {/* <DropdownItem
            key="new-frame"
            startContent={iconMap['new-frame']}
            description={descriptionMap['new-frame']}>
            {labelMap['new-frame']}
          </DropdownItem> */}
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
