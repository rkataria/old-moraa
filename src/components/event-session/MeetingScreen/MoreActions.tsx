import { useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import toast from 'react-hot-toast'
import { BsRecord2 } from 'react-icons/bs'
import { FaStopCircle } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { IoSettingsOutline, IoVolumeMuteOutline } from 'react-icons/io5'
import { LuUserPlus2 } from 'react-icons/lu'
import { RiFocus2Fill, RiFocus2Line } from 'react-icons/ri'

import { AddParticipantsModal } from '@/components/common/AddParticipantsModal'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useAppContext } from '@/hooks/useApp'
import { useRecording } from '@/hooks/useRecording'
import { cn } from '@/utils/utils'

export function MoreActions() {
  const { isZenMode, toggleZenMode } = useAppContext()
  const { setDyteStates, isHost } = useEventSession()
  const [open, setOpen] = useState(false)
  const [openAddParticipantsModal, setOpenAddParticipantsModal] =
    useState(false)

  const { meeting } = useDyteMeeting()

  const { isRecording, startRecording } = useRecording()

  const handleMicDisable = async () => {
    meeting.participants.joined.toArray().forEach((p) => {
      meeting.participants.disableAudio(p.id)
    })
    toast.success('All participant muted')
  }

  const renderMenuItems = () => {
    const items = []

    if (isHost) {
      items.push(
        <DropdownItem
          key="record-meeting"
          startContent={isRecording ? <FaStopCircle /> : <BsRecord2 />}
          onClick={async () => {
            if (isRecording) {
              meeting.recording.stop()

              return
            }

            startRecording()
          }}>
          {isRecording ? 'Stop recording' : 'Start recording'}
        </DropdownItem>
      )

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
      items.push(
        <DropdownItem
          key="mute-participants"
          startContent={<IoVolumeMuteOutline />}
          onClick={handleMicDisable}>
          Mute all participants
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

    items.push(
      <DropdownItem
        key="zen-mode"
        startContent={isZenMode ? <RiFocus2Fill /> : <RiFocus2Line />}
        onClick={toggleZenMode}>
        {isZenMode ? 'Disable' : 'Enable'} Zen Mode
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
