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

export function MeetingScreen() {
  const { meeting } = useDyteMeeting()
  const [leftSidebarVisible, setLeftSidebarVisible] = useState<boolean>(false)
  const [rightSidebarVisible, setRightSidebarVisible] = useState<boolean>(false)
  const [spotlightMode, setSpotlightMode] = useState<boolean>(true)
  const [dyteStates, setDyteStates] = useState<DyteStates>({})
  const {
    slides,
    currentSlide,
    setCurrentSlide,
    isHost,
    presentationStatus,
    previousSlide,
    nextSlide,
    startPresentation,
    pausePresentation,
    stopPresentation,
    syncSlides,
    setCurrentSlideByID,
  } = useContext(EventSessionContext) as EventSessionContextType
  const activePlugin = meeting.plugins.active.toArray()?.[0]
  const selfScreenShared = useDyteSelector((m) => m.self.screenShareEnabled)
  const screensharingParticipant = useDyteSelector((m) =>
    m.participants.joined.toArray().find((p) => p.screenShareEnabled)
  )

  const isScreensharing = !!screensharingParticipant || selfScreenShared
  const sidebarVisible = leftSidebarVisible || rightSidebarVisible

  useEffect(() => {
    if (isScreensharing) {
      setSpotlightMode(false)
    }
    if (activePlugin) {
      setSpotlightMode(false)
    }
    if (presentationStatus === PresentationStatuses.STARTED) {
      setSpotlightMode(false)
    }

    if (presentationStatus === PresentationStatuses.STOPPED) {
      setSpotlightMode(true)
    }
  }, [isScreensharing, activePlugin, presentationStatus])

  useEffect(() => {
    if (!meeting) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDyteStateUpdate = ({ detail }: any) => {
      setRightSidebarVisible(!!detail.activeSidebar)
    }

    const handleBroadcastedMessage = ({
      type,
      payload,
    }: {
      type: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: any
    }) => {
      switch (type) {
        case 'slide-changed': {
          setCurrentSlide(payload.slide)
          break
        }
        case 'previous-slide': {
          previousSlide()
          break
        }
        case 'next-slide': {
          nextSlide()
          break
        }
        case 'start-presentation': {
          startPresentation()
          break
        }
        case 'pause-presentation': {
          pausePresentation()
          break
        }
        case 'stop-presentation': {
          stopPresentation()
          break
        }
        case 'sync-slides': {
          syncSlides()
          break
        }
        case 'set-current-slide-by-id': {
          setCurrentSlideByID(payload.slideId)
          break
        }
        default:
          break
      }
    }

    meeting.participants.addListener(
      'broadcastedMessage',
      handleBroadcastedMessage
    )

    document.body.addEventListener('dyteStateUpdate', handleDyteStateUpdate)

    function onUnmount() {
      document.body.removeEventListener(
        'dyteStateUpdate',
        handleDyteStateUpdate
      )

      meeting.participants.removeListener(
        'broadcastedMessage',
        handleBroadcastedMessage
      )
    }

    // eslint-disable-next-line consistent-return
    return onUnmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting])

  useEffect(() => {
    if (presentationStatus === PresentationStatuses.STARTED) {
      meeting?.participants.broadcastMessage('start-presentation', {})
    }
    if (presentationStatus === PresentationStatuses.PAUSED) {
      meeting?.participants.broadcastMessage('pause-presentation', {})
    }
    if (presentationStatus === PresentationStatuses.STOPPED) {
      meeting?.participants.broadcastMessage('stop-presentation', {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presentationStatus])

  const handleUpdateDyteStates = (states: DyteStates) => {
    setDyteStates(states)
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
            currentSlide={currentSlide}
            setCurrentSlide={(slide) => {
              meeting.participants.broadcastMessage('set-current-slide-by-id', {
                slideId: slide.id,
              })
              setCurrentSlide(slide)
            }}
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
        <SlideManagerRightSidebarWrapper visible={rightSidebarVisible}>
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
