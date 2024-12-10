/* eslint-disable import/no-extraneous-dependencies */
import { useEffect } from 'react'

import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core'
import { DyteRecording } from '@dytesdk/recording-sdk'
import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'

import { RecordingView } from '@/components/recording/RecordingView'
import { supabaseClient } from '@/utils/supabase/client'

export const Route = createFileRoute('/event-session/$eventId/record/')({
  component: RecordPage,
})

export function RecordPage() {
  const [meeting, initMeeting] = useDyteClient()
  const { eventId } = useParams({
    strict: false,
  })
  const router = useRouter()
  const searchParams = router.latestLocation.search as {
    authToken: string
  }
  const { authToken } = searchParams

  useEffect(() => {
    async function loginAnonymously() {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: 'recording-bot@yopmail.com',
        password: 'letmepass',
      })

      if (error) {
        console.error(error)

        return false
      }

      return true
    }
    async function setupDyteMeeting() {
      const recordingSDK = new DyteRecording({
        devMode: false,
      })
      const meetingObj = await initMeeting({
        authToken,
        defaults: {
          video: false,
          audio: false,
        },
      })
      if (!meetingObj) {
        return
      }
      await recordingSDK.init(meetingObj)
      recordingSDK.startRecording()
    }
    if (!meeting) {
      loginAnonymously().then((loggedIn) => {
        if (loggedIn) {
          setupDyteMeeting()
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting, authToken])

  if (!authToken) {
    return <div>Auth token not found</div>
  }

  if (!eventId) return <div>Event ID not found</div>

  return (
    <DyteProvider
      value={meeting}
      fallback={
        <div className="w-full h-screen flex justify-center items-center text-2xl">
          Loading...
        </div>
      }>
      <RecordingView />
    </DyteProvider>
  )
}
