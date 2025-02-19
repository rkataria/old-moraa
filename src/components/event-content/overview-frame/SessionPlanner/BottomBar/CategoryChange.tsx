import { useState } from 'react'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@nextui-org/react'
import { AiOutlineClose } from 'react-icons/ai'
import { LuTag } from 'react-icons/lu'

import { useEventContext } from '@/contexts/EventContext'
import { useStoreDispatch } from '@/hooks/useRedux'
import { updateFrameThunk } from '@/stores/thunks/frame.thunks'
import { FrameEngagementType } from '@/utils/frame-picker.util'
import { FrameEngagementTypes } from '@/utils/utils'

export function CategoryChange({
  selectedFrameIds,
  setSelectedFrameIds,
}: {
  selectedFrameIds: string[]
  setSelectedFrameIds: (ids: string[]) => void
}) {
  const { getFrameById } = useEventContext()
  const dispatch = useStoreDispatch()
  const [isOpen, setIsOpen] = useState(false)

  const changeCategory = (changedCategory: string) => {
    selectedFrameIds.forEach((frameId) => {
      dispatch(
        updateFrameThunk({
          frameId,
          frame: {
            config: {
              ...getFrameById(frameId).config,
              colorCode: changedCategory,
            },
          },
        })
      )
    })

    setSelectedFrameIds([])
  }

  const actions = Object.keys(FrameEngagementTypes).map((key) => ({
    key,
    ...FrameEngagementTypes[key as FrameEngagementType],
  }))

  return (
    <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger>
        <div className="grid place-items-center h-full py-2 cursor-pointer gap-1">
          <LuTag size={22} rotate={180} className="hover:text-primary" />
          <p className="text-xs">Category</p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="py-4 px-4 pl-1.5">
        <div className="w-[200px]">
          <div className="flex items-center justify-between pl-2">
            <p>Choose category</p>
            <AiOutlineClose
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            />
          </div>

          <div className="grid gap-1 mt-1">
            {actions.map((category) => (
              <Button
                startContent={category.icon}
                variant="light"
                className="justify-start pl-1.5"
                size="sm"
                onClick={() => changeCategory(category.key)}>
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
