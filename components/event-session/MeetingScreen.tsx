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
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

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
    updateTypingUsers,
  } = useContext(EventSessionContext) as EventSessionContextType

  const activePlugin = useDyteSelector((m) => m.plugins.active.toArray()?.[0])
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

  const isScreensharing = !!screensharingParticipant || selfScreenShared
  const [panelSize, setPanelSize] = useState(18) // Initial default size
  const panelRef = useRef(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (panelRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newSize = (panelRef.current as any).getSize() // Get current size as percentage
        if (newSize !== panelSize) {
          setPanelSize(newSize)
        }
      }
    }, 100) // Polling interval

    return () => clearInterval(intervalId)
  }, [panelSize])

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
      updateTypingUsers({
        isTyping: false,
        participantId: participant.id,
      })

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

    if (rightSidebar === 'aichat') {
      return <AIChat onClose={() => setRightSidebar(null)} />
    }

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
      <div className="h-16 px-4 z-[9] border-b-2 border-gray-200 bg-white">
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
            if (rightSidebar === data.sidebar) {
              setRightSidebar(null)
              setDyteStates({
                ...dyteStates,
                [rightSidebar]: false,
              })

              return
            }

            if (['participants', 'chat', 'plugins'].includes(data.sidebar)) {
              setDyteStates(data)
              setRightSidebar(data.sidebar)
            }
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
          <AgendaPanel updateActiveSession={updateActiveSession} />
        </MeetingLeftSidebarWrapper>
        <div
          className="relative flex justify-start items-start flex-1 w-full h-full max-h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto bg-gray-100"
          ref={mainContentRef}>
          {/* Sportlight View */}
          {spotlightMode ? (
            <ParticipantTiles spotlightMode />
          ) : (
            <PanelGroup direction="horizontal" autoSaveId="meetingScreenLayout">
              <Panel
                minSize={30}
                maxSize={100}
                defaultSize={80}
                collapsedSize={50}>
                {['Preview', 'Presentation'].includes(eventSessionMode) && (
                  <div className="relative flex-1 w-full h-full p-2 rounded-md overflow-hidden overflow-y-auto">
                    <ContentContainer />
                  </div>
                )}
              </Panel>

              <PanelResizeHandle className="w-1.5 h-full bg-transparent relative cursor-col-resize hover:bg-opacity-10 hover:bg-black">
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-600"
                  style={{ top: '45%', height: '10%', width: '75%' }}
                />
              </PanelResizeHandle>

              <Panel
                minSize={20}
                collapsedSize={20}
                defaultSize={20}
                maxSize={50}
                ref={panelRef}>
                <div className="flex flex-col overflow-auto h-full flex-1">
                  <ParticipantTiles spotlightMode={spotlightMode} />
                </div>
              </Panel>
            </PanelGroup>
          )}
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
