import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import {
  DyteAudioVisualizer,
  DyteCameraToggle,
  DyteControlbar,
  DyteDialogManager,
  DyteMicToggle,
  DyteNameTag,
  DyteNotifications,
  DyteParticipantTile,
  DyteParticipantsAudio,
  DyteSetupScreen,
} from "@dytesdk/react-ui-kit"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import React, { useContext, useState } from "react"

function Meeting() {
  const [states, setStates] = useState({})
  const { meeting } = useDyteMeeting()

  const setState = (s: any) => setStates((states) => ({ ...states, ...s }))

  return (
    <>
      <div>
        <div className="fixed right-0 top-0 w-64 h-full bg-white pt-16">
          <div className="p-1 grid grid-cols-1 gap-2 h-full scrollbar-thin overflow-y-auto">
            {[...Array(10)].map((_, i) => (
              <div>
                <DyteParticipantTile
                  participant={meeting.self}
                  nameTagPosition="bottom-center"
                  className="w-full h-36"
                >
                  <DyteNameTag participant={meeting.self} meeting={meeting} />
                </DyteParticipantTile>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-yellow-500 shadow-lg flex justify-center items-center gap-1">
        <DyteMicToggle meeting={meeting} size="sm" />
        <DyteCameraToggle meeting={meeting} size="sm" />
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
