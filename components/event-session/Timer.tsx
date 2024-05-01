import React, { useContext, useEffect, useState, useCallback } from 'react'

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
import { cn, zeroPad } from '@/utils/utils'

interface TimerProps {
  collapsePopoverContent: () => void
  // setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>
  dismissPopover: () => void // Add dismissPopover function
}

export function Timer({
  collapsePopoverContent,
  // setIsPopoverOpen,
  dismissPopover,
}: TimerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [remainingDuration, setRemainingDuration] = useState(5 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const { realtimeChannel } = useContext(
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

  const toggleTimer = useCallback(() => {
    setIsTimerRunning((prevState) => !prevState) // Toggle timer state directly
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timer

    if (isTimerRunning) {
      timer = setInterval(() => {
        setRemainingDuration((time) => {
          if (time <= 0) {
            setIsTimerRunning(false)
            setIsOpen(false) // Hide the popover when timer reaches 0

            return 0
          }

          return time - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [isTimerRunning])

  // Function to handle timer toggle
  const onTimerToggle = () => {
    if (isTimerRunning) {
      realtimeChannel.send({
        type: 'broadcast',
        event: 'timer-stop-event',
        payload: { remainingDuration },
      })
    } else {
      realtimeChannel.send({
        type: 'broadcast',
        event: 'timer-start-event',
        payload: { remainingDuration },
      })
    }
  }
  const handleButtonClick = () => {
    onTimerToggle()
    toggleTimer()
  }

  const handleTimerButtonClick = () => {
    collapsePopoverContent()
  }

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter' || event.key === ' ') {
      dismissPopover()
    }
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      classNames={{ content: 'p-0' }}
      placement="top"
      offset={15}
      backdrop="blur">
      <PopoverTrigger>
        <Button
          className={cn(
            'flex flex-col items-center gap-[5px] p-1 w-[84px] rounded-sm hover:bg-[#1E1E1E] text-white',
            'focus:outline-none focus:ring-0'
          )}
          type="button"
          disableRipple
          style={{
            backgroundColor:
              'var(--dyte-controlbar-button-background-color, rgb(var(--dyte-colors-background-1000, 8 8 8)))',
          }}
          onClick={handleTimerButtonClick}>
          {isTimerRunning ? (
            <h2 className="text-md font-extrabold px-2">
              <span>{zeroPad(Math.floor(remainingDuration / 60), 2)}</span> :{' '}
              {zeroPad(remainingDuration % 60, 2)}
            </h2>
          ) : (
            <MdOutlineWatchLater className="text-2xl" />
          )}
        </Button>
      </PopoverTrigger>
      {/* Popover content */}
      <PopoverContent className="rounded-lg p-4 overflow-hidden">
        {/* Dismiss icon */}
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => {
            setIsOpen(false)
            // setIsPopoverOpen(false)
            dismissPopover()
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Close">
          <MdClose size={20} />
        </div>
        {/* Timer controls */}
        <div className="p-4 flex items-center">
          <div className="flex justify-between items-center">
            <Button
              isIconOnly
              radius="full"
              disabled={isTimerRunning}
              onClick={() => {
                if (remainingDuration > 15) {
                  setRemainingDuration((d) => d - 15)
                }
              }}>
              <MdRemove />
            </Button>

            <h2 className="m-2 text-md font-extrabold px-2 text-gray-600">
              <span className="text-4xl">
                {zeroPad(Math.floor(remainingDuration / 60), 2)}
              </span>{' '}
              : {zeroPad(remainingDuration % 60, 2)}
            </h2>
            <Button
              isIconOnly
              radius="full"
              disabled={isTimerRunning}
              onClick={() => setRemainingDuration((d) => d + 15)}>
              <MdAdd />
            </Button>
          </div>
        </div>
        {/* Timer reset and toggle buttons */}
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
            onClick={handleButtonClick}
            className="ml-4">
            {!isTimerRunning ? (
              <MdOutlinePlayArrow size={32} fill="white" />
            ) : (
              <MdOutlinePause size={32} fill="white" />
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
