import { useMemo } from 'react'

import { DyteClock } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import toast from 'react-hot-toast'
import { LuClipboardEdit } from 'react-icons/lu'
import { useDispatch } from 'react-redux'

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
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import {
  closeRightSidebarAction,
  setRightSidebarAction,
} from '@/stores/slices/layout/live.slice'
import { EventSessionMode } from '@/types/event-session.type'
import { cn, getFrameCount } from '@/utils/utils'

export function Footer() {
  const { meeting } = useDyteMeeting()
  const { sections } = useEventContext()
  const { isHost, setDyteStates, dyteStates } = useEventSession()
  const { rightSidebarMode } = useStoreSelector((state) => state.layout.live)
  const { isOverviewOpen, currentSectionId } = useStoreSelector(
    (store) => store.event.currentEvent.eventState
  )
  const currentFrame = useCurrentFrame()
  const { eventSessionMode } = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState
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

  const frameCount = useMemo(() => getFrameCount(sections), [sections])
  const currentFrameIndex = useMemo(() => {
    if (!currentFrame) return -1

    const frameIds = sections
      .flat(2)
      .map((f) => f.frames)
      .flat(2)
      .map((f) => f.id)

    return frameIds.indexOf(currentFrame.id)
  }, [sections, currentFrame])

  const getProgressWidth = () => {
    if (isOverviewOpen) return 0

    if (currentFrameIndex === -1) return 0

    if (currentFrameIndex === frameCount - 1) return '100%'

    return `${((currentFrameIndex + 1) / frameCount) * 100}%`
  }

  const getProgressText = () => {
    if (currentSectionId) {
      return sections.find((s) => s.id === currentSectionId)?.name
    }

    return `(${currentFrameIndex + 1}/${frameCount}) ${currentFrame?.name}`
  }

  const renderProgress = () => {
    if (isHost || eventSessionMode === EventSessionMode.PRESENTATION) {
      return (
        <div
          className="relative h-8 w-64 flex justify-start gap-2 px-2 items-center rounded-md overflow-hidden live-button after:contents-[''] after:absolute after:left-0 after:top-0 after:h-full after:bg-black/10 after:transition-all after:duration-300 after:w-[var(--frame-progress-width)] after:z-0"
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            '--frame-progress-width': getProgressWidth(),
          }}>
          <span className="z-[1]">{getProgressText()}</span>
        </div>
      )
    }

    return null
  }

  return (
    <div className="h-full w-full flex justify-between items-center px-2">
      <div className="flex justify-start items-center gap-2 p-2 h-12">
        <div className="flex justify-start items-center gap-2">
          <DyteClock
            meeting={meeting}
            className="m-0 px-2 h-8 rounded-md live-button"
          />
          {renderProgress()}
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
