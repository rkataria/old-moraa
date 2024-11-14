import { useContext, useState } from 'react'

import {
  Button,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { ControlButton } from '../common/ControlButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { EventSessionContextType } from '@/types/event-session.type'
import { getCurrentTimestamp, getRemainingTimestamp } from '@/utils/timer.utils'

export function TimerToggle() {
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType
  const [timerDuration, setTimerDuration] = useState(3)
  const [openTimerModal, setOpenTimerModal] = useState(false)

  const dispatch = useStoreDispatch()

  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data!
  )
  const isBreakoutActive = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.breakout.isBreakoutActive
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

    setOpenTimerModal(true)
  }

  useHotkeys('t', handleTimerToggle, { enabled: isHost })

  if (!isHost) return null

  if (isBreakoutActive) return null

  return (
    <>
      <ControlButton
        hideTooltip
        buttonProps={{
          size: 'md',
          variant: 'light',
          className: cn('gap-4 w-fit justify-between pr-2', {
            'bg-red-300': timerActive,
            'bg-transparent': !timerActive,
          }),
        }}
        onClick={handleTimerToggle}>
        <span className="flex items-center gap-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 3H9V1H15V3ZM11 14H13V8H11V14ZM19 13C19.7 13 20.36 13.13 21 13.35V13C21 10.88 20.26 8.93 19.03 7.39L20.45 5.97C20 5.46 19.55 5 19.04 4.56L17.62 6C16.07 4.74 14.12 4 12 4C9.61305 4 7.32387 4.94821 5.63604 6.63604C3.94821 8.32387 3 10.6131 3 13C3 15.3869 3.94821 17.6761 5.63604 19.364C7.32387 21.0518 9.61305 22 12 22C12.59 22 13.16 21.94 13.71 21.83C13.4 21.25 13.18 20.6 13.08 19.91C12.72 19.96 12.37 20 12 20C8.13 20 5 16.87 5 13C5 9.13 8.13 6 12 6C15.87 6 19 9.13 19 13ZM17 16V22L22 19L17 16Z"
              fill="#4B5563"
            />
          </svg>
          {timerActive ? 'Stop' : 'Start'} timer
        </span>
      </ControlButton>
      <Modal
        size="sm"
        isOpen={openTimerModal}
        onClose={() => setOpenTimerModal(false)}>
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
                    setOpenTimerModal(false)
                    startTimer()
                  }}>
                  Start
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
