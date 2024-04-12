import React, { useContext, useEffect, useState } from 'react'

import {
  MdAdd,
  MdOutlinePause,
  MdOutlinePlayArrow,
  MdOutlineReplay,
  MdOutlineWatchLater,
  MdRemove,
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

export function Timer() {
  const [isOpen, setIsOpen] = useState(false)
  const [remainingDuration, setRemainingDuration] = useState(5 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
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
        setIsTimerRunning(false)
      }
    )
  }, [realtimeChannel])

  useEffect(() => {
    let timer: NodeJS.Timer
    if (isTimerRunning) {
      timer = setInterval(() => {
        setRemainingDuration((time) => {
          if (time === 1) {
            setIsTimerRunning(false)

            return 0
          }

          return time - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [isTimerRunning])

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

  if (!isHost && !isTimerRunning) {
    return null
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open && isHost)}
      classNames={{
        content: 'p-0',
      }}>
      <PopoverTrigger>
        <button
          type="button"
          className={cn(
            'flex flex-col items-center gap-[5px] p-1 w-[84px] rounded-sm hover:bg-[#1E1E1E] text-white'
          )}>
          {isTimerRunning ? (
            <>
              <h2 className="text-md font-extrabold px-2">
                <span>{zeroPad(Math.floor(remainingDuration / 60), 2)}</span> :{' '}
                {zeroPad(remainingDuration % 60, 2)}
              </h2>
              <p className="text-xs">Timer</p>
            </>
          ) : (
            <>
              <MdOutlineWatchLater className="text-2xl" />
              <p className="text-xs">Timer</p>
            </>
          )}
        </button>
      </PopoverTrigger>
      {isHost && (
        <PopoverContent className="rounded-lg p-4 overflow-hidden">
          <div className="p-4 flex items-center">
            <div className="flex justify-between items-center">
              <Button
                isIconOnly
                radius="full"
                disabled={isTimerRunning}
                onClick={() => setRemainingDuration((d) => d - 15)}>
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
              onClick={onTimerToggle}
              className="ml-4">
              {!isTimerRunning ? (
                <MdOutlinePlayArrow size={32} fill="white" />
              ) : (
                <MdOutlinePause size={32} fill="white" />
              )}
            </Button>
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}
