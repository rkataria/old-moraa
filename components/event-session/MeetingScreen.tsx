/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useContext, useEffect, useRef, useState } from 'react'

import {
  DyteDialogManager,
  DyteNotifications,
  DyteParticipantsAudio,
  DyteSidebar,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { DyteParticipant } from '@dytesdk/web-core'

import { ContentContainer } from './ContentContainer'
import { MeetingControls } from './MeetingControls'
import {
  MeetingLayoutRoot,
  MeetingLeftSidebarWrapper,
  MeetingRightSidebarWrapper,
} from './MeetingLayout'
import { ParticipantTiles } from './ParticipantTiles'
import { AgendaPanel } from '../common/AgendaPanel'
import { AIChat } from '../common/AIChat'

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

export type RightSiderbar = 'participants' | 'chat' | 'plugins' | 'aichat'

export function MeetingScreen() {
  const { meeting } = useDyteMeeting()
  const mainContentRef = useRef<HTMLDivElement>(null)
  const [leftSidebarVisible, setLeftSidebarVisible] = useState<boolean>(false)
  const [rightSidebar, setRightSidebar] = useState<RightSiderbar | null>(null)
  const [dyteStates, setDyteStates] = useState<DyteStates>({})
  const { sections, preview, currentSlide, setCurrentSlide } = useContext(
    EventContext
  ) as EventContextType
  const {
    isHost,
    eventSessionMode,
    presentationStatus,
    setEventSessionMode,
    updateActiveSession,
  } = useContext(EventSessionContext) as EventSessionContextType

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

    const handleHostLeft = (participant: DyteParticipant) => {
      if (
        participant.presetName?.includes('host') &&
        eventSessionMode === 'Presentation'
      ) {
        setEventSessionMode('Lobby')
        updateActiveSession({
          presentationStatus: PresentationStatuses.STOPPED,
        })
      }
    }

    document.body.addEventListener('dyteStateUpdate', handleDyteStateUpdate)
    meeting.participants.joined.on('participantLeft', handleHostLeft)

    function onUnmount() {
      document.body.removeEventListener(
        'dyteStateUpdate',
        handleDyteStateUpdate
      )
      meeting.participants.joined.off('participantLeft', handleHostLeft)
    }

    // eslint-disable-next-line consistent-return
    return onUnmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting, eventSessionMode])

  const renderRightSidebar = () => {
    if (!rightSidebar) return null

    if (rightSidebar === 'aichat') return <AIChat />

    return (
      <DyteSidebar
        meeting={meeting}
        states={dyteStates}
        className="bg-white"
        // Bug: Applying this show only the sidebar and not the main content
        // config={{
        //   styles: {
        //     'dyte-sidebar-ui': {
        //       backgroundColor: 'white',
        //     },
        //   },
        // }}
        onDyteStateUpdate={(e) => {
          setDyteStates((prevDyteStates) => ({
            ...prevDyteStates,
            ...e.detail,
          }))
        }}
      />
    )
  }

  const spotlightMode = eventSessionMode === 'Lobby'

  const currentSlideBgColor =
    presentationStatus === PresentationStatuses.STARTED
      ? currentSlide?.config?.backgroundColor || '#f3f4f6'
      : '#f3f4f6'

  if (mainContentRef.current) {
    mainContentRef.current.style.backgroundColor = currentSlideBgColor
  }

  return (
    <MeetingLayoutRoot>
      <div className="h-16 px-4 z-10 border-b-2 border-gray-200 bg-white">
        <MeetingControls
          rightSidebar={rightSidebar}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onDyteStateUpdate={(data: any) => {
            setDyteStates((prevDyteStates) => ({
              ...prevDyteStates,
              ...data,
            }))
          }}
          onSidebarOpen={(data) => {
            if (rightSidebar) {
              setRightSidebar(null)
              setDyteStates({
                ...dyteStates,
                [rightSidebar]: false,
              })

              return
            }

            if (['participants', 'chat', 'plugins'].includes(data.sidebar)) {
              setDyteStates(data)
            }

            setRightSidebar(data.sidebar)
          }}
          onAiChatOverlayToggle={() => {
            if (rightSidebar === 'aichat') {
              setRightSidebar(null)
            } else {
              setRightSidebar('aichat')
            }
          }}
        />
      </div>
      <div className="flex flex-auto w-full">
        <MeetingLeftSidebarWrapper
          visible={leftSidebarVisible}
          setLeftSidebarVisible={setLeftSidebarVisible}>
          <AgendaPanel />
        </MeetingLeftSidebarWrapper>
        <div
          className="relative flex justify-start items-start flex-1 w-full h-full max-h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto bg-gray-100"
          ref={mainContentRef}>
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
                'h-full w-full order-1': spotlightMode,
              })}>
              <ParticipantTiles
                spotlightMode={spotlightMode}
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
    </MeetingLayoutRoot>
  )
}
