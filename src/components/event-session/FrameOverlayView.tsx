/* eslint-disable react/button-has-type */
import { useContext } from 'react'

import { motion } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'

import { FramePreview } from '../common/FramePreview'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import {
  EventSessionContextType,
  EventSessionMode,
} from '@/types/event-session.type'

export function FrameOverlayView() {
  const { currentFrame, isHost } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const dispatch = useStoreDispatch()
  const eventSessionMode = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.eventSessionMode
  )
  // TODO: Fix click away to close the overlay
  // const previousFrameRef = useRef<IFrame | null>(currentFrame)
  // const overlayRef = useClickAway(() => {
  //   if (previousFrameRef.current !== currentFrame) return
  //   dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
  // }) as MutableRefObject<HTMLDivElement>

  useHotkeys('esc', () =>
    dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
  )

  if (!currentFrame) return null

  if (!isHost) return null

  if (eventSessionMode !== EventSessionMode.PREVIEW) return null

  return (
    <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center px-4">
      <div className="absolute left-0 top-0 w-full h-full bg-primary/20 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md" />

      <motion.div
        key={currentFrame.id}
        // ref={overlayRef}
        className="relative w-[90%] aspect-video rounded-md shadow-2xl"
        initial={{
          x: -50,
        }}
        animate={{
          x: 0,
        }}>
        <button
          className="absolute right-0 -top-6 bg-transparent text-white hover:text-primary transition-all duration-300 ease-in-out"
          onClick={() => {
            dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
          }}>
          Back to Lobby
        </button>
        <FramePreview
          frame={currentFrame}
          isInteractive={false}
          className="overflow-hidden p-0 rounded-md"
        />
        {/* <FrameControls
          onPrevious={previousFrame}
          onNext={nextFrame}
          switchPublishedFrames={false}
        /> */}
      </motion.div>
    </div>
  )
}
