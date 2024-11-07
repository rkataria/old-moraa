import { useDispatch } from 'react-redux'

import { NoteToggle } from './NoteToggle'
import { ChatsToggle } from '../ChatsToggle'
import { MeetingRecordingButton } from '../MeetingRecordingButton'
import { MicToggle } from '../MicToggle'
import { ParticipantsToggle } from '../ParticipantsToggle'
import { RaiseHandToggle } from '../RaiseHandToggle'
import { ReactWithEmojiToggle } from '../ReactWithEmojiToggle'
import { ScreenShareToggle } from '../ScreenShareToggle'
import { VideoToggle } from '../VideoToggle'

import { AgendaPanelToggle } from '@/components/common/AgendaPanel/AgendaPanelToggle'
import { BreakoutButton } from '@/components/common/breakout/BreakoutButton'
import { PresentationControls } from '@/components/common/PresentationControls'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import {
  closeRightSidebarAction,
  setRightSidebarAction,
  toggleLeftSidebarAction,
} from '@/stores/slices/layout/live.slice'

export function Footer() {
  const { isHost, setDyteStates, dyteStates } = useEventSession()
  const { leftSidebarMode, rightSidebarMode } = useStoreSelector(
    (state) => state.layout.live
  )

  const dispatch = useDispatch()

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

  return (
    <div className="h-full w-full flex justify-between items-center px-2">
      <div className="flex-1 flex justify-start items-center gap-2 p-2 h-12">
        <div className="flex justify-start items-center gap-2">
          {isHost && (
            <div className="p-2 bg-white rounded-md">
              <AgendaPanelToggle
                collapsed={leftSidebarMode === 'collapsed'}
                onToggle={() => {
                  dispatch(toggleLeftSidebarAction())
                }}
              />
            </div>
          )}
          <PresentationControls />
        </div>
      </div>
      <div className="flex-auto flex justify-center items-center gap-2">
        <div className="flex justify-center items-center gap-2 p-2 bg-white rounded-md">
          <MicToggle />
          <VideoToggle />
          {isHost && <ScreenShareToggle />}
          <RaiseHandToggle />
          <ReactWithEmojiToggle />
          {isHost && (
            <>
              <div className="h-8 w-0.5 bg-gray-100 rounded-full mx-1" />
              <MeetingRecordingButton />
              <BreakoutButton />
            </>
          )}
        </div>
      </div>
      <div className="flex-1 flex justify-end items-center gap-2 p-2">
        <div className="flex justify-end items-center gap-2">
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
        </div>
      </div>
    </div>
  )
}
