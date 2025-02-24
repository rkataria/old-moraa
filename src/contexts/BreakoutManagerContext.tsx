import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import { useRealtimeChannel } from './RealtimeChannelContext'

import {
  notificationDuration,
  hideBreakoutTimerDialog,
  showBreakoutTimerDialog,
} from '@/utils/breakout.utils'
import { BreakoutRooms } from '@/utils/dyte-breakout'

// eslint-disable-next-line no-spaced-func
const BreakoutManagerContext = React.createContext<{
  breakoutRoomsInstance: BreakoutRooms | null
  // eslint-disable-next-line prettier/prettier, func-call-spacing
  handleBreakoutEndWithTimerDialog: (params?: {
    onBreakoutEndTriggered?: () => void
  }) => void
}>({
  breakoutRoomsInstance: null,
  handleBreakoutEndWithTimerDialog: () => {},
})

export function BreakoutManagerContextProvider({
  children,
}: PropsWithChildren<unknown>) {
  const [breakoutRoomsInstance, setBreakoutRoomsInstance] =
    useState<BreakoutRooms | null>(null)
  const { meeting } = useDyteMeeting()
  const { eventRealtimeChannel } = useRealtimeChannel()

  const initiateBreakoutInstance = useCallback(() => {
    if (!meeting) return
    const _breakoutRoomsInstance = new BreakoutRooms(meeting)
    setBreakoutRoomsInstance(_breakoutRoomsInstance)
  }, [meeting])

  const handleBreakoutEndWithTimerDialog = useCallback(
    ({
      onBreakoutEndTriggered,
    }: { onBreakoutEndTriggered?: () => void } = {}) => {
      if (!eventRealtimeChannel) {
        breakoutRoomsInstance?.endBreakoutRooms()

        return
      }
      showBreakoutTimerDialog(eventRealtimeChannel)
      setTimeout(() => {
        hideBreakoutTimerDialog(eventRealtimeChannel)
        breakoutRoomsInstance?.endBreakoutRooms()
        onBreakoutEndTriggered?.()
      }, notificationDuration * 1000)
    },
    [eventRealtimeChannel, breakoutRoomsInstance]
  )

  useEffect(() => {
    initiateBreakoutInstance()
  }, [initiateBreakoutInstance])

  const breakoutManagerInstanceMemo = useMemo(
    () => ({ breakoutRoomsInstance, handleBreakoutEndWithTimerDialog }),
    [breakoutRoomsInstance, handleBreakoutEndWithTimerDialog]
  )

  return (
    <BreakoutManagerContext.Provider value={breakoutManagerInstanceMemo}>
      {children}
    </BreakoutManagerContext.Provider>
  )
}

export const useBreakoutManagerContext = () =>
  React.useContext(BreakoutManagerContext)
