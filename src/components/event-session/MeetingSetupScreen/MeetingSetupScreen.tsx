import { useEffect, useState } from 'react'

import { DyteDialogManager, DyteParticipantsAudio } from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { Link, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { SelfParticipantTile } from './SelfParticipantTile'
import { VideoControls } from './VideoControls'

import { NamesForm } from '@/components/auth/NamesForm'
import { BackgroundContainer } from '@/components/common/BackgroundContainer'
import { Loading } from '@/components/common/Loading'
import { LogoWithName } from '@/components/common/Logo'
import { UserMenu } from '@/components/common/UserMenu'
import { MeetingSetupParticipants } from '@/components/event-session/MeetingSetupParticipants'
import { Button } from '@/components/ui/Button'
import { useEnrollment } from '@/hooks/useEnrollment'
import { useEvent } from '@/hooks/useEvent'
import { useProfile } from '@/hooks/useProfile'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { getExistingOrCreateNewParticipantThunk } from '@/stores/thunks/participant.thunk'

export function MeetingSetupScreen() {
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isFetching: isFetchingProfile,
    isRequiredNames,
  } = useProfile()
  const dispatch = useStoreDispatch()
  const meetingSession = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.activeSession
  )
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({
    id: eventId as string,
  })
  const isParticipantLoading = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.participant.isLoading
  )
  const enrollmentQuery = useEnrollment()
  const selfParticipant = useDyteSelector((meeting) => meeting.self)
  const { meeting } = useDyteMeeting()
  const [name, setName] = useState<string>('')
  const [isHost, setIsHost] = useState<boolean>(false)

  const [states, setStates] = useState({})

  useEffect(() => {
    if (!profile?.first_name && !profile?.last_name) {
      return
    }

    const fullName = `${profile?.first_name} ${profile?.last_name}`

    setName(fullName)
  }, [profile])

  useEffect(() => {
    if (!selfParticipant || !name) return

    selfParticipant.setName(name)
  }, [name, selfParticipant])

  useEffect(() => {
    if (!selfParticipant) return

    const preset = selfParticipant.presetName

    if (preset.includes('host')) {
      setIsHost(true)
    } else {
      // selfParticipant.disableAudio()
    }
  }, [selfParticipant])

  const handleJoinMeeting = async () => {
    const response = await dispatch(
      getExistingOrCreateNewParticipantThunk({
        enrollmentId: enrollmentQuery.enrollment!.id,
        sessionId: meetingSession.data?.id || '',
      })
    )
    if (!response.payload) {
      toast.error('Failed to join meeting, please try again.')

      return
    }
    meeting.join()
  }

  selfParticipant?.setName(
    (profile?.first_name && `${profile?.first_name} ${profile?.last_name}`) ||
      'Participant'
  )

  if (isRequiredNames) {
    return <NamesForm />
  }

  if (!event || !meeting || isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setState = (s: any) => setStates((_states) => ({ ..._states, ...s }))

  return (
    <BackgroundContainer>
      <div className="flex flex-col h-full">
        <div className="w-full p-4 flex justify-between items-center">
          <Link to="/">
            <LogoWithName />
          </Link>
          <UserMenu />
        </div>
        <div className="flex-auto flex flex-col justify-center gap-12 w-4/5 max-w-5xl m-auto pb-16">
          <motion.h1
            className="text-5xl font-black text-white text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 100, y: 0 }}
            transition={{ duration: 0.3 }}>
            {event.name}
          </motion.h1>
          <div className="flex justify-center items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 100, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="relative flex flex-col justify-start gap-4 h-full w-3/5 max-w-lg">
              <SelfParticipantTile />
              <VideoControls
                onOpenSettings={() => setStates({ activeSettings: true })}
              />
            </motion.div>
            <div className="relative flex flex-col justify-center items-center h-full w-2/5">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 100, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-xl font-semibold text-white">
                Welcome, {name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 100, y: 0 }}
                transition={{ duration: 0.3, delay: 0.22 }}
                className="text-base text-gray-100">
                You are joining as{' '}
                <span className="font-semibold text-white underline">
                  {isHost ? ' Host' : 'Learner'}
                </span>
              </motion.p>
              <motion.input
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 100, y: 0 }}
                transition={{ duration: 0.3, delay: 0.24 }}
                disabled={!selfParticipant.permissions.canEditDisplayName}
                className="mt-8 w-4/5 outline-none p-2 rounded font-normal border-2 border-primary-500 bg-white"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 100, y: 0 }}
                transition={{ duration: 0.3, delay: 0.26 }}
                className="mt-4 w-4/5">
                <Button
                  size="md"
                  color="primary"
                  fullWidth
                  disabled={
                    !(meetingSession.isSuccess && enrollmentQuery.isSuccess)
                  }
                  isLoading={
                    meetingSession.isLoading ||
                    enrollmentQuery.isLoading ||
                    isFetchingProfile ||
                    isParticipantLoading ||
                    meeting.self.roomState === 'waitlisted'
                  }
                  onClick={handleJoinMeeting}>
                  {meeting.self.roomState === 'waitlisted'
                    ? 'Waiting to accept your request'
                    : 'Join Meeting'}
                </Button>
              </motion.div>
              <MeetingSetupParticipants />
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-center text-white">
            This is the screen where you will be able to join the meeting.
          </p>
        </div>
      </div>
      {/* Required Dyte Components */}
      <DyteParticipantsAudio meeting={meeting} />
      <DyteDialogManager
        meeting={meeting}
        states={states}
        onDyteStateUpdate={(e) => {
          setState({ ...states, ...e.detail })
        }}
      />
    </BackgroundContainer>
  )
}
