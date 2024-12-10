import { useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react'
import toast from 'react-hot-toast'
import { HiDotsVertical } from 'react-icons/hi'
import { IoSettingsOutline, IoVolumeMuteOutline } from 'react-icons/io5'
import { LuUserPlus2 } from 'react-icons/lu'

import { AddParticipantsModal } from '@/components/common/AddParticipantsModal'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { DyteRecordingService } from '@/services/dyte-recording.service'
import { cn } from '@/utils/utils'

export function MoreActions() {
  const [meetingRecordingId, setMeetingRecordingId] = useState<string | null>(
    null
  )
  const { setDyteStates, isHost } = useEventSession()
  const [open, setOpen] = useState(false)
  const [openAddParticipantsModal, setOpenAddParticipantsModal] =
    useState(false)
  const enrollment = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.enrollment.data
  )

  const { meeting } = useDyteMeeting()

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
          startContent={<LuUserPlus2 />}
          onClick={async () => {
            if (!enrollment?.meeting_token) return

            if (meetingRecordingId) {
              const response = await DyteRecordingService.stopMeeting({
                recordingId: meetingRecordingId,
                token: enrollment?.meeting_token,
              })

              const data = await response.json()

              if (response.ok) {
                setMeetingRecordingId(null)
                toast.success('Recording stopped')
              } else {
                toast.error('Failed to stop recording', data)
              }
            } else {
              const response = await DyteRecordingService.startMeeting({
                token: enrollment?.meeting_token,
                meetingId: meeting.connectedMeetings.currentMeetingId,
                url: `https://dev.moraa.co/event-session/${enrollment?.event_id}/record`,
              })

              const data = await response.json()

              if (response.ok) {
                setMeetingRecordingId(data.id)
                toast.success('Recording started')
              } else {
                toast.error('Failed to start recording', data)
              }
            }
          }}>
          {meetingRecordingId ? 'Stop recording' : 'Start recording'}
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
