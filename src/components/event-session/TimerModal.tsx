import { useContext, useState } from 'react'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { EventSessionContextType } from '@/types/event-session.type'
import { getCurrentTimestamp, getRemainingTimestamp } from '@/utils/timer.utils'
import { liveHotKeyProps } from '@/utils/utils'

export function TimerModal({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType
  const [timerDuration, setTimerDuration] = useState(3)

  const dispatch = useStoreDispatch()

  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data!
  )

  const timerActive =
    session?.data?.timerStartedStamp &&
    session.data.timerDuration &&
    getRemainingTimestamp(
      session.data.timerStartedStamp,
      session.data.timerDuration
    ) > 0

  const startTimer = () => {
    const currentTimeStamp = getCurrentTimestamp()

    dispatch(
      updateMeetingSessionDataAction({
        timerStartedStamp: currentTimeStamp,
        timerDuration: timerDuration * 60,
      })
    )
  }

  const closeTimer = () => {
    dispatch(
      updateMeetingSessionDataAction({
        timerStartedStamp: null,
      })
    )
  }
  const handleTimerToggle = () => {
    if (timerActive) {
      closeTimer()

      return
    }

    setOpen(true)
  }

  useHotkeys('t', handleTimerToggle, {
    ...liveHotKeyProps,
    enabled: isHost,
  })

  if (!isHost) return null

  return (
    <Modal size="sm" isOpen={open} onClose={() => setOpen(false)}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Set minutes</ModalHeader>
            <ModalBody>
              <div className="flex">
                <input
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  type="number"
                  defaultValue=""
                  className="text-[58px] mx-auto w-full text-center outline-none font-bold bg-transparent"
                  value={timerDuration}
                  // eslint-disable-next-line radix
                  onChange={(e) => setTimerDuration(parseInt(e.target.value))}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="light" size="sm" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                size="sm"
                onPress={() => {
                  setOpen(false)
                  startTimer()
                }}>
                Start
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
