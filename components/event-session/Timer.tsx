import React, { useContext, useEffect, useState, useCallback } from 'react'

import Draggable from 'react-draggable'
import {
  MdOutlineWatchLater,
  MdAdd,
  MdRemove,
  MdOutlinePlayArrow,
  MdOutlinePause,
  MdOutlineReplay,
  MdClose,
} from 'react-icons/md'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { zeroPad } from '@/utils/utils'

interface TimerProps {
  collapsePopoverContent: () => void
  dismissPopover: () => void
}

export function Timer({ collapsePopoverContent, dismissPopover }: TimerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [remainingDuration, setRemainingDuration] = useState(5 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const { realtimeChannel, isHost } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  // useEffect hooks to handle realtime channel events
  useEffect(() => {
    // Event listeners for timer start and stop events
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
        setIsTimerRunning(false)
      }
    )
  }, [realtimeChannel])

  useEffect(() => {
    realtimeChannel.on(
      'broadcast',
      { event: 'timer-start-event' },
      ({ payload }) => {
        setRemainingDuration(payload.remainingDuration)
        setIsTimerRunning(true)
        setIsOpen(true)
      }
    )

    realtimeChannel.on(
      'broadcast',
      { event: 'timer-stop-event' },
      ({ payload }) => {
        setRemainingDuration(payload.remainingDuration)
        setIsTimerRunning(false)
      }
    )

    realtimeChannel.on('broadcast', { event: 'timer-close-event' }, () => {
      setIsOpen(false) // Close the popover in response to the close event
    })
    realtimeChannel.on(
      'broadcast',
      { event: 'timer-update-event' },
      ({ payload }) => {
        // Update remaining duration when received from host
        setRemainingDuration(payload.remainingDuration)
      }
    )
  }, [realtimeChannel])

  useEffect(() => {
    let timer: NodeJS.Timer
    if (isTimerRunning) {
      timer = setInterval(() => {
        setRemainingDuration((time) => {
          if (time <= 0) {
            clearInterval(timer)
            setIsTimerRunning(false)
            setIsOpen(false)

            return 0
          }

          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isTimerRunning])

  const handleTimerToggle = useCallback(() => {
    if (isTimerRunning) {
      realtimeChannel.send({
        type: 'broadcast',
        event: 'timer-stop-event',
        payload: { remainingDuration },
      })
      setIsTimerRunning(false)
    } else {
      realtimeChannel.send({
        type: 'broadcast',
        event: 'timer-start-event',
        payload: { remainingDuration },
      })
      setIsTimerRunning(true)
      setIsOpen(true)
    }
  }, [isTimerRunning, remainingDuration, realtimeChannel])

  const handleClosePopover = () => {
    setIsOpen(false)
    dismissPopover()
    if (isHost) {
      // Only broadcast close if the user is the host
      realtimeChannel.send({
        type: 'broadcast',
        event: 'timer-close-event',
      })
    }
  }

  const handleTimerButtonClick = () => {
    collapsePopoverContent()
  }

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClosePopover()
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) return
    setIsOpen(open)
  }

  const setRemainingDurationAndUpdate = (newDuration: number) => {
    // Send the updated duration to the server
    realtimeChannel.send({
      type: 'broadcast',
      event: 'timer-update-event',
      payload: { remainingDuration: newDuration },
    })
    // Update the remaining duration locally
    setRemainingDuration(newDuration)
  }

  return (
    <Draggable>
      <Popover
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        classNames={{ content: 'p-0' }}
        placement="top"
        offset={15}
        className="fixed top-0 left-[5%] translate-x-[200%] cursor-move w-[300px]">
        <PopoverTrigger>
          <Button
            className="w-[120px] h-[50px] flex items-center justify-center gap-2 p-1 rounded-sm hover:bg-[#1E1E1E] text-white focus:outline-none focus:ring-0"
            type="button"
            disableRipple
            style={{
              backgroundColor:
                'var(--dyte-controlbar-button-background-color, rgb(var(--dyte-colors-background-1000, 8 8 8)))',
            }}
            onClick={handleTimerButtonClick}>
            <div className="w-[100%] h-[100%] flex items-center justify-center">
              {isTimerRunning ? (
                <div className="text-md font-extrabold flex justify-center items-center">
                  <span className="w-[16px] inline-block text-center">
                    {zeroPad(Math.floor(remainingDuration / 60), 2)}
                  </span>
                  :
                  <span className="w-[8px] inline-block text-center">
                    {zeroPad(remainingDuration % 60, 2)}
                  </span>
                </div>
              ) : (
                <MdOutlineWatchLater className="text-2xl" />
              )}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="rounded-lg p-4 overflow-hidden w-[300px]">
          <div
            className={`absolute top-2 right-2 cursor-pointer ${!isHost ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => isHost && handleClosePopover()} // Only handle click if isHost is true
            onKeyDown={(event) => isHost && handleKeyDown(event)} // Only handle key down if isHost is true
            tabIndex={isHost ? 0 : -1} // Disable tab navigation for non-hosts
            role="button"
            aria-label="Close"
            style={{ pointerEvents: isHost ? 'auto' : 'none' }} // Disallow pointer events if not host account
          >
            <MdClose size={20} />
          </div>
          <div className="p-4 flex items-center">
            <div className="flex justify-between items-center">
              {/* Inside the Button component for decreasing timer duration */}
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
                  onClick={() => {
                    if (remainingDuration > 15) {
                      setRemainingDurationAndUpdate(remainingDuration - 15) // Update duration and broadcast the change
                    }
                  }}>
                  <MdRemove />
                </Button>
              )}
              <h2 className="m-2 text-md font-extrabold px-2 text-gray-600">
                <span className="text-4xl inline-block text-center w-[48px]">
                  {zeroPad(Math.floor(remainingDuration / 60), 2)}
                </span>{' '}
                :
                <span className="w-[16px] inline-block text-center">
                  {zeroPad(remainingDuration % 60, 2)}
                </span>
              </h2>
              {/* Inside the Button component for increasing timer duration */}
              {isHost && (
                <Button
                  isIconOnly
                  radius="full"
                  onClick={() => {
                    setRemainingDurationAndUpdate(remainingDuration + 15) // Update duration and broadcast the change
                  }}
                  className={!isHost ? 'cursor-not-allowed' : ''}>
                  <MdAdd />
                </Button>
              )}
            </div>
          </div>
          {isHost && (
            <div className="flex items-center">
              <Button
                isIconOnly
                size="sm"
                radius="full"
                color="secondary"
                className="mr-4"
                onClick={() => {
                  setIsTimerRunning(false)
                  setRemainingDuration(5 * 60)
                }}>
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
                  <MdOutlinePause size="{32}" fill="white" />
                )}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </Draggable>
  )
}
