/* eslint-disable import/no-extraneous-dependencies */
import { useCallback, useEffect, useRef } from 'react'

import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit'
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core'
import { DyteRecording } from '@dytesdk/recording-sdk'
import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'

import { Loading } from '@/components/common/Loading'
import { RecordingView } from '@/components/recording/RecordingView'
import { BreakoutManagerContextProvider } from '@/contexts/BreakoutManagerContext'
import { EventProvider } from '@/contexts/EventContext'
import { EventSessionProvider } from '@/contexts/EventSessionContext'
import { RealtimeChannelProvider } from '@/contexts/RealtimeChannelContext'
import { useSyncValueInRedux } from '@/hooks/syncValueInRedux'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  resetEventAction,
  setCurrentEventIdAction,
} from '@/stores/slices/event/current-event/event.slice'
import { resetFrameAction } from '@/stores/slices/event/current-event/frame.slice'
import {
  resetLiveSessionAction,
  setDyteClientAction,
} from '@/stores/slices/event/current-event/live-session.slice'
import { resetMeetingAction } from '@/stores/slices/event/current-event/meeting.slice'
import { resetMoraaSlideAction } from '@/stores/slices/event/current-event/moraa-slide.slice'
import { resetSectionAction } from '@/stores/slices/event/current-event/section.slice'
import { getEnrollmentThunk } from '@/stores/thunks/enrollment.thunk'
import { supabaseClient } from '@/utils/supabase/client'

export const Route = createFileRoute('/event-session/$eventId/record/')({
  component: RecordPage,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  beforeLoad: async () => {
    const session = await supabaseClient.auth.getSession()

    if (!session.data?.session?.user?.id) {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: import.meta.env.VITE_RECORDER_BOT_EMAIL,
        password: import.meta.env.VITE_RECORDER_BOT_PASSWORD,
      })

      if (error) {
        throw new Error('Failed to sign in with recording bot')
      }
    }
  },
})

export function RecordPage() {
  const { eventId } = useParams({
    strict: false,
  })

  const router = useRouter()
  const searchParams = router.latestLocation.search as {
    authToken: string
  }
  const { authToken } = searchParams

  const meetingEl = useRef<HTMLDivElement>(null)

  const [dyteClient, initDyteMeeting] = useDyteClient()
  const recordingSDK = new DyteRecording({
    devMode: false,
    autoStop: true,
  })

  const dispatch = useStoreDispatch()

  const isEventLoaded = useStoreSelector(
    (state) => state.event.currentEvent.eventState.event.isSuccess
  )
  const isMeetingLoaded = useStoreSelector(
    (state) => state.event.currentEvent.meetingState.meeting.isSuccess
  )

  useSyncValueInRedux({
    value: dyteClient,
    reduxStateSelector: (state) =>
      state.event.currentEvent.liveSessionState.dyte.dyteClient,
    actionFn: setDyteClientAction,
  })
  useSyncValueInRedux({
    value: eventId || null,
    reduxStateSelector: (state) => state.event.currentEvent.eventState.eventId,
    actionFn: setCurrentEventIdAction,
  })

  const resetMeeting = useCallback(() => {
    dispatch(resetEventAction())
    dispatch(resetMeetingAction())
    dispatch(resetSectionAction())
    dispatch(resetFrameAction())
    dispatch(resetMoraaSlideAction())
    dispatch(resetLiveSessionAction())
  }, [dispatch])

  useEffect(() => {
    if (!eventId) return

    dispatch(
      getEnrollmentThunk({
        eventId,
      })
    )

    // eslint-disable-next-line consistent-return
    return resetMeeting
  }, [dispatch, eventId, resetMeeting])

  useEffect(() => {
    if (eventId && dyteClient?.self.roomState === 'ended') {
      // recordingSDK.stopRecording()
      resetMeeting()
      dispatch(
        getEnrollmentThunk({
          eventId,
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, dyteClient?.self.roomState])

  useEffect(() => {
    async function setupDyteMeeting() {
      const meetingObj = await initDyteMeeting({
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

    if (!isEventLoaded || !isMeetingLoaded) return

    if (!dyteClient) {
      supabaseClient.auth.getSession().then((loggedIn) => {
        if (loggedIn) {
          setupDyteMeeting()
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dyteClient, authToken, isEventLoaded, isMeetingLoaded])

  if (meetingEl.current) {
    provideDyteDesignSystem(meetingEl.current, {
      googleFont: 'Outfit',
      theme: 'light',
      colors: {
        danger: '#e40909',
        brand: {
          300: '#b089f4',
          400: '#9661f1',
          500: '#7c3aed',
          600: '#632ebe',
          700: '#4a238e',
        },
        text: '#000000',
        'text-on-brand': '#ffffff',
        'video-bg': '#0c0618',
      },
      borderRadius: 'rounded',
    })
  }

  if (!authToken) {
    return <div className="outline-4 border-red-500">Auth token not found</div>
  }

  if (!eventId) {
    return <div className="outline-4 border-red-500">Event ID not found</div>
  }

  return (
    <DyteProvider
      value={dyteClient}
      fallback={
        <div className="h-screen flex flex-col justify-center items-center">
          <Loading message="Setting up recording" />
        </div>
      }>
      <RealtimeChannelProvider>
        <BreakoutManagerContextProvider>
          <EventProvider eventMode="present">
            <EventSessionProvider>
              <div className="recorder-container p-4">
                <RecordingView />
              </div>
            </EventSessionProvider>
          </EventProvider>
        </BreakoutManagerContextProvider>
      </RealtimeChannelProvider>
    </DyteProvider>
  )
}
