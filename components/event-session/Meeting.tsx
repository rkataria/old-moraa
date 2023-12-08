import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import {
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
} from "@dytesdk/react-ui-kit"
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core"
import clsx from "clsx"
import React, { useContext, useEffect, useState } from "react"

function Meeting() {
  const { meeting } = useDyteMeeting()
  const { setCurrentSlide, previousSlide, nextSlide } = useContext(
    EventSessionContext
  ) as EventSessionContextType
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
        default:
          break
      }
    }
    meeting.participants.on("broadcastedMessage", handleBroadcastedMessage)

    const handleDyteStateUpdate = ({ detail }: any) => {
      console.log("detail", detail)

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

  const setState = (s: any) => setStates((states) => ({ ...states, ...s }))

  return (
    <>
      <div>
        <div className="fixed right-0 top-0 w-72 h-full bg-white pt-16">
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
