/* eslint-disable react/no-unescaped-entities */
import { useEffect, useMemo, useState } from 'react'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import toast from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { MdOutlineRadioButtonUnchecked } from 'react-icons/md'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { FrameStatus } from '@/types/enums'
import { cn, KeyboardShortcuts } from '@/utils/utils'

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
  const { permissions } = useEventPermissions()

  useEffect(() => {
    if (currentFrame) {
      setSelectedKeys(new Set([currentFrame.status!]))
    }
  }, [currentFrame])

  const updateFrameStatus = (status: FrameStatus) => {
    if (!currentFrame) return
    updateFrame({
      framePayload: {
        status,
      },
      frameId: currentFrame.id,
    })
    toast.success(
      status === FrameStatus.PUBLISHED
        ? 'This frame is now accessible to learners'
        : 'This frame has been removed from learner visibility.'
    )
  }

  useHotkeys(
    's',
    () => {
      if (!currentFrame) return

      updateFrameStatus(
        currentFrame.status === FrameStatus.DRAFT
          ? FrameStatus.PUBLISHED
          : FrameStatus.DRAFT
      )
    },
    {
      enabled: currentFrame && permissions.canUpdateFrame,
    },
    [currentFrame, updateFrameStatus]
  )

  if (!currentFrame) return null

  if (!permissions.canUpdateFrame) {
    return null
  }

  return (
    <Dropdown crossOffset={-20} isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <Button
          size="sm"
          isIconOnly
          className={cn('bg-transparent', {
            'text-primary': false,
          })}>
          <Tooltip
            label={KeyboardShortcuts['Studio Mode'].share.label}
            actionKey={KeyboardShortcuts['Studio Mode'].share.key}
            placement="left">
            <div>{statusIconMap[selectedValue]}</div>
          </Tooltip>
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
          onClick={() => updateFrameStatus(FrameStatus.DRAFT)}>
          Don't Share
        </DropdownItem>
        <DropdownItem
          key="publish"
          className="bg-transparent hover:bg-gray-200"
          startContent={statusIconMap.PUBLISHED}
          onClick={() => updateFrameStatus(FrameStatus.PUBLISHED)}>
          Share
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
