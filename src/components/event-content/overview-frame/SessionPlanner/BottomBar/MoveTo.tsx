import { useState } from 'react'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Button,
} from '@heroui/react'
import { AiOutlineClose } from 'react-icons/ai'
import { GoArrowRight } from 'react-icons/go'

import { useStoreDispatch } from '@/hooks/useRedux'
import { useEventSelector } from '@/stores/hooks/useEventSections'
import { reorderFramesAction } from '@/stores/slices/event/current-event/section.slice'

export function MoveToSection({
  selectedFrameIds,
  setSelectedFrameIds,
}: {
  selectedFrameIds: string[]
  setSelectedFrameIds: (ids: string[]) => void
}) {
  const dispatch = useStoreDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const { sections } = useEventSelector()
  const [search, setSearch] = useState('')

  const moveToSection = (movedToSectionId: string) => {
    const destinationSection = sections.find(
      (section) => section.id === movedToSectionId
    )
    dispatch(
      reorderFramesAction({
        frameIds: selectedFrameIds,
        destinationSectionId: movedToSectionId,
        destinationIndex: destinationSection?.frames.length || 0,
      })
    )
    setSelectedFrameIds([])
  }

  const getSections = () => {
    if (!search) return sections

    return sections.filter(
      (section) =>
        section.name &&
        section.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  return (
    <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger>
        <div className="grid place-items-center h-full py-2 cursor-pointer gap-1">
          <GoArrowRight size={22} className="hover:text-primary" />
          <p className="text-xs">Move to</p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="py-4 px-4">
        <div className="w-[300px]">
          <div className="flex items-center justify-between">
            <p>Choose section</p>
            <AiOutlineClose
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            />
          </div>
          <Input
            type="text"
            size="sm"
            placeholder="Search section"
            className="mt-2"
            variant="bordered"
            classNames={{ inputWrapper: 'border-1' }}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="grid gap-1 mt-1">
            {getSections().map((section) => (
              <Button
                size="sm"
                variant="light"
                className="justify-start pl-1.5"
                onClick={() => moveToSection(section.id)}>
                {section.name}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
