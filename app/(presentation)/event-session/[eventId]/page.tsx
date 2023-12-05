"use client"
import Loading from "@/components/common/Loading"
import SlideManagerWithProvider from "@/components/slides/SlideManagerWithProvider"
import EventSessionProvider from "@/contexts/EventSessionContext"
import { createClient } from "@/utils/supabase/client"
import {
  DyteAudioVisualizer,
  DyteLeaveButton,
  DyteMeeting,
  DyteNameTag,
  DyteNotifications,
  DyteParticipantTile,
  DyteSetupScreen,
} from "@dytesdk/react-ui-kit"
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

function Meeting() {
  const [meetingToken, setMeetingToken] = useState<string>("")
  const [meeting, initMeeting] = useDyteClient()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const getEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("event")
          .select("*")
          .eq("id", params.eventId)

        if (error) {
          console.error(error)
          setError(error.message)
          return
        }
        setEvent(data[0])
      } catch (error: any) {
        console.error(error)
        setError(error.message)
      }
    }
    getEvent()
  }, [params.eventId])

  useEffect(() => {
    const getEnrollment = async () => {
      try {
        const currentUser = await supabase.auth.getSession()
        const { data, error } = await supabase
          .from("enrollment")
          .select("*")
          .eq("event_id", params.eventId)
          .eq("user_id", currentUser.data.session?.user.id)

        console.log("data", data, currentUser.data.session?.user.id)
        if (error) {
          console.error(error)
          setError(error.message)
          return
        }
        setMeetingToken(data[0].meeting_token)
        setLoading(false)
      } catch (error: any) {
        console.error(error)
        setError(error.message)
      }
    }
    getEnrollment()
  }, [event?.meeting_id])

  useEffect(() => {
    initMeeting({
      authToken: meetingToken,
      defaults: {
        audio: false,
        video: false,
      },
    })
  }, [meetingToken])

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>{error}</p>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>No meeting found</p>
      </div>
    )
  }

  return (
    <EventSessionProvider>
      <DyteProvider
        value={meeting}
        fallback={
          <div className="h-screen flex justify-center items-center">
            <Loading />
          </div>
        }
      >
        <div>
          <DyteLeaveButton size="sm" onClick={() => meeting.leave()} />
        </div>
        <div>
          <div className="fixed right-0 top-0 w-72 h-full bg-white pt-16">
            <DyteMeeting meeting={meeting} mode="fill" />
            {/* <div className="p-4 flex justify-start flex-col items-center">
              <DyteParticipantTile
                participant={meeting.self}
                nameTagPosition="bottom-center"
                className="h-36 aspect-video"
              ></DyteParticipantTile>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <DyteParticipantTile
                participant={meeting.self}
                nameTagPosition="bottom-center"
                className="w-full h-auto aspect-video"
              ></DyteParticipantTile>
              <DyteParticipantTile
                participant={meeting.self}
                nameTagPosition="bottom-center"
                className="w-full h-auto aspect-video"
              ></DyteParticipantTile>
              <DyteParticipantTile
                participant={meeting.self}
                nameTagPosition="bottom-center"
                className="w-full h-auto aspect-video"
              ></DyteParticipantTile>
              <DyteParticipantTile
                participant={meeting.self}
                nameTagPosition="bottom-center"
                className="w-full h-auto aspect-video"
              ></DyteParticipantTile>
            </div> */}
          </div>
        </div>
      </DyteProvider>
    </EventSessionProvider>
  )
}

export default Meeting
