/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useContext, useEffect, useState } from 'react'

import {
  DyteDialogManager,
  DyteNotifications,
  DyteParticipantsAudio,
  DyteSidebar,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'

import { ContentContainer } from './ContentContainer'
import { FlyingEmojisOverlay } from './FlyingEmojisOverlay'
import { MeetingControls } from './MeetingControls'
import {
  MeetingLayoutRoot,
  MeetingLeftSidebarWrapper,
  MeetingRightSidebarWrapper,
} from './MeetingLayout'
import { ParticipantTiles } from './ParticipantTiles'
import { AgendaPanel } from '../common/AgendaPanel'

import { EventContext } from '@/contexts/EventContext'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventContextType } from '@/types/event-context.type'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export type DyteStates = {
  [key: string]: string | boolean
}

export type RightSiderbar = 'participants' | 'chat' | 'plugins'

export function MeetingScreen() {
  const { meeting } = useDyteMeeting()

  const [leftSidebarVisible, setLeftSidebarVisible] = useState<boolean>(false)
  const [rightSidebar, setRightSidebar] = useState<RightSiderbar | null>(null)
  const [dyteStates, setDyteStates] = useState<DyteStates>({})
  const { sections, preview, setCurrentSlide } = useContext(
    EventContext
  ) as EventContextType
  const { isHost, eventSessionMode, presentationStatus, setEventSessionMode } =
    useContext(EventSessionContext) as EventSessionContextType

  const activePlugin = useDyteSelector((m) => m.plugins.active.toArray()?.[0])
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

  const isScreensharing = !!screensharingParticipant || selfScreenShared
  const sidebarVisible = leftSidebarVisible || !!rightSidebar

  useEffect(() => {
    if (preview) {
      setLeftSidebarVisible(true)
      setCurrentSlide(sections[0]?.slides?.[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, sections])

  useEffect(() => {
    if (
      activePlugin ||
      isScreensharing ||
      presentationStatus === PresentationStatuses.STARTED
    ) {
      setEventSessionMode('Presentation')

      return
    }

    setEventSessionMode('Lobby')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreensharing, activePlugin, presentationStatus, preview, isHost])

  useEffect(() => {
    if (!meeting) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDyteStateUpdate = ({ detail }: any) => {
      setRightSidebar(detail.activeSidebar)
    }

    document.body.addEventListener('dyteStateUpdate', handleDyteStateUpdate)

    function onUnmount() {
      document.body.removeEventListener(
        'dyteStateUpdate',
        handleDyteStateUpdate
      )
    }

    // eslint-disable-next-line consistent-return
    return onUnmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting])

  const handleUpdateDyteStates = (states: DyteStates) => {
    setDyteStates(states)
  }

  const renderRightSidebar = () => {
    if (!rightSidebar) return null

    return (
      <DyteSidebar
        meeting={meeting}
        states={dyteStates}
        className="rounded-none text-white"
        onDyteStateUpdate={(e) => {
          setDyteStates((prevDyteStates) => ({
            ...prevDyteStates,
            ...e.detail,
          }))
        }}
      />
    )
  }

  return (
    <MeetingLayoutRoot>
      <div className="flex flex-auto w-full">
        <MeetingLeftSidebarWrapper
          visible={leftSidebarVisible}
          setLeftSidebarVisible={setLeftSidebarVisible}>
          <AgendaPanel />
        </MeetingLeftSidebarWrapper>
        <div className="relative flex justify-start items-start flex-1 w-full h-full max-h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto bg-gray-100">
          <div
            className={cn('flex-1 flex justify-start items-start h-full', {
              'flex-row': !sidebarVisible,
              'flex-col': sidebarVisible,
            })}>
            <div
              className={cn('', {
                'w-full h-44': sidebarVisible,
                'h-full w-72 order-2 overflow-hidden overflow-y-auto scrollbar-none':
                  !sidebarVisible,
                'h-full w-full order-1': eventSessionMode === 'Lobby',
              })}>
              <ParticipantTiles
                spotlightMode={eventSessionMode === 'Lobby'}
                sidebarVisible={sidebarVisible}
              />
            </div>
            {['Preview', 'Presentation'].includes(eventSessionMode) && (
              <div className="relative flex-1 w-full h-full p-2 rounded-md overflow-hidden overflow-y-auto flex-grow min-w-0 flex-shrink">
                <ContentContainer />
              </div>
            )}
          </div>
        </div>
        <MeetingRightSidebarWrapper visible={!!rightSidebar}>
          {renderRightSidebar()}
        </MeetingRightSidebarWrapper>
      </div>
      <div className="h-16 px-4 z-10 border-t-2 border-gray-200 bg-black">
        <MeetingControls onUpdateDyteStates={handleUpdateDyteStates} />
      </div>
      <FlyingEmojisOverlay />
      {/* Required Dyte Components */}
      <DyteParticipantsAudio meeting={meeting} />
      <DyteNotifications meeting={meeting} />
      <DyteDialogManager meeting={meeting} />
    </MeetingLayoutRoot>
  )
}
