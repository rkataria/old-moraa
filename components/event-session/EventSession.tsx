import { useEffect, useRef, useState } from "react"
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core"

import Loading from "@/components/common/Loading"
import MeetingSetupScreen from "@/components/event-session/MeetingSetupScreen"
import { EventSessionProvider } from "@/contexts/EventSessionContext"
import MeetingScreen from "@/components/event-session/MeetingScreen"
import { useRouter } from "next/navigation"

export type EventSessionProps = {
  meetingToken: string
}

function EventSession({ meetingToken }: EventSessionProps) {
  const meetingEl = useRef<HTMLDivElement>(null)
  const [meeting, initMeeting] = useDyteClient()
  const [roomJoined, setRoomJoined] = useState<boolean>(false)

  useEffect(() => {
    initMeeting({
      authToken: meetingToken,
      defaults: {
        audio: true,
        video: true,
      },
    })
  }, [])

  useEffect(() => {
    if (!meeting) return

    const roomJoinedListener = () => {
      setRoomJoined(true)
    }
    const roomLeftListener = () => {
      setRoomJoined(false)
      console.log("room left")
    }
    meeting.self.on("roomJoined", roomJoinedListener)
    meeting.self.on("roomLeft", roomLeftListener)

    return () => {
      meeting.self.removeListener("roomJoined", roomJoinedListener)
      meeting.self.removeListener("roomLeft", roomLeftListener)
    }
  }, [meeting])

  useEffect(() => {
    if (!meetingEl.current) return
  }, [])

  const renderComponents = () => {
    if (roomJoined) {
      return <MeetingScreen />
    }

    return <MeetingSetupScreen />
  }

  return (
    <EventSessionProvider>
      <div ref={meetingEl}>
        <DyteProvider
          value={meeting}
          fallback={
            <div className="h-screen flex justify-center items-center">
              <Loading />
            </div>
          }
        >
          <>{renderComponents()}</>
        </DyteProvider>
      </div>
    </EventSessionProvider>
  )
}

export default EventSession
