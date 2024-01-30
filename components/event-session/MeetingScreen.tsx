import clsx from "clsx"
import { useContext, useEffect, useState } from "react"
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core"
import {
  DyteDialogManager,
  DyteNotifications,
  DyteParticipantsAudio,
  DyteSettings,
  DyteSidebar,
} from "@dytesdk/react-ui-kit"

import EventSessionContext from "@/contexts/EventSessionContext"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import Header from "@/components/event-session/Header"
import ParticipantTiles from "@/components/event-session/ParticipantTiles"
import ContentContainer from "@/components/event-session/ContentContainer"
import MiniSlideManager from "@/components/event-session/MiniSlideMananger"
import { IconX } from "@tabler/icons-react"

function MeetingScreen() {
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
  const [isSettingsModalOpen, setSettingsModalOpen] = useState<boolean>(false)
  const [states, setStates] = useState({})
  const [activeSidebar, setActiveSidebar] = useState<boolean>(false)
  const [isHost, setIsHost] = useState<boolean>(false)
  const self = useDyteSelector((meeting) => meeting.self)
  const activeParticipants = useDyteSelector((meeting) =>
    meeting.participants.active.toArray()
  )

  const pinnedParticipants = useDyteSelector((meeting) =>
    meeting.participants.pinned.toArray()
  )

  const participants = [
    self,
    ...pinnedParticipants,
    ...activeParticipants.filter((p) => !pinnedParticipants.includes(p)),
  ]

  useEffect(() => {
    if (!meeting) return

    const preset = meeting.self.presetName
    if (preset.includes("host")) {
      setIsHost(true)
    }

    const handleBroadcastedMessage = ({
      type,
      payload,
    }: {
      type: string
      payload: any
    }) => {
      switch (type) {
        case "slide-changed": {
          setCurrentSlide(payload.slide)
          break
        }
        case "previous-slide": {
          previousSlide()
          break
        }
        case "next-slide": {
          nextSlide()
          break
        }
        case "start-presentation": {
          startPresentation()
          break
        }
        case "pause-presentation": {
          pausePresentation()
          break
        }
        case "stop-presentation": {
          stopPresentation()
          break
        }
        case "sync-slides": {
          syncSlides()
          break
        }
        case "set-current-slide-by-id": {
          setCurrentSlideByID(payload.slideId)
          break
        }
        default:
          break
      }
    }
    meeting.participants.addListener(
      "broadcastedMessage",
      handleBroadcastedMessage
    )

    const handleDyteStateUpdate = ({ detail }: any) => {
      setActiveSidebar(detail.activeSidebar ? true : false)
    }

    document.body.addEventListener("dyteStateUpdate", handleDyteStateUpdate)

    return () => {
      document.body.removeEventListener(
        "dyteStateUpdate",
        handleDyteStateUpdate
      )
      meeting.participants.removeListener(
        "broadcastedMessage",
        handleBroadcastedMessage
      )
    }
  }, [meeting])

  useEffect(() => {
    if (presentationStatus === PresentationStatuses.STARTED) {
      meeting?.participants.broadcastMessage("start-presentation", {})
    }
    if (presentationStatus === PresentationStatuses.PAUSED) {
      meeting?.participants.broadcastMessage("pause-presentation", {})
    }
    if (presentationStatus === PresentationStatuses.STOPPED) {
      meeting?.participants.broadcastMessage("stop-presentation", {})
    }
  }, [presentationStatus])

  const togglePresentationMode = () => {
    meeting?.participants.broadcastMessage("toggle-presentation-mode", {})
  }

  const setState = (s: any) => setStates((states) => ({ ...states, ...s }))

  return (
    <div className="flex flex-col h-screen">
      <Header
        states={states}
        setState={setState}
        toggleSlidesSidebarVisiblity={() => {
          console.log(slidesSidebarVisible)
          setSlidesSidebarVisibility((v) => !v)
        }}
        toggleSettingsModal={() => {
          console.log(isSettingsModalOpen)
          setSettingsModalOpen((v) => !v)
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
            meeting.participants.broadcastMessage("set-current-slide-by-id", {
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
          className={clsx("flex-none bg-black", {
            "w-72": activeSidebar,
            "w-0": !activeSidebar,
          })}
        >
          <DyteSidebar
            meeting={meeting}
            className="rounded-none text-white"
            onDyteStateUpdate={(e) => {
              console.log("e.detail", e.detail)

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

      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <div className="flex justify-end">
              {/* Close icon in the top-right corner */}
              <button
                onClick={() => {
                  setSettingsModalOpen(false)
                }}
              >
                <IconX className="w-6 h-6 text-black" />
              </button>
            </div>
            <DyteSettings meeting={meeting} />
          </div>
        </div>
      )}
    </div>
  )
}

export default MeetingScreen
