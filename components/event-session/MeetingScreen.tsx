/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext, useEffect, useState } from 'react'

import {
  DyteDialogManager,
  DyteNotifications,
  DyteParticipantsAudio,
  DyteSidebar,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import clsx from 'clsx'

import { ContentContainer } from '@/components/event-session/ContentContainer'
import { Header } from '@/components/event-session/Header'
import { MiniSlideManager } from '@/components/event-session/MiniSlideMananger'
import { ParticipantTiles } from '@/components/event-session/ParticipantTiles'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import {
  EventSessionContextType,
  PresentationStatuses,
} from '@/types/event-session.type'

export function MeetingScreen() {
  const { meeting } = useDyteMeeting()
  const {
    slides,
    currentSlide,
    setCurrentSlide,
    previousSlide,
    nextSlide,
    setCurrentSlideByID,
    presentationStatus,
    startPresentation,
    pausePresentation,
    stopPresentation,
    syncSlides,
  } = useContext(EventSessionContext) as EventSessionContextType
  const [slidesSidebarVisible, setSlidesSidebarVisibility] =
    useState<boolean>(true)
  const [states, setStates] = useState({})
  const [activeSidebar, setActiveSidebar] = useState<boolean>(false)
  const [isHost, setIsHost] = useState<boolean>(false)

  useEffect(() => {
    if (!meeting) return

    const preset = meeting.self.presetName
    if (preset.includes('host')) {
      setIsHost(true)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDyteStateUpdate = ({ detail }: any) => {
      setActiveSidebar(!!detail.activeSidebar)
    }

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setState = (s: any) => setStates((_states) => ({ ..._states, ...s }))

  return (
    <div className="flex flex-col h-screen">
      <Header
        setState={setState}
        toggleSlidesSidebarVisiblity={() => {
          setSlidesSidebarVisibility((v) => !v)
        }}
      />
      <div className="flex flex-auto">
        {/* {presentationStatus === PresentationStatuses.STARTED && ( */}
        <MiniSlideManager
          isHost={isHost}
          visible={slidesSidebarVisible}
          slides={slides}
          currentSlide={currentSlide}
          setCurrentSlide={(slide) => {
            meeting.participants.broadcastMessage('set-current-slide-by-id', {
              slideId: slide.id,
            })
            setCurrentSlide(slide)
          }}
        />
        {/* )} */}
        <div className="flex flex-col w-full h-full overflow-hidden">
          <ParticipantTiles />
          <ContentContainer />
        </div>
        <div
          className={clsx('flex-none bg-black', {
            'w-72': activeSidebar,
            'w-0': !activeSidebar,
          })}>
          <DyteSidebar
            meeting={meeting}
            className="rounded-none text-white"
            onDyteStateUpdate={(e) => {
              setState({ ...states, ...e.detail })
            }}
          />
        </div>
      </div>

      {/* Required Dyte Components */}
      <DyteParticipantsAudio meeting={meeting} />
      <DyteNotifications meeting={meeting} />
      <DyteDialogManager
        meeting={meeting}
        states={states}
        onDyteStateUpdate={(e) => {
          setState({ ...states, ...e.detail })
        }}
      />
    </div>
  )
}
