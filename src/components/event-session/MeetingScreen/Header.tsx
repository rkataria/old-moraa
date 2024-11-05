/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DyteClock } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { useParams } from '@tanstack/react-router'

import { MeetingStatusAlert } from './MeetingStatusAlert'
import { LeaveMeetingToggle } from '../LeaveMeetingToggle'
import { MediaSettingsToggle } from '../MediaSettingsToggle'
import { Timer } from '../Timer'

import { HelpButton } from '@/components/common/HelpButton'
import { Logo } from '@/components/common/Logo'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

export function Header() {
  const { meeting: dyetMeeting } = useDyteMeeting()
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({ id: eventId as string })
  const { dyteStates, setDyteStates } = useEventSession()
  const dyteClient = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.dyte.dyteClient
  )

  if (!event) return null

  return (
    <div className="h-full w-full flex justify-between items-center px-4">
      <div className="flex justify-end items-center gap-2 h-full">
        <div className="pr-4 border-r-2 border-gray-200">
          <Logo />
        </div>
        <div className="pr-4 pl-2 border-r-0 border-gray-200 text-base font-semibold">
          {dyteClient?.meta?.meetingTitle || event.name}
        </div>
        <DyteClock meeting={dyetMeeting} className="m-0 px-2 h-8" />
      </div>
      <MeetingStatusAlert />
      <div className="flex justify-end items-center gap-2 h-full">
        <Timer />
        <HelpButton
          buttonProps={{
            variant: 'light',
            className: cn('bg-transparent', {
              active: dyteStates.activeSettings,
            }),
          }}
        />

        <MediaSettingsToggle
          buttonProps={{
            variant: 'light',
            className: cn('bg-transparent', {
              active: dyteStates.activeSettings,
            }),
          }}
          onClick={() =>
            setDyteStates((prevDyteStates) => ({
              ...prevDyteStates,
              activeSettings: true,
            }))
          }
        />
        <LeaveMeetingToggle />
        {/* <UserMenu /> */}
      </div>
    </div>
  )
}
