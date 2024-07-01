'use client'

import {
  useCallback,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

import { BreakoutRoomsManager } from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { ConnectedMeetingState } from '@dytesdk/ui-kit/dist/types/types/props'

import {
  createAndAutoAssignBreakoutRooms,
  moveHostToRoom,
  stopBreakoutRooms,
} from '@/services/dyte/breakout-room-manager.service'

type BreakRoomManagerContextType = {
  breakoutRoomsManager: BreakoutRoomsManager
}

const BreakRoomManagerContext = createContext<
  BreakRoomManagerContextType | undefined
>(undefined)

// const breakoutRoomsManager = new BreakoutRoomsManager()

type BreakoutRoomsManagerProviderProps = {
  children: React.ReactNode
}

export function BreakoutRoomsManagerProvider({
  children,
}: BreakoutRoomsManagerProviderProps) {
  const [breakoutRoomsManager, setBreakoutRoomsManager] =
    useState<BreakoutRoomsManager>(new BreakoutRoomsManager())
  // const dyteMeetingSelector = useDyteSelector((m) => m)
  // const activeParticipants = useDyteSelector((m) =>
  //   m.participants.joined.toArray()
  // )

  useEffect(() => {
    if (!breakoutRoomsManager) {
      setBreakoutRoomsManager(new BreakoutRoomsManager())
    }
  }, [breakoutRoomsManager])

  const value = useMemo(
    () => ({ breakoutRoomsManager }),
    [breakoutRoomsManager]
  )

  return (
    <BreakRoomManagerContext.Provider value={value}>
      {children}
    </BreakRoomManagerContext.Provider>
  )
}

export function useBreakoutRoomsManager() {
  const context = useContext(BreakRoomManagerContext)
  if (context === undefined) {
    throw new Error(
      'useBreakoutRoomsManager must be used within a BreakRoomsManagerProvider'
    )
  }

  return context
}

export const useBreakoutRoomsManagerWithLatestMeetingState = () => {
  const { meeting: dyteMeeting } = useDyteMeeting()
  const { breakoutRoomsManager } = useBreakoutRoomsManager()

  const updateLocalState = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload: any) => {
      breakoutRoomsManager.updateCurrentState(payload as ConnectedMeetingState)
    },
    [breakoutRoomsManager]
  )

  const close = useCallback(() => {
    breakoutRoomsManager.discardChanges()
  }, [breakoutRoomsManager])

  useEffect(() => {
    dyteMeeting.connectedMeetings.on('stateUpdate', updateLocalState)
    dyteMeeting.connectedMeetings.on('changingMeeting', close)

    dyteMeeting.connectedMeetings.getConnectedMeetings()

    return () => {
      dyteMeeting.connectedMeetings.off('stateUpdate', updateLocalState)
      dyteMeeting.connectedMeetings.off('changingMeeting', close)
    }
  }, [dyteMeeting, updateLocalState, close])

  const startBreakoutRooms = ({ participantsPerRoom = 1, roomsCount = 2 }) => {
    createAndAutoAssignBreakoutRooms({
      groupSize: participantsPerRoom,
      meeting: dyteMeeting,
      stateManager: breakoutRoomsManager,
      roomsCount,
    })
  }

  const endBreakoutRooms = () => {
    stopBreakoutRooms({
      meeting: dyteMeeting,
      stateManager: breakoutRoomsManager,
    })
  }

  const joinRoom = (meetId: string) => {
    moveHostToRoom({
      meeting: dyteMeeting,
      stateManager: breakoutRoomsManager,
      destinationMeetingId: meetId,
    })
  }

  return {
    breakoutRoomsManager,
    startBreakoutRooms,
    endBreakoutRooms,
    joinRoom,
  }
}

export const useBreakoutRooms = () => {
  const dyteMeetingSelector = useDyteSelector((m) => m)
  const { meeting: dyteMeeting } = useDyteMeeting()

  const isCurrentDyteMeetingInABreakoutRoom =
    dyteMeetingSelector.connectedMeetings.parentMeeting &&
    dyteMeetingSelector.connectedMeetings.parentMeeting.id !==
      dyteMeeting.meta.meetingId

  const isBreakoutActive = dyteMeetingSelector.connectedMeetings.isActive

  return {
    isBreakoutActive,
    isCurrentDyteMeetingInABreakoutRoom,
  }
}
