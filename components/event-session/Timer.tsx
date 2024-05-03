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
  // useEffect(() => {
  //   // Event listeners for timer start and stop events
  //   if (!realtimeChannel) return
  //   realtimeChannel.on(
  //     'broadcast',
  //     { event: 'timer-start-event' },
  //     ({ payload }) => {
  //       setRemainingDuration(payload.remainingDuration)
  //       setIsTimerRunning(true)
  //     }
  //   )
  //   realtimeChannel.on(
  //     'broadcast',
  //     { event: 'timer-stop-event' },
  //     ({ payload }) => {
  //       setRemainingDuration(payload.remainingDuration)
  //       setIsTimerRunning(false)
  //     }
  //   )
  // }, [realtimeChannel])

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

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      classNames={{ content: 'p-0' }}
      placement="top"
      offset={15}>
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
      <PopoverContent className="rounded-lg p-4 overflow-hidden">
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={handleClosePopover}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Close">
          <MdClose size={20} />
        </div>
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
      </PopoverContent>
    </Popover>
  )
}
