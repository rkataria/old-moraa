import { useContext, useEffect, useState, useCallback } from 'react'

import { Button } from '@nextui-org/react'
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoStopwatchOutline } from 'react-icons/io5'
import {
  MdAdd,
  MdRemove,
  MdOutlinePlayArrow,
  MdOutlinePause,
  MdOutlineReplay,
  MdClose,
} from 'react-icons/md'

import { RenderIf } from '../common/RenderIf/RenderIf'

import { ControlButton } from '@/components/common/ControlButton'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn, zeroPad } from '@/utils/utils'

const defaultDuration: Readonly<number> = 5 * 60

export function Timer() {
  const [isOpen, setIsOpen] = useState(false)
  const [remainingDuration, setRemainingDuration] = useState(5 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [position, setPosition] = useState({
    // x: window.innerWidth / 2 - 300,
    x: -250,
    y: 5,
  }) // Adjusted default position

  const { realtimeChannel, isHost } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  useEffect(() => {
    if (!realtimeChannel) return

    realtimeChannel.on(
      'broadcast',
      { event: 'timer-start-event' },
      ({ payload }) => {
        setRemainingDuration(payload.remainingDuration)
        setIsTimerRunning(true)
      }
    )

    realtimeChannel.on(
      'broadcast',
      { event: 'timer-stop-event' },
      ({ payload }) => {
        setRemainingDuration(payload.remainingDuration)
        if (!payload.keepTimerOpen) setIsOpen(false)
        setIsTimerRunning(false)
      }
    )

    realtimeChannel.on(
      'broadcast',
      { event: 'timer-reset-event' },
      ({ payload }) => {
        setRemainingDuration(payload.remainingDuration)
        setIsTimerRunning(false)
      }
    )

    realtimeChannel.on(
      'broadcast',
      { event: 'timer-update-event' },
      ({ payload }) => {
        setRemainingDuration(payload.remainingDuration)
      }
    )

    if (!isHost) {
      realtimeChannel?.send({
        type: 'broadcast',
        event: 'join-event',
      })
    }
  }, [realtimeChannel, isHost])

  useEffect(() => {
    if (!realtimeChannel) return

    realtimeChannel.on('broadcast', { event: 'join-event' }, () => {
      if (isHost) {
        realtimeChannel?.send({
          type: 'broadcast',
          event: isTimerRunning ? 'timer-start-event' : 'timer-stop-event',
          payload: { remainingDuration },
        })
      }
    })
  }, [realtimeChannel, isHost, isTimerRunning, remainingDuration, isOpen])

  useEffect(() => {
    if (!realtimeChannel) return () => {}

    let timer: NodeJS.Timeout | undefined
    if (isTimerRunning) {
      timer = setInterval(() => {
        setRemainingDuration((time) => {
          if (time <= 0) {
            if (timer) clearInterval(timer)
            setIsTimerRunning(false)
            setIsOpen(false)
            realtimeChannel?.send({
              type: 'broadcast',
              event: 'timer-stop-event',
              payload: { remainingDuration: defaultDuration },
            })

            return 0
          }

          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isTimerRunning, realtimeChannel])

  const handleTimerToggle = useCallback(() => {
    if (isTimerRunning) {
      realtimeChannel?.send({
        type: 'broadcast',
        event: 'timer-stop-event',
        payload: { remainingDuration, keepTimerOpen: true },
      })
    } else {
      realtimeChannel?.send({
        type: 'broadcast',
        event: 'timer-start-event',
        payload: { remainingDuration },
      })
    }
  }, [isTimerRunning, remainingDuration, realtimeChannel])

  const handleClosePopover = () => {
    setIsOpen(false)
  }

  const handleTimerButtonClick = () => {
    if (!isHost) return
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClosePopover()
    }
  }

  const setRemainingDurationAndUpdate = (newDuration: number) => {
    realtimeChannel?.send({
      type: 'broadcast',
      event: 'timer-update-event',
      payload: { remainingDuration: newDuration },
    })
    setRemainingDuration(newDuration)
  }

  const handleResetTimer = () => {
    setRemainingDuration(defaultDuration)
    setIsTimerRunning(false)
    realtimeChannel?.send({
      type: 'broadcast',
      event: 'timer-reset-event',
      payload: { remainingDuration: defaultDuration },
    })
  }

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y })
  }

  useHotkeys('t', handleTimerButtonClick, [isHost, isOpen])

  return (
    <>
      <RenderIf isTrue={!isHost && isTimerRunning}>
        <TimerViewElement time={remainingDuration} size="sm" />
      </RenderIf>
      <RenderIf isTrue={isHost}>
        <ControlButton
          buttonProps={{
            isIconOnly: !isTimerRunning,
            radius: 'md',
            size: 'sm',
            variant: 'flat',
            className: cn(
              'transition-all duration-300 bg-[#F3F4F6] text-[#444444]'
            ),
          }}
          tooltipProps={{
            content: isTimerRunning ? 'Time Remaining' : 'Launch Timer',
          }}
          onClick={handleTimerButtonClick}>
          {isTimerRunning ? (
            <TimerViewElement time={remainingDuration} size="sm" />
          ) : (
            <IoStopwatchOutline size={22} />
          )}
        </ControlButton>
      </RenderIf>
      {isOpen && (
        <Draggable
          position={position}
          onDrag={handleDrag}
          defaultClassName="cursor-move">
          <div className="fixed z-[10] right-4 top-8 rounded-lg p-4 overflow-hidden w-[300px] bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-100">
            <div
              className={`absolute top-2 right-2 ${
                isHost ? 'cursor-pointer' : 'hidden'
              }`}
              onClick={() => isHost && handleClosePopover()}
              onKeyDown={(event) => isHost && handleKeyDown(event)}
              tabIndex={isHost ? 0 : -1}
              role="button"
              aria-label="Close">
              <MdClose size={20} />
            </div>
            <div className="p-4 flex items-center justify-center">
              <div className="flex justify-between items-center">
                {!isHost && (
                  <h2 className="m-1 font-normal px-1 text-gray-600">
                    <span className="text-lg inline-block text-center w-[full]">
                      Time Left
                    </span>
                  </h2>
                )}
                {isHost && (
                  <Button
                    isIconOnly
                    radius="full"
                    onClick={() =>
                      remainingDuration > 15 &&
                      setRemainingDurationAndUpdate(remainingDuration - 15)
                    }>
                    <MdRemove />
                  </Button>
                )}
                <TimerViewElement time={remainingDuration} />
                {isHost && (
                  <Button
                    isIconOnly
                    radius="full"
                    onClick={() =>
                      setRemainingDurationAndUpdate(remainingDuration + 15)
                    }
                    className={!isHost ? 'cursor-not-allowed' : ''}>
                    <MdAdd />
                  </Button>
                )}
              </div>
            </div>
            {isHost && (
              <div className="flex items-center justify-center">
                <Button
                  isIconOnly
                  size="sm"
                  radius="full"
                  color="secondary"
                  className="mr-4"
                  onClick={handleResetTimer}>
                  <MdOutlineReplay size={18} fill="gray" />
                </Button>
                <Button
                  isIconOnly
                  size="lg"
                  radius="full"
                  color="primary"
                  onClick={handleTimerToggle}
                  className="ml-4">
                  {!isTimerRunning ? (
                    <MdOutlinePlayArrow size={32} fill="white" />
                  ) : (
                    <MdOutlinePause size={32} fill="white" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </Draggable>
      )}
    </>
  )
}

function TimerViewElement({
  time,
  size = 'lg',
}: {
  time: number
  size?: 'sm' | 'lg'
}) {
  return (
    <h2 className="m-2 text-md font-extrabold px-2 text-gray-600">
      <span
        className={cn('inline-block text-center w-[48px] text-white-border', {
          'text-4xl': size === 'lg',
          'text-2xl': size === 'sm',
        })}>
        {zeroPad(Math.floor(time / 60), 2)}
      </span>
      :
      <span className="w-[16px] inline-block text-center text-white-border">
        {zeroPad(time % 60, 2)}
      </span>
    </h2>
  )
}
