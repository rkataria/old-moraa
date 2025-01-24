import { useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react'
import toast from 'react-hot-toast'
import { BsRecord2 } from 'react-icons/bs'
import { FaStopCircle } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { IoSettingsOutline, IoVolumeMuteOutline } from 'react-icons/io5'
import { LuUserPlus2 } from 'react-icons/lu'

import { AddParticipantsButtonWithModal } from '@/components/common/AddParticipantsButtonWithModal'
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useDyteParticipants } from '@/hooks/useDyteParticipants'
import { useRecording } from '@/hooks/useRecording'
import { useStoreDispatch } from '@/hooks/useRedux'
import { openChangeContentTilesLayoutModalAction } from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

export function MoreActions() {
  const { joinedParticipants } = useDyteParticipants()
  const [openRecordingConfirmationModal, setOpenRecordingConfirmationModal] =
    useState(false)
  const { setDyteStates, isHost } = useEventSession()
  const [open, setOpen] = useState(false)

  const addParticipantsDisclosure = useDisclosure()

  const { meeting } = useDyteMeeting()

  const { isRecording, startRecording } = useRecording()
  const dispatch = useStoreDispatch()

  const handleMicDisable = async () => {
    joinedParticipants.forEach((p) => {
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

            setOpenRecordingConfirmationModal(true)
          }}>
          {isRecording ? 'Stop recording' : 'Start recording'}
        </DropdownItem>
      )

      items.push(
        <DropdownItem
          key="add-participants"
          startContent={<LuUserPlus2 />}
          onClick={() => {
            addParticipantsDisclosure.onOpen()
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
        key="change-layout"
        startContent={<IoSettingsOutline />}
        onClick={() => {
          dispatch(openChangeContentTilesLayoutModalAction())
        }}>
        Change Layout
      </DropdownItem>
    )

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
    <div>
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
        <AddParticipantsButtonWithModal
          showLabel={false}
          disclosure={addParticipantsDisclosure}
        />
      )}
      <DeleteConfirmationModal
        open={openRecordingConfirmationModal}
        confirmButtonLabel="Start Recording"
        title="Ready to Start Recording?"
        description="Once you hit start, we’ll begin recording everything in the session.
               Make sure everyone’s set before you begin!"
        onConfirm={() => {
          startRecording()
          setOpenRecordingConfirmationModal(false)
        }}
        onClose={() => setOpenRecordingConfirmationModal(false)}
      />
    </div>
  )
}
