/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DyteClock } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { useParams } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'

import { MeetingStatusAlert } from './MeetingStatusAlert'
import { LeaveMeetingToggle } from '../LeaveMeetingToggle'
import { MediaSettingsToggle } from '../MediaSettingsToggle'
import { Timer } from '../Timer'

import { AgendaPanelToggle } from '@/components/common/AgendaPanel/AgendaPanelToggle'
import { HelpButton } from '@/components/common/HelpButton'
import { Logo } from '@/components/common/Logo'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { useStoreSelector } from '@/hooks/useRedux'
import { toggleLeftSidebarAction } from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

export function Header() {
  const { meeting: dyetMeeting } = useDyteMeeting()
  const dispatch = useDispatch()
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({ id: eventId as string })
  const { dyteStates, setDyteStates, isHost } = useEventSession()
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)
  const dyteClient = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.dyte.dyteClient
  )

  if (!event) return null

  return (
    <div className="h-full w-full flex justify-between items-center px-4">
      <div className="flex justify-end items-center gap-2 h-full">
        <div className="pr-4 border-r-2 border-gray-200">
          {isHost ? (
            <AgendaPanelToggle
              collapsed={leftSidebarMode === 'collapsed'}
              onToggle={() => {
                dispatch(toggleLeftSidebarAction())
              }}
            />
          ) : (
            <Logo />
          )}
        </div>
        <div className="pr-4 pl-2 border-r-0 border-gray-200 text-md font-semibold">
          {dyteClient?.meta?.meetingTitle || event.name}
        </div>
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
        <DyteClock meeting={dyetMeeting} className="m-0 px-2 h-8" />
        <LeaveMeetingToggle />
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
        {/* <UserMenu /> */}
      </div>
    </div>
  )
}
