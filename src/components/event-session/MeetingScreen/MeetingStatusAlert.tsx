/* eslint-disable jsx-a11y/no-static-element-interactions */

import { motion } from 'framer-motion'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import { EventSessionMode } from '@/types/event-session.type'

/* eslint-disable jsx-a11y/click-events-have-key-events */
export function MeetingStatusAlert() {
  const { eventSessionMode, startPresentation, isHost } = useEventSession()
  const { setCurrentFrame, getFrameById } = useEventContext()
  const dispatch = useStoreDispatch()
  const currentFrame = useCurrentFrame()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )
  const isBreakoutStarted = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isBreakoutActive
  )

  const sessionBreakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId || null
  )

  const visibleBackToBreakout =
    sessionBreakoutFrameId && sessionBreakoutFrameId !== currentFrame?.id

  if (isHost && isBreakoutStarted) {
    return (
      <MeetingStatusAlertContainer
        title="Breakout Session"
        description={
          isHost
            ? 'Breakout session started'
            : 'Breakout session started by host'
        }
        actions={[
          <RenderIf isTrue={!!visibleBackToBreakout}>
            <Button
              className="bg-danger-500 text-white mx-2 h-6"
              onClick={() => {
                setCurrentFrame(getFrameById(sessionBreakoutFrameId as string))
              }}>
              View Breakout
            </Button>
          </RenderIf>,
        ]}
      />
    )
  }
  if (isInBreakoutMeeting) {
    return (
      <MeetingStatusAlertContainer
        title="Breakout Session"
        description="You are in a breakout session and you can see the shared frames."
      />
    )
  }
  if (eventSessionMode === EventSessionMode.PEEK) {
    return (
      <MeetingStatusAlertContainer
        title="Peek Mode"
        description="Frames are not being shared with participants."
        actions={[
          <RenderIf isTrue={!!currentFrame}>
            <Button
              variant="bordered"
              color="primary"
              onClick={() => {
                if (!currentFrame) return
                startPresentation(currentFrame.id)
              }}>
              Share Frame
            </Button>
          </RenderIf>,
          <Button
            color="danger"
            onClick={() => {
              dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
            }}>
            Go to Lobby
          </Button>,
        ]}
      />
    )
  }

  return null
}

function MeetingStatusAlertContainer({
  title,
  description,
  actions,
}: {
  title?: string
  description?: string
  actions?: React.ReactNode[]
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.3,
      }}
      className="w-fit max-w-[50vw] py-2 px-4 mt-1 mx-auto flex justify-start items-center gap-8 bg-white rounded-md">
      <div className="flex flex-col gap-1 flex-auto">
        {title && <span className="text-sm font-semibold">{title}</span>}
        {description && (
          <p className="text-xs text-gray-700 line-clamp-1">{description}</p>
        )}
      </div>
      <div className="flex justify-end items-center gap-2 flex-1">
        {actions}
      </div>
    </motion.div>
  )
}
