import { useEffect, useState } from 'react'

import { useRealtimeChannel } from './useRealtimeChannel'

import { useEventContext } from '@/contexts/EventContext'

export const useSharedState = <State>({
  uniqueStateId,
  initialState,
  allowParticipantToUpdate = false,
}: {
  uniqueStateId: string
  initialState: State
  allowParticipantToUpdate?: boolean
}) => {
  const [state, setState] = useState<State>(initialState)
  const { isOwner } = useEventContext()
  const { realtimeChannel } = useRealtimeChannel()

  useEffect(() => {
    if (!realtimeChannel) return

    realtimeChannel.on(
      'broadcast',
      { event: `event-state-update-${uniqueStateId}` },
      ({ payload }) => {
        setState(payload)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeChannel])

  const updateState = (newState: State) => {
    if (!isOwner && !allowParticipantToUpdate) return

    realtimeChannel?.send({
      event: `event-state-update-${uniqueStateId}`,
      type: 'broadcast',
      payload: newState,
    })
  }

  return [state, updateState] as const
}
