'use client'

import { useContext, useEffect, useState } from 'react'

import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteCameraToggle,
  DyteDialogManager,
  DyteMicToggle,
  DyteNameTag,
  DyteNotifications,
  DyteParticipantTile,
  DyteParticipantsAudio,
  DyteSettingsToggle,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { useParams } from 'next/navigation'

import { VideoBackgroundSettingsButtonWithModal } from './VideoBackgroundSettingsButtonWithModal'

import { Loading } from '@/components/common/Loading'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { useProfile } from '@/hooks/useProfile'
import { EventSessionContextType } from '@/types/event-session.type'

const micOn = `<svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 9C1 10.8565 1.7375 12.637 3.05025 13.9497C4.36301 15.2625 6.14348 16 8 16M8 16C9.85652 16 11.637 15.2625 12.9497 13.9497C14.2625 12.637 15 10.8565 15 9M8 16V20M4 20H12M5 4C5 3.20435 5.31607 2.44129 5.87868 1.87868C6.44129 1.31607 7.20435 1 8 1C8.79565 1 9.55871 1.31607 10.1213 1.87868C10.6839 2.44129 11 3.20435 11 4V9C11 9.79565 10.6839 10.5587 10.1213 11.1213C9.55871 11.6839 8.79565 12 8 12C7.20435 12 6.44129 11.6839 5.87868 11.1213C5.31607 10.5587 5 9.79565 5 9V4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


`
const micOff = `<svg width="56" height="39" viewBox="0 0 56 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1109_25)">
<path d="M19.5 2.5L34.5 17.5" stroke="#FF0000" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M24.5 4.16675C24.5 3.50371 24.7634 2.86782 25.2322 2.39898C25.7011 1.93014 26.337 1.66675 27 1.66675C27.663 1.66675 28.2989 1.93014 28.7678 2.39898C29.2366 2.86782 29.5 3.50371 29.5 4.16675V8.33341C29.5 8.58021 29.4635 8.82565 29.3917 9.06175M27.725 10.7284C27.3514 10.8416 26.9565 10.8658 26.5719 10.7989C26.1872 10.7321 25.8236 10.5761 25.5101 10.3434C25.1967 10.1108 24.942 9.80795 24.7666 9.4592C24.5912 9.11045 24.4999 8.72546 24.5 8.33508V7.50175" stroke="#FF0000" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.166 8.33325C21.1658 9.38604 21.4506 10.4193 21.99 11.3233C22.5295 12.2274 23.3036 12.9686 24.2302 13.4684C25.1568 13.9682 26.2013 14.2079 27.2531 14.1621C28.3049 14.1163 29.3247 13.7867 30.2043 13.2083M31.871 11.5416C32.4992 10.5896 32.8331 9.47378 32.831 8.33325" stroke="#FF0000" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.666 17.5H30.3327" stroke="#FF0000" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27 14.1667V17.5001" stroke="#FF0000" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<path d="M1.40909 23.3636H3.09091L7.04545 33.0227H7.18182L11.1364 23.3636H12.8182V35H11.5V26.1591H11.3864L7.75 35H6.47727L2.84091 26.1591H2.72727V35H1.40909V23.3636ZM15.4616 35V26.2727H16.8026V35H15.4616ZM16.1435 24.8182C15.8821 24.8182 15.6567 24.7292 15.4673 24.5511C15.2817 24.3731 15.1889 24.1591 15.1889 23.9091C15.1889 23.6591 15.2817 23.4451 15.4673 23.267C15.6567 23.089 15.8821 23 16.1435 23C16.4048 23 16.6283 23.089 16.8139 23.267C17.0033 23.4451 17.098 23.6591 17.098 23.9091C17.098 24.1591 17.0033 24.3731 16.8139 24.5511C16.6283 24.7292 16.4048 24.8182 16.1435 24.8182ZM22.804 35.1818C21.9858 35.1818 21.2813 34.9886 20.6903 34.6023C20.0994 34.2159 19.6449 33.6837 19.3267 33.0057C19.0085 32.3277 18.8494 31.553 18.8494 30.6818C18.8494 29.7955 19.0123 29.0133 19.3381 28.3352C19.6676 27.6534 20.1259 27.1212 20.7131 26.7386C21.304 26.3523 21.9934 26.1591 22.7812 26.1591C23.3949 26.1591 23.9479 26.2727 24.4403 26.5C24.9328 26.7273 25.3362 27.0455 25.6506 27.4545C25.965 27.8636 26.16 28.3409 26.2358 28.8864H24.8949C24.7926 28.4886 24.5653 28.1364 24.2131 27.8295C23.8646 27.5189 23.3949 27.3636 22.804 27.3636C22.2813 27.3636 21.8229 27.5 21.429 27.7727C21.0388 28.0417 20.7339 28.4223 20.5142 28.9148C20.2983 29.4034 20.1903 29.9773 20.1903 30.6364C20.1903 31.3106 20.2964 31.8977 20.5085 32.3977C20.7244 32.8977 21.0275 33.286 21.4176 33.5625C21.8116 33.839 22.2737 33.9773 22.804 33.9773C23.1525 33.9773 23.4688 33.9167 23.7528 33.7955C24.0369 33.6742 24.2775 33.5 24.4744 33.2727C24.6714 33.0455 24.8116 32.7727 24.8949 32.4545H26.2358C26.16 32.9697 25.9725 33.4337 25.6733 33.8466C25.3778 34.2557 24.9858 34.5814 24.4972 34.8239C24.0123 35.0625 23.4479 35.1818 22.804 35.1818ZM42.696 29.1818C42.696 30.4091 42.4744 31.4697 42.0312 32.3636C41.5881 33.2576 40.9801 33.947 40.2074 34.4318C39.4347 34.9167 38.5521 35.1591 37.5597 35.1591C36.5672 35.1591 35.6847 34.9167 34.9119 34.4318C34.1392 33.947 33.5313 33.2576 33.0881 32.3636C32.6449 31.4697 32.4233 30.4091 32.4233 29.1818C32.4233 27.9545 32.6449 26.8939 33.0881 26C33.5313 25.1061 34.1392 24.4167 34.9119 23.9318C35.6847 23.447 36.5672 23.2045 37.5597 23.2045C38.5521 23.2045 39.4347 23.447 40.2074 23.9318C40.9801 24.4167 41.5881 25.1061 42.0312 26C42.4744 26.8939 42.696 27.9545 42.696 29.1818ZM41.3324 29.1818C41.3324 28.1742 41.1638 27.3239 40.8267 26.6307C40.4934 25.9375 40.0407 25.4129 39.4688 25.0568C38.9006 24.7008 38.2642 24.5227 37.5597 24.5227C36.8551 24.5227 36.2169 24.7008 35.6449 25.0568C35.0767 25.4129 34.6241 25.9375 34.2869 26.6307C33.9536 27.3239 33.7869 28.1742 33.7869 29.1818C33.7869 30.1894 33.9536 31.0398 34.2869 31.733C34.6241 32.4261 35.0767 32.9508 35.6449 33.3068C36.2169 33.6629 36.8551 33.8409 37.5597 33.8409C38.2642 33.8409 38.9006 33.6629 39.4688 33.3068C40.0407 32.9508 40.4934 32.4261 40.8267 31.733C41.1638 31.0398 41.3324 30.1894 41.3324 29.1818ZM48.7699 26.2727V27.4091H44.0653V26.2727H48.7699ZM45.4744 35V25.0682C45.4744 24.5682 45.5919 24.1515 45.8267 23.8182C46.0616 23.4848 46.3665 23.2348 46.7415 23.0682C47.1165 22.9015 47.5123 22.8182 47.929 22.8182C48.2585 22.8182 48.5275 22.8447 48.7358 22.8977C48.9441 22.9508 49.0994 23 49.2017 23.0455L48.8153 24.2045C48.7472 24.1818 48.6525 24.1534 48.5312 24.1193C48.4138 24.0852 48.2585 24.0682 48.0653 24.0682C47.6222 24.0682 47.3021 24.1799 47.1051 24.4034C46.9119 24.6269 46.8153 24.9545 46.8153 25.3864V35H45.4744ZM54.5355 26.2727V27.4091H49.831V26.2727H54.5355ZM51.2401 35V25.0682C51.2401 24.5682 51.3575 24.1515 51.5923 23.8182C51.8272 23.4848 52.1321 23.2348 52.5071 23.0682C52.8821 22.9015 53.2779 22.8182 53.6946 22.8182C54.0241 22.8182 54.2931 22.8447 54.5014 22.8977C54.7098 22.9508 54.8651 23 54.9673 23.0455L54.581 24.2045C54.5128 24.1818 54.4181 24.1534 54.2969 24.1193C54.1795 24.0852 54.0241 24.0682 53.831 24.0682C53.3878 24.0682 53.0677 24.1799 52.8707 24.4034C52.6776 24.6269 52.581 24.9545 52.581 25.3864V35H51.2401Z" fill="white"/>
<defs>
<clipPath id="clip0_1109_25">
<rect width="20" height="20" fill="white" transform="translate(17)"/>
</clipPath>
</defs>
</svg>
`

