/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DyteClock } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { useParams } from '@tanstack/react-router'

import { MeetingStatusAlert } from './MeetingStatusAlert'
import { NoteToggle } from './NoteToggle'
import { ChatsToggle } from '../ChatsToggle'
import { ParticipantsToggle } from '../ParticipantsToggle'
import { Timer } from '../Timer'

import { AgendaPanelToggle } from '@/components/common/AgendaPanel/AgendaPanelToggle'
import { Logo } from '@/components/common/Logo'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useEvent } from '@/hooks/useEvent'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  closeRightSidebarAction,
  setRightSidebarAction,
  toggleLeftSidebarAction,
} from '@/stores/slices/layout/live.slice'

export function Header() {
  const { meeting: dyetMeeting } = useDyteMeeting()
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({ id: eventId as string })
  const { dyteStates, setDyteStates } = useEventSession()
  const dyteClient = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.dyte.dyteClient
  )
  const { permissions } = useEventPermissions()
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)
  const dispatch = useStoreDispatch()
  const { rightSidebarMode } = useStoreSelector((state) => state.layout.live)

  const handleSidebarOpen = (data: {
    sidebar: string
    activeSidebar: boolean
  }) => {
    if (rightSidebarMode === data.sidebar) {
      dispatch(closeRightSidebarAction())
      setDyteStates({
        ...dyteStates,
        [data.sidebar]: false,
      })

      return
    }

    if (['participants', 'chat', 'plugins'].includes(data.sidebar)) {
      setDyteStates(data)
      dispatch(setRightSidebarAction(data.sidebar))
    }
  }

  if (!event) return null

  return (
    <div className="h-full w-full flex justify-between items-center gap-4 px-4">
      <div className="flex-1 flex justify-start items-center gap-2 h-full">
        <div className="pr-1">
          {permissions.canAcessAllSessionControls ? (
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
        <div className="pr-2 pl-1 w-32 text-ellipsis font-medium flex justify-start items-center line-clamp-1">
          {dyteClient?.meta?.meetingTitle || event.name}
        </div>
        <DyteClock
          meeting={dyetMeeting}
          className="m-0 px-2 h-8 mr-2 font-thin"
        />
      </div>
      <div className="flex-auto">
        <MeetingStatusAlert />
      </div>
      <div className="flex-1 flex justify-end items-center gap-2 h-full">
        <Timer />
        <ChatsToggle
          isChatsSidebarOpen={rightSidebarMode === 'chat'}
          onClick={() => {
            handleSidebarOpen({
              activeSidebar: true,
              sidebar: 'chat',
            })
          }}
        />
        <ParticipantsToggle
          isParticipantsSidebarOpen={rightSidebarMode === 'participants'}
          onClick={() => {
            handleSidebarOpen({
              activeSidebar: true,
              sidebar: 'participants',
            })
          }}
        />
        <NoteToggle />
        {/* <UserMenu /> */}
      </div>
    </div>
  )
}
