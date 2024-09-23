import { useEffect, useMemo, useState } from 'react'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { MdOutlineRadioButtonUnchecked } from 'react-icons/md'

import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { FrameStatus } from '@/types/enums'
import { cn } from '@/utils/utils'

const statusIconMap = {
  DRAFT: <MdOutlineRadioButtonUnchecked size={20} />,
  PUBLISHED: (
    <IoIosCheckmarkCircle
      size={20}
      strokeWidth={1.7}
      className="text-green-500"
    />
  ),
}
export function FrameStatusToggleButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentFrame, updateFrame } = useEventContext()
  const [selectedKeys, setSelectedKeys] = useState(new Set(['DRAFT']))

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(', ').replace('_', ' '),
    [selectedKeys]
  ) as FrameStatus

  useEffect(() => {
    if (currentFrame) {
      setSelectedKeys(new Set([currentFrame.status!]))
    }
  }, [currentFrame])

  const { permissions } = useEventPermissions()

  // TODO: Fix ctrl+! issue
  useHotkeys('ctrl+1', () => setIsOpen(true))
  useHotkeys('1', () => {
    if (isOpen) {
      updateFrameStatus(FrameStatus.DRAFT)
      setIsOpen(false)
    }
  })
  useHotkeys('2', () => {
    if (isOpen) {
      updateFrameStatus(FrameStatus.PUBLISHED)
      setIsOpen(false)
    }
  })

  if (!currentFrame) return null

  if (!permissions.canUpdateFrame) {
    return null
  }

  const updateFrameStatus = (status: FrameStatus) => {
    updateFrame({
      framePayload: {
        status,
      },
      frameId: currentFrame.id,
    })
  }

  return (
    <Dropdown crossOffset={-20} isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <Button
          size="sm"
          isIconOnly
          className={cn({
            'bg-primary-100': false,
          })}>
          {statusIconMap[selectedValue]}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Frame status"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}>
        <DropdownItem
          key="draft"
          className="bg-transparent hover:bg-gray-200"
          startContent={statusIconMap.DRAFT}
          shortcut="1"
          onClick={() => updateFrameStatus(FrameStatus.DRAFT)}>
          Draft
        </DropdownItem>
        <DropdownItem
          key="publish"
          className="bg-transparent hover:bg-gray-200"
          startContent={statusIconMap.PUBLISHED}
          shortcut="2"
          onClick={() => updateFrameStatus(FrameStatus.PUBLISHED)}>
          Publish
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
