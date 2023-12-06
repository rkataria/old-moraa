"use client"
import { useContext, useEffect, useState } from "react"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteCameraToggle,
  DyteMicToggle,
  DyteNameTag,
  DyteParticipantTile,
} from "@dytesdk/react-ui-kit"
import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"

const MeetingSetupScreen = () => {
  const { meeting } = useDyteMeeting()
  const [name, setName] = useState<string>("")
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType

  useEffect(() => {
    if (!meeting) return
    const name = meeting.self.name
    setName(name)
  }, [meeting])

  const joinMeeting = async () => {
    meeting?.self.setName(name)
    await meeting.joinRoom()
  }

  console.log("meeting self", meeting.self)

  return (
    <div className="w-full h-screen flex justify-center items-center gap-4">
      <div className="w-1/2 flex justify-end">
        <div className="relative">
          <DyteParticipantTile meeting={meeting} participant={meeting.self}>
            <DyteAvatar size="md" participant={meeting.self} />
            <DyteNameTag meeting={meeting} participant={meeting.self}>
              <DyteAudioVisualizer
                size="sm"
                slot="start"
                participant={meeting.self}
              />
            </DyteNameTag>
            <div className="absolute bottom-2 right-2 flex">
              <DyteMicToggle size="sm" meeting={meeting} />
              &ensp;
              <DyteCameraToggle size="sm" meeting={meeting} />
            </div>
          </DyteParticipantTile>
        </div>
      </div>
      <div className="flex flex-col justify-start w-1/2 m-8">
        <div className="w-1/2 flex text-center flex-col min-w-[300px]">
          <h2 className="mt-2 font-semibold">Welcome! {name}</h2>
          <p className="mt-2 text-purple-500">
            {isHost
              ? "You are joining as a Host"
              : "You are joining as a Learner"}
          </p>
          <input
            disabled={!meeting.self.permissions.canEditDisplayName ?? false}
            className="mt-2 outline-none p-2 rounded font-normal border-2 border-purple-500 bg-white"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
          <button
            className="mt-2 outline-none p-2 rounded font-normal border-2 border-purple-500 bg-purple-500 text-white"
            onClick={joinMeeting}
          >
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  )
}

export default MeetingSetupScreen