export function MeetingSetupScreen() {
  const { data: profile } = useProfile()
  const { eventId } = useParams()
  const { event } = useEvent({
    id: eventId as string,
  })
  const selfParticipant = useDyteSelector((meeting) => meeting.self)
  const { meeting } = useDyteMeeting()
  const [name, setName] = useState<string>('')
  // const [isHost, setIsHost] = useState<boolean>(false)
  const { joinMeeting } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const [states, setStates] = useState({})

  useEffect(() => {
    const fullName = `${profile?.first_name} ${profile?.last_name}`

    if (selfParticipant && fullName) {
      selfParticipant.setName(fullName)
      setName(fullName)
    }
  }, [profile, selfParticipant])

  // useEffect(() => {
  //   if (!selfParticipant || !name) return

  //   selfParticipant.setName(name)
  // }, [name, selfParticipant])

  // useEffect(() => {
  //   if (!selfParticipant) return

  //   const preset = selfParticipant.presetName

  //   if (preset.includes('host')) {
  //     setIsHost(true)
  //   } else {
  //     // selfParticipant.disableAudio()
  //   }
  // }, [selfParticipant])

  const isHost = selfParticipant?.presetName?.includes('host') || false

  const handleJoinMeeting = async () => {
    meeting.join()
    joinMeeting?.()
  }

  if (!event || !meeting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setState = (s: any) => setStates((_states) => ({ ..._states, ...s }))
  console.log('meeting', selfParticipant.audioEnabled)
  console.log('meeting', selfParticipant.videoEnabled)

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
              <div className="absolute bottom-2 w-full flex justify-center items-center gap-2">
                <DyteMicToggle
                  iconPack={
                    {
                      mic_off: micOff,
                      mic_on: micOn,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any
                  }
                  size="sm"
                  meeting={meeting}
                />
                <DyteCameraToggle size="sm" meeting={meeting} />
                <DyteSettingsToggle
                  size="sm"
                  onClick={() => {
                    setStates({ activeSettings: true })
                  }}
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
            <button
              type="button"
              className="mt-2 outline-none p-2 rounded font-normal border-2 border-purple-500 bg-purple-500 text-white"
              onClick={handleJoinMeeting}>
              Join Meeting
            </button>
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
