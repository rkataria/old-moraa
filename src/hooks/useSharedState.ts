import { useCallback, useEffect, useState } from 'react'

import { RealtimePostgresChangesPayload } from '@supabase/realtime-js'
import { useQuery } from '@tanstack/react-query'

import { useRealtimeChannel } from './useRealtimeChannel'

import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { SessionService } from '@/services/session.service'
import { supabaseClient } from '@/utils/supabase/client'

export const useSharedState = <State>({
  initialState,
  allowParticipantToUpdate = false,
}: {
  initialState?: State
  allowParticipantToUpdate?: boolean
} = {}) => {
  const [state, setState] = useState<State>(initialState as State)
  const { isHost } = useEventSession()
  const { meeting } = useEventContext()
  const { realtimeChannel } = useRealtimeChannel()
  const activeSessionQuery = useQuery({
    queryKey: ['ACTIVE_SESSION', meeting?.id],
    queryFn: () =>
      SessionService.getActiveSession({
        meetingId: meeting?.id,
        status: 'LIVE',
      }),
    enabled: !!meeting?.id,
  })

  useEffect(() => {
    if (
      meeting?.id &&
      activeSessionQuery.isSuccess &&
      activeSessionQuery.data?.error?.code === 'PGRST116'
    ) {
      SessionService.createSession({
        meetingId: meeting?.id,
        status: 'LIVE',
        defaultData: initialState,
      })
    } else if (activeSessionQuery.data?.data?.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setState(activeSessionQuery.data?.data?.data as any)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionQuery.isSuccess, activeSessionQuery.data, meeting?.id])

  const onDataChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload: RealtimePostgresChangesPayload<any>) => {
      if (payload.new?.data) {
        setState(payload.new.data)
      }
    },
    []
  )

  useEffect(() => {
    if (!realtimeChannel) return () => {}

    const changes = supabaseClient
      .channel('shared-state')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'session',
          filter: `meeting_id=eq.${meeting?.id}&status=eq.LIVE`,
        },
        onDataChange
      )
      .subscribe()

    return () => changes.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, realtimeChannel, meeting?.id])

  const updateState = useCallback(
    (newState: State) => {
      if (!isHost && !allowParticipantToUpdate) return

      if (activeSessionQuery.data?.data?.id) {
        SessionService.updateSession({
          sessionId: activeSessionQuery.data?.data?.id,
          sessionPayload: {
            data: newState,
          },
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSessionQuery.data?.data?.id]
  )

  return [state, updateState] as const
}
