/* eslint-disable consistent-return */
import { useEffect, useRef, useState } from 'react'

import toast from 'react-hot-toast'

import { CUSTOM_TOASTS } from '@/constants/custom-toasts'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { PresentationStatuses } from '@/types/event-session.type'
import { getPaddedDuration } from '@/utils/timer.utils'
import { cn } from '@/utils/utils'

export function FrameDuration() {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { presentationStatus } = useEventSession()
  const { currentFrame } = useEventContext()
  const durationInSeconds = (currentFrame?.config?.time ?? 1) * 60

  const [remainingDurationInSeconds, setRemainingDurationInSeconds] =
    useState(durationInSeconds)

  const isPresentationStarted =
    presentationStatus === PresentationStatuses.STARTED

  useEffect(() => {
    setRemainingDurationInSeconds(durationInSeconds)
  }, [durationInSeconds])

  useEffect(() => {
    if (isPresentationStarted) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      const interval = setInterval(() => {
        setRemainingDurationInSeconds((prev) => {
          if (prev === 0) {
            clearInterval(interval)

            // Notify
            toast.custom((t) => <CUSTOM_TOASTS.TIMER_ENDED t={t} />)

            return 0
          }

          return prev - 1
        })
      }, 1000)

      timerRef.current = interval

      return
    }
    // stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPresentationStarted])

  if (!currentFrame) return null

  return (
    <div
      className={cn(
        'text-lg font-light bg-gray-100 w-16 rounded-md flex justify-center items-center transition-all duration-300 font-outfit',
        {
          'bg-primary text-white':
            remainingDurationInSeconds > 120 && isPresentationStarted,
          'bg-orange-500 text-white':
            remainingDurationInSeconds <= 120 &&
            remainingDurationInSeconds > 60 &&
            isPresentationStarted,
          'bg-red-500 text-white':
            remainingDurationInSeconds <= 60 && isPresentationStarted,
        }
      )}>
      {getPaddedDuration(remainingDurationInSeconds)}
    </div>
  )
}
