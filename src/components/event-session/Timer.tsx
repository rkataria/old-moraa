import { useContext, useState, useCallback } from 'react'

import { Button } from '@nextui-org/button'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoIosRemove } from 'react-icons/io'
import { IoAdd, IoClose } from 'react-icons/io5'
import { LuTimerReset } from 'react-icons/lu'

import { RenderIf } from '../common/RenderIf/RenderIf'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn, zeroPad } from '@/utils/utils'

export const defaultDuration: Readonly<number> = 5 * 60

export function Timer() {
  const [isOpen, setIsOpen] = useState(false)

  const timerState = useStoreSelector(
    (state) => state.event.currentEvent.liveTimer.timerState
  )

  const duration = useStoreSelector(
    (state) => state.event.currentEvent.liveTimer.duration
  )

  const { realtimeChannel, isHost } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const handleTimerToggle = useCallback(() => {
    if (timerState === 'running') {
      realtimeChannel?.send({
        type: 'broadcast',
        event: 'timer-pause-event',
        payload: {},
      })
    } else {
      realtimeChannel?.send({
        type: 'broadcast',
        event: 'timer-start-event',
        payload: {},
      })
    }
  }, [timerState, realtimeChannel])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTimerButtonClick = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return

    if (!isHost) return
    setIsOpen(!isOpen)
  }

  const setRemainingDurationAndUpdate = (newDuration: number) => {
    realtimeChannel?.send({
      type: 'broadcast',
      event: 'timer-update-event',
      payload: { duration: { total: newDuration, remaining: newDuration } },
    })
  }

  const closeTimer = () => {
    realtimeChannel?.send({
      type: 'broadcast',
      event: 'timer-close-event',
      payload: {},
    })
  }

  const handleResetTimer = () => {
    realtimeChannel?.send({
      type: 'broadcast',
      event: 'timer-reset-event',
      payload: { duration: { ...duration, remaining: duration.total } },
    })
  }

  useHotkeys('t', handleTimerButtonClick, [isHost, isOpen])

  const btnClass =
    'w-6 h-6 min-w-[auto] text-gray-500 hover:text-gray-900 relative shrink-0'

  if (timerState === 'stopped') return null
  if (timerState === 'paused' && !isHost) return null

  return (
    <div className="relative bg-gray-300 flex items-center px-2 gap-1 w-fit rounded-xl overflow-hidden">
      <div
        style={{ width: `${(duration.remaining / duration.total) * 100}%` }}
        className={cn(
          'absolute w-full left-0 top-0 h-full bg-primary-200 duration-300',
          {
            'bg-red-400': duration.remaining < 15,
          }
        )}
      />
      <RenderIf isTrue={isHost}>
        <Button
          variant="light"
          isIconOnly
          size="sm"
          className={btnClass}
          onClick={handleResetTimer}>
          <LuTimerReset size={20} />
        </Button>
      </RenderIf>
      <RenderIf isTrue={isHost}>
        <Button
          variant="light"
          isIconOnly
          size="sm"
          className={btnClass}
          onClick={() =>
            duration.remaining > 15 &&
            setRemainingDurationAndUpdate(duration.remaining - 15)
          }>
          <IoIosRemove size={20} />
        </Button>
      </RenderIf>

      <TimerViewElement time={duration.remaining} size="sm" />
      <RenderIf isTrue={isHost}>
        <Button
          variant="light"
          isIconOnly
          size="sm"
          className={btnClass}
          onClick={() =>
            setRemainingDurationAndUpdate(duration.remaining + 15)
          }>
          <IoAdd size={20} />
        </Button>
      </RenderIf>
      <RenderIf isTrue={isHost}>
        <Button
          variant="light"
          isIconOnly
          size="sm"
          className={btnClass}
          onClick={handleTimerToggle}>
          <RenderIf isTrue={timerState === 'paused'}>
            <svg
              width="18"
              height="21"
              viewBox="0 0 18 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 2V0H12V2H6ZM9 21C7.76667 21 6.604 20.7627 5.512 20.288C4.42 19.8133 3.466 19.1673 2.65 18.35C1.834 17.5327 1.18833 16.5783 0.713 15.487C0.237667 14.3957 0 13.2333 0 12C0 10.7667 0.237667 9.604 0.713 8.512C1.18833 7.42 1.834 6.466 2.65 5.65C3.466 4.834 4.42033 4.18833 5.513 3.713C6.60567 3.23767 7.768 3 9 3C10.0333 3 11.025 3.16667 11.975 3.5C12.925 3.83333 13.8167 4.31667 14.65 4.95L16.05 3.55L17.45 4.95L16.05 6.35C16.6833 7.18333 17.1667 8.075 17.5 9.025C17.8333 9.975 18 10.9667 18 12C18 13.2333 17.7623 14.396 17.287 15.488C16.8117 16.58 16.166 17.534 15.35 18.35C14.534 19.166 13.5797 19.812 12.487 20.288C11.3943 20.764 10.232 21.0013 9 21ZM9 19C10.9333 19 12.5833 18.3167 13.95 16.95C15.3167 15.5833 16 13.9333 16 12C16 10.0667 15.3167 8.41667 13.95 7.05C12.5833 5.68333 10.9333 5 9 5C7.06667 5 5.41667 5.68333 4.05 7.05C2.68333 8.41667 2 10.0667 2 12C2 13.9333 2.68333 15.5833 4.05 16.95C5.41667 18.3167 7.06667 19 9 19ZM7 16L13 12L7 8V16Z"
                className="fill-gray-500 hover:fill-gray-900"
              />
            </svg>
          </RenderIf>
          <RenderIf isTrue={timerState === 'running'}>
            <svg
              width="18"
              height="21"
              viewBox="0 0 18 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7 16C7.28333 16 7.521 15.904 7.713 15.712C7.905 15.52 8.00067 15.2827 8 15V9C8 8.71667 7.904 8.47933 7.712 8.288C7.52 8.09667 7.28267 8.00067 7 8C6.71733 7.99933 6.48 8.09533 6.288 8.288C6.096 8.48067 6 8.718 6 9V15C6 15.2833 6.096 15.521 6.288 15.713C6.48 15.905 6.71733 16.0007 7 16ZM11 16C11.2833 16 11.521 15.904 11.713 15.712C11.905 15.52 12.0007 15.2827 12 15V9C12 8.71667 11.904 8.47933 11.712 8.288C11.52 8.09667 11.2827 8.00067 11 8C10.7173 7.99933 10.48 8.09533 10.288 8.288C10.096 8.48067 10 8.718 10 9V15C10 15.2833 10.096 15.521 10.288 15.713C10.48 15.905 10.7173 16.0007 11 16ZM7 2C6.71667 2 6.47933 1.904 6.288 1.712C6.09667 1.52 6.00067 1.28267 6 1C5.99933 0.717333 6.09533 0.48 6.288 0.288C6.48067 0.096 6.718 0 7 0H11C11.2833 0 11.521 0.096 11.713 0.288C11.905 0.48 12.0007 0.717333 12 1C11.9993 1.28267 11.9033 1.52033 11.712 1.713C11.5207 1.90567 11.2833 2.00133 11 2H7ZM9 21C7.76667 21 6.604 20.7627 5.512 20.288C4.42 19.8133 3.466 19.1673 2.65 18.35C1.834 17.5327 1.18833 16.5783 0.713 15.487C0.237667 14.3957 0 13.2333 0 12C0 10.7667 0.237667 9.604 0.713 8.512C1.18833 7.42 1.834 6.466 2.65 5.65C3.466 4.834 4.42033 4.18833 5.513 3.713C6.60567 3.23767 7.768 3 9 3C10.0333 3 11.025 3.16667 11.975 3.5C12.925 3.83333 13.8167 4.31667 14.65 4.95L15.35 4.25C15.5333 4.06667 15.7667 3.975 16.05 3.975C16.3333 3.975 16.5667 4.06667 16.75 4.25C16.9333 4.43333 17.025 4.66667 17.025 4.95C17.025 5.23333 16.9333 5.46667 16.75 5.65L16.05 6.35C16.6833 7.18333 17.1667 8.075 17.5 9.025C17.8333 9.975 18 10.9667 18 12C18 13.2333 17.7623 14.396 17.287 15.488C16.8117 16.58 16.166 17.534 15.35 18.35C14.534 19.166 13.5797 19.812 12.487 20.288C11.3943 20.764 10.232 21.0013 9 21ZM9 19C10.9333 19 12.5833 18.3167 13.95 16.95C15.3167 15.5833 16 13.9333 16 12C16 10.0667 15.3167 8.41667 13.95 7.05C12.5833 5.68333 10.9333 5 9 5C7.06667 5 5.41667 5.68333 4.05 7.05C2.68333 8.41667 2 10.0667 2 12C2 13.9333 2.68333 15.5833 4.05 16.95C5.41667 18.3167 7.06667 19 9 19Z"
                className="fill-gray-500 hover:fill-gray-900"
              />
            </svg>
          </RenderIf>
        </Button>
        <RenderIf isTrue={isHost}>
          <Button
            variant="light"
            isIconOnly
            size="sm"
            className={btnClass}
            onClick={closeTimer}>
            <IoClose size={20} />
          </Button>
        </RenderIf>
      </RenderIf>
    </div>
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
    <h2 className="flex items-baseline text-md font-extrabold text-gray-700 mx-2 relative">
      <span
        className={cn('inline-block text-center w-fit text-white-border', {
          'text-4xl': size === 'lg',
          'text-2xl': size === 'sm',
        })}>
        {zeroPad(Math.floor(time / 60), 2)}
      </span>
      :
      <span className="inline-block text-center text-white-border">
        {zeroPad(time % 60, 2)}s
      </span>
    </h2>
  )
}
