"use client"
import { useContext, useEffect, useState } from "react"
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core"
import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteCameraToggle,
  DyteMicToggle,
  DyteNameTag,
  DyteParticipantTile,
  DyteSettings,
  DyteSettingsToggle,
} from "@dytesdk/react-ui-kit"
import { useEvent } from "@/hooks/useEvent"
import { useParams } from "next/navigation"
import Loading from "../common/Loading"
import { IconSettingsCog, IconX } from "@tabler/icons-react"

const MeetingSetupScreen = () => {
  const { eventId } = useParams()
  const { event } = useEvent({
    id: eventId as string,
  })
  const { meeting } = useDyteMeeting()
  const [name, setName] = useState<string>("")
  const [isHost, setIsHost] = useState<boolean>(false)
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false)

  const handleSettingsClick = () => {
    setSettingsModalOpen(true)
  }

  const handleCloseSettingsModal = () => {
    setSettingsModalOpen(false)
  }

  // Close the modal when the component is unmounted
  useEffect(() => {
    return () => {
      setSettingsModalOpen(false)
    }
  }, [])

  const self = useDyteSelector((states) => states.self)

  useEffect(() => {
    if (!meeting) return
    const preset = meeting.self.presetName
    const name = meeting.self.name
    setName(name)

    if (preset.includes("host")) {
      setIsHost(true)
    }
  }, [meeting])

  const joinMeeting = () => {
    meeting?.self.setName(name)
    meeting.join()
  }

  if (!event || !meeting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )
  }

  console.log("meeting in setup screen", meeting)

  return (
    <div className="w-full h-screen flex flex-col justify-start items-center gap-4 pt-36">
      <div className="mb-12">
        <h1 className="mb-2 text-3xl font-semibold text-center">
          {event.name}
        </h1>
        {event.description && (
          <p className="text-center text-gray-500">{event.description}</p>
        )}
      </div>
      <div className="flex justify-center items-center gap-4">
        <div className="w-1/2 flex justify-end">
          <div className="relative">
            <DyteParticipantTile meeting={meeting} participant={self}>
              <DyteAvatar size="md" participant={self} />
              <DyteNameTag meeting={meeting} participant={self}>
                <DyteAudioVisualizer
                  size="sm"
                  slot="start"
                  participant={self}
                />
              </DyteNameTag>
              <div className="absolute bottom-2 right-2 flex">
                <DyteMicToggle size="sm" meeting={meeting} />
                &ensp;
                <DyteCameraToggle size="sm" meeting={meeting} />
                &ensp;
                <DyteSettingsToggle size="sm" onClick={handleSettingsClick} />
              </div>
            </DyteParticipantTile>
          </div>
          {isSettingsModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-md">
                <div className="flex justify-end">
                  {/* Close icon in the top-right corner */}
                  <button onClick={handleCloseSettingsModal}>
                    <IconX className="w-6 h-6 text-black" />
                  </button>
                </div>
                <DyteSettings meeting={meeting} />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-start w-1/2 m-8">
          <div className="w-1/2 flex text-center flex-col min-w-[300px]">
            <h2 className="mt-2 font-semibold">Welcome {name}!</h2>
            <p className="mt-2 text-purple-500">
              {isHost
                ? "You are joining as Host"
                : "You are joining as Learner"}
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
    </div>
  )
}

export default MeetingSetupScreen
