/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import { EventSessionMode } from '@/types/event-session.type'

/* eslint-disable jsx-a11y/click-events-have-key-events */
export function MeetingStatusAlert() {
  const { eventSessionMode, startPresentation } = useEventSession()
  const dispatch = useStoreDispatch()
  const currentFrame = useCurrentFrame()

  const renderContent = () => {
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
            <strong
              className="cursor-pointer"
              onClick={() => {
                if (!currentFrame) return
                startPresentation(currentFrame.id)
              }}>
              Click to share
            </strong>{' '}
            or{' '}
            <strong
              className="cursor-pointer"
              onClick={() => {
                dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
              }}>
              Click to return to lobby
            </strong>
            .
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
            You are in <strong>presentation mode</strong>. Frames are shared
            with participants.
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="absolute left-[272px] top-0 h-full w-auto py-4">
      {renderContent()}
    </div>
  )
}
