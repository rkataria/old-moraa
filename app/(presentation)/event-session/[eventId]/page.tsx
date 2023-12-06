"use client"
import Loading from "@/components/common/Loading"
import Header from "@/components/event-session/Header"
import Meeting from "@/components/event-session/Meeting"
import MeetingSetupScreen from "@/components/event-session/MeetingSetupScreen"
import EventSessionContext, {
  EventSessionProvider,
} from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import { createClient } from "@/utils/supabase/client"
import {
  DyteCameraToggle,
  DyteDialogManager,
  DyteMicToggle,
  DyteNameTag,
  DyteNotifications,
  DyteParticipantTile,
  DyteParticipantsAudio,
  DyteSetupScreen,
  provideDyteDesignSystem,
} from "@dytesdk/react-ui-kit"
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core"
import { useParams } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"

function EventSessionPage() {
  const meetingEl = useRef<HTMLDivElement>(null)
  const [meeting, initMeeting] = useDyteClient()
  const [roomJoined, setRoomJoined] = useState<boolean>(false)
  const { event, loading, error, meetingToken, isHost } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  useEffect(() => {
    if (!meetingToken) {
      console.log(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      )
      return
    }

    initMeeting({
      authToken: meetingToken,
      defaults: {
        audio: false,
        video: false,
      },
    })
  }, [meetingToken])

  useEffect(() => {
    if (!meeting) return

    const roomJoinedListener = () => {
      setRoomJoined(true)
    }
    const roomLeftListener = () => {
      setRoomJoined(false)
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
    provideDyteDesignSystem(meetingEl.current, {
      googleFont: "Poppins",
      theme: "light",
      colors: {
        danger: "#ffb31c",
        brand: {
          300: "#c6a6ff",
          400: "#9e77e0",
          500: "#754cba",
          600: "#4e288f",
          700: "#2e0773",
        },
        text: "#071428",
        "text-on-brand": "#ffffff",
        "video-bg": "#E5E7EB",
      },
      borderRadius: "rounded",
    })
  }, [])

  if (!meetingToken) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    )
  }

  return (
    <div ref={meetingEl}>
      <DyteProvider
        value={meeting}
        fallback={
          <div className="h-screen flex justify-center items-center">
            <Loading />
          </div>
        }
      >
        <Header event={event} meeting={meeting} />
        {!roomJoined ? <MeetingSetupScreen /> : <Meeting />}
      </DyteProvider>
    </div>
  )
}

export default EventSessionPage
