import { AnimatePresence, motion } from 'framer-motion'

import { MoreActions } from './MoreActions'
import { AppsToggle } from '../AppsToggle'
import { LeaveMeetingToggle } from '../LeaveMeetingToggle'
import { MicToggle } from '../MicToggle'
import { EchoPlayer } from '../Music/EchoPlayer'
import { MusicPlayer } from '../Music/MusicPlayer'
import { RaiseHandToggle } from '../RaiseHandToggle'
import { ReactWithEmojiToggle } from '../ReactWithEmojiToggle'
import { ScreenShareToggle } from '../ScreenShareToggle'
import { VideoToggle } from '../VideoToggle'

import { ContentTypeIcon } from '@/components/common/ContentTypeIcon'
import { PresentationControls } from '@/components/common/PresentationControls'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { PresentationStatuses } from '@/types/event-session.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function Footer() {
  const currentFrame = useCurrentFrame()
  const { isHost, presentationStatus } = useEventSession()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )

  return (
    <div className="h-full w-full flex justify-between items-center px-2">
      <div className="flex-1 flex justify-start items-center gap-2 p-2 h-12">
        <RenderIf
          isTrue={
            !!currentFrame &&
            (isHost || presentationStatus === PresentationStatuses.STARTED)
          }>
          <motion.div
            layout="size"
            layoutRoot
            className="flex flex-col justify-start items-start gap-1">
            <AnimatePresence>
              {presentationStatus === PresentationStatuses.STARTED && (
                <motion.div
                  className="text-xs text-green-600 animate-pulse"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}>
                  Now presenting
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              layout="position"
              transition={{ duration: 0.3 }}
              className="flex justify-start items-center gap-2">
              <ContentTypeIcon
                frameType={currentFrame?.type as FrameType}
                classNames="text-gray-600"
              />
              <span
                className={cn(
                  'w-44 text-ellipsis overflow-hidden line-clamp-1',
                  {
                    'font-semibold':
                      presentationStatus === PresentationStatuses.STARTED,
                  }
                )}
                title={currentFrame?.name as string}>
                {currentFrame?.name}
              </span>
            </motion.div>
          </motion.div>
        </RenderIf>
      </div>
      <div className="flex-auto flex justify-center items-center gap-2">
        <div className="flex justify-center items-center gap-2 p-2 h-11 rounded-[12px] border-1 border-gray-300 bg-white">
          <MicToggle />
          <VideoToggle />
          <ScreenShareToggle />
          <MoreActions />
          <PresentationControls />
          <ReactWithEmojiToggle />
          <RaiseHandToggle />
          <RenderIf isTrue={isHost && !isInBreakoutMeeting}>
            <AppsToggle />
          </RenderIf>
          <LeaveMeetingToggle />
        </div>
      </div>

      <MusicPlayer />
      <EchoPlayer />

      <div className="flex-1 flex justify-end items-center gap-2 p-2">
        {/* <HelpButton
          buttonProps={{
            variant: 'light',
            className: cn('live-button', {
              active: dyteStates.activeSettings,
            }),
          }}
        /> */}
      </div>
    </div>
  )
}
