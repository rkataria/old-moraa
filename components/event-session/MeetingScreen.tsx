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
import { Header } from './Header'
import { MiniSlideManager } from './MiniSlideMananger'
import { ParticipantTiles } from './ParticipantTiles'
import {
  SlideManagerHeader,
  SlideManagerLayoutRoot,
  SlideManagerRightSidebarWrapper,
} from '../event-content/SlideManager'

import { EventSessionContext } from '@/contexts/EventSessionContext'
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
  const [spotlightMode, setSpotlightMode] = useState<boolean>(true)
  const [dyteStates, setDyteStates] = useState<DyteStates>({})

  const { slides, isHost, presentationStatus } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const activePlugin = useDyteSelector((m) => m.plugins.active.toArray()?.[0])
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

  const isScreensharing = !!screensharingParticipant || selfScreenShared
  const sidebarVisible = leftSidebarVisible || !!rightSidebar

  useEffect(() => {
    if (
      activePlugin ||
      isScreensharing ||
      presentationStatus === PresentationStatuses.STARTED
    ) {
      setSpotlightMode(false)

      return
    }

    setSpotlightMode(true)
  }, [isScreensharing, activePlugin, presentationStatus])

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
    <SlideManagerLayoutRoot>
      <SlideManagerHeader>
        <Header
          leftSidebarVisible={leftSidebarVisible}
          onUpdateDyteStates={handleUpdateDyteStates}
          toggleLeftSidebar={() => setLeftSidebarVisible((o) => !o)}
        />
      </SlideManagerHeader>
      <div className="flex flex-auto w-full">
        <div
          className={cn('flex-none transition-all duration-300 ease-in-out', {
            'w-0': !leftSidebarVisible,
            'w-72': leftSidebarVisible,
          })}>
          <MiniSlideManager
            isHost={isHost}
            visible={leftSidebarVisible}
            slides={slides}
          />
        </div>
        <div
          className={cn('flex-1 flex justify-start items-start', {
            'flex-row': !sidebarVisible,
            'flex-col': sidebarVisible,
          })}>
          <div
            className={cn('w-full', {
              'h-44': sidebarVisible,
              'h-[calc(100vh_-_64px)] w-72 order-2 overflow-hidden overflow-y-auto scrollbar-none':
                !sidebarVisible,
              'h-full w-full order-1': spotlightMode,
            })}>
            <ParticipantTiles
              spotlightMode={spotlightMode}
              sidebarVisible={sidebarVisible}
            />
          </div>
          {!spotlightMode && (
            <div className="relative flex-1 w-full h-full p-2 rounded-md overflow-hidden overflow-y-auto">
              <ContentContainer />
            </div>
          )}
        </div>
        <SlideManagerRightSidebarWrapper visible={!!rightSidebar}>
          {renderRightSidebar()}
        </SlideManagerRightSidebarWrapper>
      </div>

      {/* Required Dyte Components */}
      <DyteParticipantsAudio meeting={meeting} />
      <DyteNotifications meeting={meeting} />
      <DyteDialogManager
        meeting={meeting}
        states={dyteStates}
        onDyteStateUpdate={(e) => {
          setDyteStates((prevDyteStates) => ({
            ...prevDyteStates,
            ...e.detail,
          }))
        }}
      />
    </SlideManagerLayoutRoot>
  )
}
