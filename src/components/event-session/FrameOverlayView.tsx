/* eslint-disable react/button-has-type */
import { useContext } from 'react'

import { motion } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'

import { FramePreview } from '../common/FramePreview'
import { Button } from '../ui/Button'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import {
  EventSessionContextType,
  EventSessionMode,
} from '@/types/event-session.type'
import { ContentType } from '@/utils/content.util'
import { cn } from '@/utils/utils'

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
        className="relative w-[90%] aspect-video rounded-md shadow-2xl max-w-4xl"
        initial={{
          x: -20,
        }}
        animate={{
          x: 0,
        }}>
        <Button
          size="sm"
          variant="solid"
          color="primary"
          className="absolute right-0 -top-10 transition-all duration-300 ease-in-out"
          onClick={() => {
            dispatch(updateEventSessionModeAction(EventSessionMode.LOBBY))
          }}>
          Back to Lobby
        </Button>
        <FramePreview
          frame={currentFrame}
          isInteractive={false}
          className={cn('overflow-hidden rounded-md', {
            'p-0': currentFrame.type === ContentType.MORAA_SLIDE,
          })}
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
