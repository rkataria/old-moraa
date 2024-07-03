/* eslint-disable @typescript-eslint/no-explicit-any */

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
  startBreakoutRooms: any
  endBreakoutRooms: any
  joinRoom: any
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
  const { meeting: dyteMeeting } = useDyteMeeting()
  const [breakoutRoomsManager] = useState<BreakoutRoomsManager>(
    new BreakoutRoomsManager()
  )

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

    return () => {
      dyteMeeting.connectedMeetings.off('stateUpdate', updateLocalState)
      dyteMeeting.connectedMeetings.off('changingMeeting', close)
    }
  }, [dyteMeeting, updateLocalState, close])

  const startBreakoutRooms = useCallback(
    ({ participantsPerRoom = 1, roomsCount = 2 }) => {
      try {
        createAndAutoAssignBreakoutRooms({
          groupSize: participantsPerRoom,
          meeting: dyteMeeting,
          stateManager: breakoutRoomsManager,
          roomsCount,
        })
        dyteMeeting.connectedMeetings.getConnectedMeetings()
      } catch (error) {
        console.error('Error while creating breakout rooms', error)
      }
    },
    [breakoutRoomsManager, dyteMeeting]
  )

  const endBreakoutRooms = useCallback(() => {
    stopBreakoutRooms({
      meeting: dyteMeeting,
      stateManager: breakoutRoomsManager,
    })
    dyteMeeting.connectedMeetings.getConnectedMeetings()
  }, [breakoutRoomsManager, dyteMeeting])

  const joinRoom = useCallback(
    (meetId: string) => {
      moveHostToRoom({
        meeting: dyteMeeting,
        stateManager: breakoutRoomsManager,
        destinationMeetingId: meetId,
      })
      dyteMeeting.connectedMeetings.getConnectedMeetings()
    },
    [breakoutRoomsManager, dyteMeeting]
  )

  const value = useMemo(
    () => ({
      breakoutRoomsManager,
      startBreakoutRooms,
      endBreakoutRooms,
      joinRoom,
    }),
    [breakoutRoomsManager, startBreakoutRooms, endBreakoutRooms, joinRoom]
  )

  return (
    <BreakRoomManagerContext.Provider value={value}>
      {children}
    </BreakRoomManagerContext.Provider>
  )
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

export function useBreakoutRoomsManager() {
  const context = useContext(BreakRoomManagerContext)
  if (context === undefined) {
    throw new Error(
      'useBreakoutRoomsManager must be used within a BreakRoomsManagerProvider'
    )
  }

  return context
}

export const useBreakoutRooms = () => {
  const parentMeetingId = useDyteSelector(
    (meeting) => meeting.connectedMeetings.parentMeeting?.id
  )
  const isBreakoutActive = useDyteSelector((m) => m.connectedMeetings.isActive)
  const { meeting } = useDyteMeeting()

  const isCurrentDyteMeetingInABreakoutRoom =
    parentMeetingId !== meeting.meta.meetingId

  return {
    isBreakoutActive,
    isCurrentDyteMeetingInABreakoutRoom,
  }
}
