import { useEffect } from 'react'

import { useParams } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'

import { useEventPermissions } from './useEventPermissions'

import { useStoreSelector } from '@/hooks/useRedux'
import {
  setDurationAction,
  setTimerStateAction,
  setUpdateTimerOnParticipantJoinAction,
} from '@/stores/slices/event/current-event/timers.slice'
import { supabaseClient } from '@/utils/supabase/client'

export function useTimer() {
  const dispatch = useDispatch()
  const { permissions, isLoading: isLoadingPermissions } = useEventPermissions()
  const { eventId } = useParams({ strict: false })

  const isHost = permissions.canAcessAllSessionControls
  const isTimerRunning =
    useStoreSelector(
      (state) => state.event.currentEvent.liveTimer.timerState
    ) === 'running'
  const duration = useStoreSelector(
    (state) => state.event.currentEvent.liveTimer.duration
  )
  const updateTimerOnParticipantJoin = useStoreSelector(
    (state) => state.event.currentEvent.liveTimer.updateTimerOnParticipantJoin
  )

  const realtimeChannel = supabaseClient.channel(`event:${eventId}`, {
    config: { broadcast: { self: true } },
  })

  useEffect(() => {
    if (!realtimeChannel) return

    realtimeChannel.on(
      'broadcast',
      { event: 'timer-start-event' },
      ({ payload }) => {
        dispatch(setTimerStateAction('running'))

        if (payload.duration) {
          dispatch(setDurationAction(payload.duration))
        }
      }
    )

    realtimeChannel.on('broadcast', { event: 'timer-pause-event' }, () => {
      if (!isTimerRunning) return

      dispatch(setTimerStateAction('paused'))
    })

    realtimeChannel.on('broadcast', { event: 'timer-close-event' }, () => {
      if (!isTimerRunning) return
      dispatch(setTimerStateAction('stopped'))
    })

    realtimeChannel.on(
      'broadcast',
      { event: 'timer-reset-event' },
      ({ payload }) => {
        dispatch(setDurationAction(payload.duration))
      }
    )

    realtimeChannel.on(
      'broadcast',
      { event: 'timer-update-event' },
      ({ payload }) => {
        dispatch(setDurationAction(payload.duration))
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, realtimeChannel])

  useEffect(() => {
    if (!realtimeChannel) return () => {}

    let timer: NodeJS.Timeout | undefined
    if (isTimerRunning) {
      timer = setInterval(() => {
        if (duration.remaining <= 0) {
          realtimeChannel.send({
            type: 'broadcast',
            event: 'time-out',
            payload: { duration },
          })
          dispatch(setTimerStateAction('stopped'))
        } else {
          dispatch(
            setDurationAction({
              ...duration,
              remaining: duration.remaining - 1,
            })
          )
          if (updateTimerOnParticipantJoin === true) {
            realtimeChannel?.send({
              type: 'broadcast',
              event: 'updateTimerOnParticipantJoin',
              payload: { duration },
            })
            dispatch(setUpdateTimerOnParticipantJoinAction(false))
          }
        }
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, realtimeChannel, duration, updateTimerOnParticipantJoin])
  if (isLoadingPermissions) return
  if (isHost) return
  // TODO: Fix this
  realtimeChannel.on(
    'broadcast',
    { event: 'updateTimerOnParticipantJoin' },
    ({ payload }) => {
      if (isHost) return

      dispatch(setDurationAction(payload.duration))
      dispatch(setTimerStateAction('running'))
    }
  )
}
