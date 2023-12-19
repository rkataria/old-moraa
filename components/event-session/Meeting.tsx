import EventSessionContext from "@/contexts/EventSessionContext"
import {
  EventSessionContextType,
  PresentationStatuses,
} from "@/types/event-session.type"
import {
  DyteButton,
  DyteCameraToggle,
  DyteChatToggle,
  DyteDialogManager,
  DyteLeaveButton,
  DyteMicToggle,
  DyteNameTag,
  DyteNotifications,
  DyteParticipantTile,
  DyteParticipantsAudio,
  DyteSettingsToggle,
  DyteSidebar,
  DyteSpotlightGrid,
} from "@dytesdk/react-ui-kit"
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core"
import { IconPencil, IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react"
import clsx from "clsx"
import React, { useContext, useEffect, useState } from "react"

function Meeting() {
  const { meeting } = useDyteMeeting()
  const {
    setCurrentSlide,
    previousSlide,
    nextSlide,
    presentationStatus,
    startPresentation,
    pausePresentation,
    stopPresentation,
  } = useContext(EventSessionContext) as EventSessionContextType
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
          console.log("start-presentation")
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
        default:
          break
      }
    }
    meeting.participants.on("broadcastedMessage", handleBroadcastedMessage)

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

  const renderPresentationControls = () => {
    if (!isHost) return null

    if (presentationStatus === PresentationStatuses.STOPPED) {
      return (
        <DyteButton
          size="sm"
          variant="secondary"
          kind="icon"
          className="p-2 w-14 h-10 rounded-lg flex justify-center items-center bg-black hover:bg-gray-900"
          onClick={startPresentation}
        >
          <IconPlayerPlay />
        </DyteButton>
      )
    }

    if (presentationStatus === PresentationStatuses.STARTED) {
      return (
        <>
          <DyteButton
            size="sm"
            variant="secondary"
            kind="icon"
            className="p-2 w-14 h-10 rounded-lg flex justify-center items-center bg-black hover:bg-gray-900"
            onClick={pausePresentation}
          >
            <IconPencil />
          </DyteButton>
          <DyteButton
            size="sm"
            variant="secondary"
            kind="icon"
            className="p-2 w-14 h-10 rounded-lg flex justify-center items-center bg-black hover:bg-gray-900"
            onClick={stopPresentation}
          >
            <IconPlayerStop />
          </DyteButton>
        </>
      )
    }

    if (presentationStatus === PresentationStatuses.PAUSED) {
      return (
        <>
          <DyteButton
            size="sm"
            variant="secondary"
            kind="icon"
            className="p-2 w-14 h-10 rounded-lg flex justify-center items-center bg-black hover:bg-gray-900"
            onClick={startPresentation}
          >
            <IconPlayerPlay />
          </DyteButton>
          <DyteButton
            size="sm"
            variant="secondary"
            kind="icon"
            className="p-2 w-14 h-10 rounded-lg flex justify-center items-center bg-black hover:bg-gray-900"
            onClick={stopPresentation}
          >
            <IconPlayerStop />
          </DyteButton>
        </>
      )
    }
  }

  return (
    <>
      <div>
        {presentationStatus === PresentationStatuses.STOPPED ? (
          <div className="w-4/5 m-auto h-screen pt-16 flex justify-center items-center gap-6">
            <DyteSpotlightGrid
              layout="row"
              participants={meeting.participants.active.toArray()}
              pinnedParticipants={[meeting.self]}
              style={{ height: "360px", width: "100%" }}
            />
          </div>
        ) : (
          <div
            className={clsx("fixed right-0 top-0 w-72 h-full bg-white pt-16")}
          >
            <div className="p-1 flex flex-col justify-start items-center gap-2 h-full scrollbar-thin overflow-y-auto">
              {participants.map((participant, index) => (
                <div key={participant.id}>
                  <DyteParticipantTile
                    participant={participant}
                    nameTagPosition="bottom-center"
                    className="w-full h-36"
                    states={states}
                  >
                    <DyteNameTag participant={meeting.self} meeting={meeting} />
                  </DyteParticipantTile>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1">
        <DyteMicToggle size="sm" meeting={meeting} />
        <DyteCameraToggle size="sm" meeting={meeting} />
        <DyteLeaveButton
          size="sm"
          onClick={() => setState({ activeLeaveConfirmation: true })}
        />
        <DyteChatToggle size="sm" meeting={meeting} />
        <DyteSettingsToggle
          size="sm"
          onClick={() => setState({ activeSettings: true })}
        />
        {renderPresentationControls()}
      </div>

      {/* Sidebar */}
      <div
        className={clsx("fixed right-0 top-12 h-screen w-72 bg-black", {
          hidden: !activeSidebar,
        })}
      >
        <DyteSidebar meeting={meeting} />
      </div>

      {/* Required Dyte Components */}
      <DyteParticipantsAudio meeting={meeting} />
      <DyteNotifications meeting={meeting} />
      <DyteDialogManager
        meeting={meeting}
        states={states}
        onDyteStateUpdate={(e) => setState(e.detail)}
      />
    </>
  )
}

export default Meeting
