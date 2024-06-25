'use client'

import { useContext, useEffect, useState } from 'react'

import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteDialogManager,
  DyteNameTag,
  DyteNotifications,
  DyteParticipantTile,
  DyteParticipantsAudio,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { useParams } from 'next/navigation'

import { Button } from '@nextui-org/react'

import { MediaSettingsToggle } from './MediaSettingsToggle'
import { MicToggle } from './MicToggle'
import { VideoBackgroundSettingsButtonWithModal } from './VideoBackgroundSettingsButtonWithModal'
import { VideoToggle } from './VideoToggle'
import { NamesForm } from '../auth/NamesForm'

import { Loading } from '@/components/common/Loading'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { useProfile } from '@/hooks/useProfile'
import { EventSessionContextType } from '@/types/event-session.type'

export function MeetingSetupScreen() {
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isRequiredNames,
  } = useProfile()
  const { eventId } = useParams()
  const { event } = useEvent({
    id: eventId as string,
  })
  const selfParticipant = useDyteSelector((meeting) => meeting.self)
  const { meeting } = useDyteMeeting()
  const [name, setName] = useState<string>('')
  const [isHost, setIsHost] = useState<boolean>(false)
  const { joinMeeting } = useContext(
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

  const handleJoinMeeting = async () => {
    meeting.join()
    joinMeeting?.()
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
            <DyteParticipantTile
              meeting={meeting}
              participant={selfParticipant}
              className="relative">
              {!profile?.avatar_url ? (
                <DyteAvatar size="md" participant={selfParticipant} />
              ) : (
                <span className="flex h-28 w-28">
                  <img
                    className="rounded-full"
                    src={profile?.avatar_url}
                    alt=""
                  />
                </span>
              )}
              <div className="absolute top-2 left-2">
                <DyteNameTag meeting={meeting} participant={selfParticipant}>
                  <DyteAudioVisualizer
                    size="sm"
                    slot="start"
                    participant={selfParticipant}
                  />
                </DyteNameTag>
              </div>
              <div className="absolute bottom-2 w-full flex justify-center items-center gap-2">
                <MicToggle className="bg-white" />
                <VideoToggle className="bg-white" />
                <MediaSettingsToggle
                  className="bg-white"
                  onClick={() => setStates({ activeSettings: true })}
                />
              </div>
              <VideoBackgroundSettingsButtonWithModal
                buttonProps={{
                  className: 'absolute top-2 right-2',
                }}
              />
            </DyteParticipantTile>
          </div>
        </div>
        <div className="flex flex-col justify-start w-1/2 m-8">
          <div className="w-1/2 flex text-center flex-col min-w-[300px]">
            <h2 className="mt-2 font-semibold">Welcome {name}!</h2>
            <p className="mt-2 text-purple-500">
              {isHost
                ? 'You are joining as Host'
                : 'You are joining as Learner'}
            </p>
            <input
              disabled={
                !selfParticipant.permissions.canEditDisplayName ?? false
              }
              className="mt-2 outline-none p-2 rounded font-normal border-2 border-purple-500 bg-white"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
            <Button
              className="bg-black text-white mt-2"
              onClick={handleJoinMeeting}>
              Join Meeting
            </Button>
          </div>
        </div>
      </div>

      {/* Required Dyte Components */}
      <DyteParticipantsAudio meeting={meeting} />
      <DyteNotifications meeting={meeting} />
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
