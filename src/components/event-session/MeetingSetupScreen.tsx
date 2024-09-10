import { useContext, useEffect, useState } from 'react'

import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteDialogManager,
  DyteNameTag,
  DyteParticipantTile,
  DyteParticipantsAudio,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { useParams, useRouter } from '@tanstack/react-router'
import { IoMdArrowBack } from 'react-icons/io'

import { MediaSettingsToggle } from './MediaSettingsToggle'
import { MeetingSetupParticipants } from './MeetingSetupParticipants'
import { MicToggle } from './MicToggle'
import { VideoBackgroundSettingsButtonWithModal } from './VideoBackgroundSettingsButtonWithModal'
import { VideoToggle } from './VideoToggle'
import { NamesForm } from '../auth/NamesForm'
import { Button } from '../ui/Button'

import { Loading } from '@/components/common/Loading'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { useProfile } from '@/hooks/useProfile'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  getExistingOrCreateNewActiveSessionThunk,
  getMeetingSessionThunk,
} from '@/stores/thunks/session.thunk'
import { EventSessionContextType } from '@/types/event-session.type'

export function MeetingSetupScreen() {
  const router = useRouter()
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isRequiredNames,
  } = useProfile()
  const dispatch = useStoreDispatch()
  const isMeetingOwner = useStoreSelector(
    (state) => state.event.currentEvent.eventState.isCurrentUserOwnerOfEvent
  )
  const meetingId = useStoreSelector(
    (state) => state.event.currentEvent.meetingState.meeting.data?.id
  )
  const meetingSession = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.activeSession
  )
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({
    id: eventId as string,
  })
  const selfParticipant = useDyteSelector((meeting) => meeting.self)
  const { meeting } = useDyteMeeting()
  const [name, setName] = useState<string>('')
  const [isHost, setIsHost] = useState<boolean>(false)
  const { addParticipant } = useContext(
    EventSessionContext
  ) as EventSessionContextType
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

  useEffect(() => {
    if (!meetingId || isMeetingOwner === null) return
    if (meetingSession.isSuccess) return
    if (isMeetingOwner) {
      dispatch(getExistingOrCreateNewActiveSessionThunk(meetingId))
    } else dispatch(getMeetingSessionThunk({ meetingId }))
  }, [dispatch, isMeetingOwner, meetingId, meetingSession.isSuccess])

  const handleJoinMeeting = async () => {
    meeting.join()
    addParticipant?.()
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
    <div className="w-full h-screen flex flex-col justify-start items-center gap-4 pt-36 bg-pattern-1">
      <Button
        size="sm"
        className="fixed top-6 left-6 bg-transparent"
        onClick={() => {
          router.navigate({
            to: `/events/${eventId}`,
          })
        }}>
        <IoMdArrowBack />
        <span>Back</span>
      </Button>
      <div className="mb-12">
        <h1 className="mb-2 text-5xl font-black text-center">{event.name}</h1>
        {event.description && (
          <p className="text-center text-gray-500">{event.description}</p>
        )}
      </div>
      <div className="flex justify-center items-center gap-4">
        <div className="relative">
          <DyteParticipantTile
            meeting={meeting}
            participant={selfParticipant}
            className="relative">
            <DyteAvatar size="md" participant={selfParticipant} />
            <div className="absolute top-2 left-2">
              <DyteNameTag meeting={meeting} participant={selfParticipant}>
                <DyteAudioVisualizer
                  size="sm"
                  slot="start"
                  participant={selfParticipant}
                />
              </DyteNameTag>
            </div>

            <VideoBackgroundSettingsButtonWithModal
              buttonProps={{
                className: 'absolute top-2 right-2',
              }}
            />
          </DyteParticipantTile>
          <div className="w-full flex justify-center items-center gap-2 mt-4">
            <MicToggle className="bg-black text-white w-10 h-10 rounded-md" />
            <VideoToggle className="bg-black text-white w-10 h-10 rounded-md" />
            <MediaSettingsToggle
              className="bg-black text-white w-10 h-10 rounded-md"
              onClick={() => setStates({ activeSettings: true })}
            />
          </div>
        </div>
        <div className="flex flex-col justify-start w-1/2 m-8">
          <div className="w-1/2 flex text-center flex-col min-w-[300px]">
            <h2 className="mt-2 font-semibold">Welcome {name}!</h2>
            <p className="mt-2 text-primary-500">
              {isHost
                ? 'You are joining as Host'
                : 'You are joining as Learner'}
            </p>
            <input
              disabled={!selfParticipant.permissions.canEditDisplayName}
              className="mt-2 outline-none p-2 rounded font-normal border-2 border-primary-500 bg-white"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />

            <Button
              size="md"
              className="mt-2"
              color="primary"
              disabled={meetingSession.isLoading}
              onClick={handleJoinMeeting}>
              Join Meeting
            </Button>

            <MeetingSetupParticipants />
          </div>
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
    </div>
  )
}
