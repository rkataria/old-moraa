/* eslint-disable jsx-a11y/no-static-element-interactions */

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import { EventSessionMode } from '@/types/event-session.type'
import { FrameType } from '@/utils/frame-picker.util'

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

  const renderContent = () => {
    if (isHost && isBreakoutStarted) {
      return (
        <div
          className="flex items-center p-4 py-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert">
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            You&apos;ve started <strong>breakout</strong> session.{' '}
            <RenderIf isTrue={!!visibleBackToBreakout}>
              <Button
                className="bg-danger-500 text-white mx-2 h-6"
                onClick={() => {
                  setCurrentFrame(
                    getFrameById(sessionBreakoutFrameId as string)
                  )
                }}>
                Return to Breakout
              </Button>
            </RenderIf>
          </div>
        </div>
      )
    }
    if (isInBreakoutMeeting) {
      return (
        <div
          className="flex items-center p-4 py-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert">
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            <RenderIf isTrue={!isHost}>
              You are in <strong>breakout</strong>.
            </RenderIf>
            <RenderIf isTrue={isHost}>
              <strong>Breakout</strong> session has started.
            </RenderIf>
          </div>
        </div>
      )
    }
    if (eventSessionMode === EventSessionMode.PEEK) {
      return (
        <div
          className="flex items-center p-4 py-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert">
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            You are in <strong>peek mode</strong>. Frames are not being shared
            with participants.{' '}
            <RenderIf isTrue={!currentFrame}>
              Select a frame to start presentation.
            </RenderIf>
            <RenderIf isTrue={!!currentFrame}>
              <Button
                className="bg-primary text-white mx-2 h-6"
                onClick={() => {
                  if (!currentFrame) return
                  startPresentation(currentFrame.id)
                }}>
                Share Frame
              </Button>
              or
            </RenderIf>
            <Button
              className="bg-red-500 text-white mx-2 h-6"
              onClick={() => {
                dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
              }}>
              Go to Lobby
            </Button>
          </div>
        </div>
      )
    }

    if (eventSessionMode === EventSessionMode.PRESENTATION) {
      return (
        <div
          className="flex items-center p-4 py-2 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert">
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            You are in <strong>presentation mode</strong>.{' '}
            <RenderIf isTrue={currentFrame?.type === FrameType.BREAKOUT}>
              This is a breakout frame.
            </RenderIf>
            <RenderIf
              isTrue={!!(currentFrame?.type === FrameType.BREAKOUT && isHost)}>
              You can {isBreakoutStarted ? 'end' : 'start'} a breakout session
              from bottom.
            </RenderIf>
          </div>
        </div>
      )
    }

    return null
  }

  return <div className="w-auto py-2">{renderContent()}</div>
}
