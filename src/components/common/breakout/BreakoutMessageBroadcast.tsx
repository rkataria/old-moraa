import { useEffect, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import {
  Button,
  Checkbox,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
} from '@nextui-org/react'
import toast from 'react-hot-toast'
import { PiTelegramLogoLight } from 'react-icons/pi'

import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'
import { useStoreSelector } from '@/hooks/useRedux'

export function BreakoutMessageBroadcast() {
  const connectedMeetings = useDyteSelector(
    (state) => state.connectedMeetings.meetings
  )
  const meetingTitles = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.meetingTitles
  )
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [sendingMessageToRooms, setSendingMessageToRooms] = useState<
    Array<string>
  >([])
  const [message, setMessage] = useState('')
  const { eventRealtimeChannel } = useRealtimeChannel()

  useEffect(() => {
    if (!isMessageModalOpen) {
      setMessage('')
      setSendingMessageToRooms([])
    }
  }, [isMessageModalOpen])

  const onMessageSend = () => {
    eventRealtimeChannel?.send({
      type: 'broadcast',
      event: 'broadcast-breakout-message',
      payload: {
        meetIds: sendingMessageToRooms,
        message,
      },
    })
    setIsMessageModalOpen(false)
    toast.success('Message sent.')
  }

  return (
    <>
      <Tooltip content="Send message in breakout rooms">
        <Button
          variant="light"
          isIconOnly
          onClick={() => setIsMessageModalOpen(true)}>
          <PiTelegramLogoLight fontSize={18} />
        </Button>
      </Tooltip>
      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Send Message In Breakout</ModalHeader>
          <div className="p-4">
            <Textarea
              size="sm"
              variant="bordered"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Broadcast message"
            />

            <div className="my-4">
              {connectedMeetings.map((meet) =>
                meet.id ? (
                  <Checkbox
                    className="mr-4 mb-4"
                    checked={sendingMessageToRooms.includes(meet.id)}
                    onChange={() =>
                      sendingMessageToRooms.includes(meet.id!)
                        ? setSendingMessageToRooms(
                            sendingMessageToRooms.filter(
                              (meetingId) => meetingId !== meet.id
                            )
                          )
                        : setSendingMessageToRooms([
                            ...sendingMessageToRooms,
                            meet.id!,
                          ])
                    }>
                    {meetingTitles?.find((m) => m.id === meet.id)?.title}
                  </Checkbox>
                ) : null
              )}
            </div>
          </div>
          <ModalFooter>
            <Button onClick={() => setIsMessageModalOpen(false)}>Cancel</Button>
            <Button disabled={!message} onClick={() => onMessageSend()}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
