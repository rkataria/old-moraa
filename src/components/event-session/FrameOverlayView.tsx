/* eslint-disable react/button-has-type */

import { motion } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'

import { FramePreview } from '../common/FramePreview'
import { SectionOverview } from '../common/SectionOverview'
import { Button } from '../ui/Button'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateEventSessionModeAction } from '@/stores/slices/event/current-event/live-session.slice'
import { EventSessionMode } from '@/types/event-session.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function FrameOverlayView() {
  const { currentFrame, isHost } = useEventSession()
  const dispatch = useStoreDispatch()
  const eventSessionMode = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.eventSessionMode
  )
  const currentSectionId = useStoreSelector(
    (state) => state.event.currentEvent.eventState.currentSectionId
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

  if (!currentFrame && !currentSectionId) return null

  if (!isHost) return null

  if (eventSessionMode !== EventSessionMode.PEEK) return null

  const renderContent = () => {
    if (currentSectionId) {
      return (
        <div className="bg-white h-full w-full rounded-md">
          <SectionOverview />
        </div>
      )
    }

    if (!currentFrame) return null

    return (
      <FramePreview
        asThumbnail={[FrameType.GOOGLE_SLIDES].includes(currentFrame.type)}
        frame={currentFrame}
        isInteractive={false}
        className={cn('overflow-hidden rounded-md', {
          'p-0': [
            FrameType.MORAA_SLIDE,
            FrameType.GOOGLE_SLIDES,
            FrameType.PDF_VIEWER,
          ].includes(currentFrame.type),
        })}
      />
    )
  }

  return (
    <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center px-4 bg-black bg-opacity-60 rounded-md backdrop-blur-3xl">
      <div className="absolute left-0 top-0 w-full h-full rounded-md" />

      <motion.div
        key={currentFrame?.id ?? currentSectionId}
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
        {renderContent()}
      </motion.div>
    </div>
  )
}
