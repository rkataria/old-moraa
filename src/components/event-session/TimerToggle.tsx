import { useContext } from 'react'

import { Kbd } from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { ControlButton } from '../common/ControlButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function TimerToggle() {
  const { isHost, realtimeChannel } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const remainingDuration = useStoreSelector(
    (state) => state.event.currentEvent.liveTimer.duration
  )

  const timerState = useStoreSelector(
    (state) => state.event.currentEvent.liveTimer.timerState
  )

  const handleTimerToggle = () => {
    if (!isHost) {
      return
    }
    if (timerState === 'running' || timerState === 'paused') {
      realtimeChannel?.send({
        type: 'broadcast',
        event: 'timer-close-event',
        payload: { remainingDuration },
      })

      return
    }
    realtimeChannel?.send({
      type: 'broadcast',
      event: 'timer-start-event',
      payload: {
        duration: {
          total: 30,
          remaining: 30,
        },
      },
    })
  }

  useHotkeys('t', handleTimerToggle)

  if (!isHost) return null

  return (
    <ControlButton
      hideTooltip
      buttonProps={{
        size: 'md',
        variant: 'light',
        className: cn('gap-4 w-full justify-between pr-2', {
          'bg-red-300': timerState === 'running',
          'bg-transparent': timerState !== 'running',
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
        {timerState === 'running' ? 'Stop' : 'Start'} timer
      </span>
      <Kbd className="shadow-none rounded-md">t</Kbd>
    </ControlButton>
  )
}
