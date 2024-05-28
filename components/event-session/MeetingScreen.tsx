/* eslint-disable react/button-has-type */
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
import { useDebounce } from '@uidotdev/usehooks'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
} from 'react-resizable-panels'

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
import { PanelResizer } from '../common/PanelResizer'

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
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const rightPanelRef = useRef<ImperativePanelHandle>(null)
  const [mainLayoutPanelSizes, setMainLayoutPanelSizes] = useState([2, 98]) // [leftSidebar, mainContent, rightSidebar]
  const debouncedMainLayoutPanelSizes = useDebounce(mainLayoutPanelSizes, 500)

  useHotkeys('ctrl + [', () => setLeftSidebarVisible(!leftSidebarVisible), [
    leftSidebarVisible,
  ])

  useHotkeys('cmd + [', () => setLeftSidebarVisible(!leftSidebarVisible), [
    leftSidebarVisible,
  ])

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

  useEffect(() => {
    const leftPanelSize = debouncedMainLayoutPanelSizes[0]

    if (leftPanelSize > 5) {
      setLeftSidebarVisible(true)
      leftPanelRef.current?.resize(leftPanelSize)
    } else {
      setLeftSidebarVisible(false)
      leftPanelRef.current?.resize(2)
    }
  }, [debouncedMainLayoutPanelSizes])

  const toggleLeftSidebar = () => {
    setLeftSidebarVisible((prev) => {
      const newState = !prev
      if (leftPanelRef.current) {
        leftPanelRef.current.resize(newState ? 20 : 2)
      }

      return newState
    })
  }

  const renderRightSidebar = () => {
    if (!rightSidebar) return null

    if (rightSidebar === 'aichat') {
      return <AIChat onClose={() => setRightSidebar(null)} />
    }

    return (
      <DyteSidebar
        meeting={meeting}
        states={dyteStates}
        className="bg-white w-full h-full max-w-full"
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
      <div className="flex flex-auto w-full bg-gray-100">
        <PanelGroup
          direction="horizontal"
          autoSaveId="meetingScreenLayout"
          className="bg-transparent"
          onLayout={(layout) => {
            setMainLayoutPanelSizes(layout)
          }}>
          {/* Left Sidebar */}
          <Panel
            minSize={2}
            maxSize={25}
            defaultSize={leftSidebarVisible ? 20 : 0}
            ref={leftPanelRef}
            className={cn('pr-5', {
              'bg-transparent': leftSidebarVisible,
            })}>
            <MeetingLeftSidebarWrapper
              visible={leftSidebarVisible}
              toggleLeftSidebar={toggleLeftSidebar}>
              {leftSidebarVisible && (
                <AgendaPanel updateActiveSession={updateActiveSession} />
              )}
            </MeetingLeftSidebarWrapper>
          </Panel>

          <PanelResizer className="right-6" />

          {/* Main Content */}
          <Panel
            minSize={20}
            defaultSize={
              leftSidebarVisible && !!rightSidebar
                ? 60
                : rightSidebar
                  ? 80
                  : 100
            }
            maxSize={rightSidebar ? 70 : 100}>
            <div
              className="relative flex justify-start items-start flex-1 w-full h-full max-h-[calc(100vh_-_64px)] overflow-hidden overflow-y-auto bg-gray-100"
              ref={mainContentRef}>
              {/* Sportlight View */}
              {spotlightMode ? (
                <div className="flex flex-col overflow-auto h-full flex-1">
                  <ParticipantTiles spotlightMode={spotlightMode} />
                </div>
              ) : (
                <PanelGroup
                  direction="horizontal"
                  autoSaveId="meetingScreenLayout">
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

                  <PanelResizer />

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
          </Panel>

          {/* Right Sidebar */}
          {!!rightSidebar && (
            <>
              <PanelResizer className="-right-[4px] z-[111]" />
              <Panel
                minSize={
                  leftSidebarVisible && !!rightSidebar
                    ? 20
                    : rightSidebar
                      ? 15
                      : 0
                }
                maxSize={25}
                defaultSize={
                  leftSidebarVisible && !!rightSidebar
                    ? 20
                    : rightSidebar
                      ? 15
                      : 0
                }
                ref={rightPanelRef}
                className="bg-white">
                <MeetingRightSidebarWrapper visible={!!rightSidebar}>
                  {renderRightSidebar()}
                </MeetingRightSidebarWrapper>
              </Panel>
            </>
          )}
        </PanelGroup>
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
