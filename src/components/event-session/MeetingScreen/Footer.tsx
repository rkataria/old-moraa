import { useMemo } from 'react'

import { DyteClock } from '@dytesdk/react-ui-kit'
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { LuClipboardEdit } from 'react-icons/lu'
import { useDispatch } from 'react-redux'

import { ChatsToggle } from '../ChatsToggle'
import { MicToggle } from '../MicToggle'
import { ParticipantsToggle } from '../ParticipantsToggle'
import { RaiseHandToggle } from '../RaiseHandToggle'
import { ReactWithEmojiToggle } from '../ReactWithEmojiToggle'
import { ScreenShareToggle } from '../ScreenShareToggle'
import { VideoToggle } from '../VideoToggle'
import { WidgetsToggle } from '../WidgetsToggle'

import { Tooltip } from '@/components/common/ShortuctTooltip'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import {
  closeRightSidebarAction,
  setRightSidebarAction,
} from '@/stores/slices/layout/live.slice'
import { EventSessionMode } from '@/types/event-session.type'
import { cn, getFrameCount } from '@/utils/utils'

export function Footer() {
  const { meeting } = useDyteMeeting()
  const { sections } = useEventContext()
  const { isHost, setDyteStates, dyteStates, currentFrame } = useEventSession()
  const { rightSidebarMode } = useStoreSelector((state) => state.layout.live)
  const { isOverviewOpen } = useStoreSelector(
    (store) => store.event.currentEvent.eventState
  )
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
    if (!currentFrame) return 0

    const frameIds = sections
      .flat(2)
      .map((f) => f.frames)
      .flat(2)
      .map((f) => f.id)

    return frameIds.indexOf(currentFrame.id)
  }, [sections, currentFrame])

  const getProgress = () => {
    if (isOverviewOpen) return 0

    return `${((currentFrameIndex + 1) / frameCount) * 100}%`
  }

  const getProgressText = () => {
    if (eventSessionMode === EventSessionMode.LOBBY) return 'Lobby'

    if (eventSessionMode === EventSessionMode.PEEK) return 'Peek'

    if (isOverviewOpen) return 'Overview'

    return `(${currentFrameIndex + 1}/${frameCount}) ${currentFrame?.name}`
  }

  return (
    <div className="h-full w-full flex justify-between items-center px-2">
      <div className="flex justify-start items-center gap-2 bg-white p-2 rounded-md shadow-2xl h-12">
        <div className="flex justify-start items-center gap-2">
          <DyteClock meeting={meeting} className="m-0 px-2" />
          {eventSessionMode === EventSessionMode.PRESENTATION && (
            <div
              className="relative h-8 w-64 flex justify-start gap-2 px-2 items-center bg-gray-100 rounded-md overflow-hidden after:contents-[''] after:absolute after:left-0 after:top-0 after:h-full after:bg-primary/20 after:transition-all after:duration-300 after:w-[var(--frame-progress-width)]"
              style={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                '--frame-progress-width': getProgress(),
              }}>
              {getProgressText()}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <div className="flex justify-center items-center gap-2 bg-white p-2 rounded-md shadow-2xl">
          <MicToggle />
          <VideoToggle />
          {isHost && <ScreenShareToggle />}
          <RaiseHandToggle />
          <ReactWithEmojiToggle />
          {isHost && <WidgetsToggle />}
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 bg-white p-2 rounded-md shadow-2xl">
        <div className="flex justify-end items-center gap-2">
          {isHost && (
            <Tooltip label="Notes" actionKey="N" placement="top">
              <Button
                size="sm"
                isIconOnly
                variant="light"
                className={cn('bg-transparent hover:bg-black/10', {
                  'bg-primary text-white hover:bg-primary/80':
                    rightSidebarMode === 'frame-notes',
                })}
                onClick={() => {
                  if (rightSidebarMode === 'frame-notes') {
                    dispatch(closeRightSidebarAction())
                  } else {
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
