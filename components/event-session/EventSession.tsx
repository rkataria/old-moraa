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
  const router = useRouter()
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
    // provideDyteDesignSystem(meetingEl.current, {
    //   googleFont: "Poppins",
    //   theme: "dark",
    //   colors: {
    //     danger: "#ffb31c",
    //     brand: {
    //       300: "#c6a6ff",
    //       400: "#9e77e0",
    //       500: "#754cba",
    //       600: "#4e288f",
    //       700: "#2e0773",
    //     },
    //     text: "#071428",
    //     "text-on-brand": "#ffffff",
    //     "video-bg": "#E5E7EB",
    //   },
    //   borderRadius: "rounded",
    // })
  }, [])

  const renderComponents = () => {
    if (roomJoined) {
      return <MeetingScreen/>
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
