import { useState } from 'react'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import { HiDotsVertical } from 'react-icons/hi'
import { IoSettingsOutline } from 'react-icons/io5'
import { LuUserPlus2 } from 'react-icons/lu'

import { AddParticipantsModal } from '@/components/common/AddParticipantsModal'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { cn } from '@/utils/utils'

export function MoreActions() {
  const { setDyteStates, isHost } = useEventSession()
  const [open, setOpen] = useState(false)
  const [openAddParticipantsModal, setOpenAddParticipantsModal] =
    useState(false)

  const renderMenuItems = () => {
    const items = []

    if (isHost) {
      items.push(
        <DropdownItem
          key="add-participants"
          startContent={<LuUserPlus2 />}
          onClick={() => {
            setOpenAddParticipantsModal(true)
          }}>
          Add new participant
        </DropdownItem>
      )
    }

    items.push(
      <DropdownItem
        key="settings"
        startContent={<IoSettingsOutline />}
        onClick={() => {
          setDyteStates((prevDyteStates) => ({
            ...prevDyteStates,
            activeSettings: true,
          }))
        }}>
        Video settings
      </DropdownItem>
    )

    return items
  }

  return (
    <>
      <Dropdown offset={10} onOpenChange={setOpen}>
        <DropdownTrigger>
          <Button
            variant="light"
            className={cn('live-button', {
              active: open,
            })}
            isIconOnly>
            <HiDotsVertical size={18} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>{renderMenuItems()}</DropdownMenu>
      </Dropdown>
      {isHost && (
        <AddParticipantsModal
          open={openAddParticipantsModal}
          setOpen={setOpenAddParticipantsModal}
        />
      )}
    </>
  )
}
