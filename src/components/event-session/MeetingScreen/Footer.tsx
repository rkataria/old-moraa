import { DyteClock } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import toast from 'react-hot-toast'
import { LuClipboardEdit } from 'react-icons/lu'
import { useDispatch } from 'react-redux'

import { PresentationProgress } from './PresentationProgress'
import { ChatsToggle } from '../ChatsToggle'
import { MeetingRecordingButton } from '../MeetingRecordingButton'
import { MicToggle } from '../MicToggle'
import { ParticipantsToggle } from '../ParticipantsToggle'
import { RaiseHandToggle } from '../RaiseHandToggle'
import { ReactWithEmojiToggle } from '../ReactWithEmojiToggle'
import { ScreenShareToggle } from '../ScreenShareToggle'
import { VideoToggle } from '../VideoToggle'

import { BreakoutFooterButton } from '@/components/common/breakout/BreakoutFooterButton'
import { Tooltip } from '@/components/common/ShortuctTooltip'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import {
  closeRightSidebarAction,
  setRightSidebarAction,
} from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

export function Footer() {
  const { meeting } = useDyteMeeting()
  const { isHost, setDyteStates, dyteStates } = useEventSession()
  const { rightSidebarMode } = useStoreSelector((state) => state.layout.live)
  const currentFrame = useCurrentFrame()

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
      <div className="flex justify-start items-center gap-2 p-2 h-12">
        <div className="flex justify-start items-center gap-2">
          <DyteClock
            meeting={meeting}
            className="m-0 px-2 h-8 rounded-md live-button"
          />
          <PresentationProgress />
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <div className="flex justify-center items-center gap-2 p-2">
          <MicToggle />
          <VideoToggle />
          {isHost && <ScreenShareToggle />}
          <RaiseHandToggle />
          <ReactWithEmojiToggle />
          {isHost && (
            <>
              <BreakoutFooterButton />
              <MeetingRecordingButton />
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 p-2">
        <div className="flex justify-end items-center gap-2">
          {isHost && (
            <Tooltip label="Notes" actionKey="N" placement="top">
              <Button
                size="sm"
                isIconOnly
                variant="light"
                className={cn('live-button', {
                  active: rightSidebarMode === 'frame-notes',
                })}
                onClick={() => {
                  if (rightSidebarMode === 'frame-notes') {
                    dispatch(closeRightSidebarAction())
                  } else {
                    if (!currentFrame) {
                      toast.error('Select a frame to view notes')

                      return
                    }

                    dispatch(setRightSidebarAction('frame-notes'))
                  }
                }}>
                <LuClipboardEdit size={20} strokeWidth={1.7} />
              </Button>
            </Tooltip>
          )}
          <ParticipantsToggle
            isParticipantsSidebarOpen={rightSidebarMode === 'participants'}
            onClick={() => {
              handleSidebarOpen({
                activeSidebar: true,
                sidebar: 'participants',
              })
            }}
          />
          <ChatsToggle
            isChatsSidebarOpen={rightSidebarMode === 'chat'}
            onClick={() => {
              handleSidebarOpen({
                activeSidebar: true,
                sidebar: 'chat',
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}
