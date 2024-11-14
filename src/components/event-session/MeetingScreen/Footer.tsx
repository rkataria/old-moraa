import { useDyteMeeting } from '@dytesdk/react-web-core'
import { AnimatePresence, motion } from 'framer-motion'

import { LiveFrameActions } from './LiveFrameActions'
import { MoreActions } from './MoreActions'
import { LeaveMeetingToggle } from '../LeaveMeetingToggle'
import { MeetingRecordingButton } from '../MeetingRecordingButton'
import { MicToggle } from '../MicToggle'
import { RaiseHandToggle } from '../RaiseHandToggle'
import { ReactWithEmojiToggle } from '../ReactWithEmojiToggle'
import { ScreenShareToggle } from '../ScreenShareToggle'
import { TimerToggle } from '../TimerToggle'
import { VideoToggle } from '../VideoToggle'

import { AskForHelpButton } from '@/components/common/breakout/AskForHelpButton'
import { BreakoutButton } from '@/components/common/breakout/BreakoutButton'
import { ContentTypeIcon } from '@/components/common/ContentTypeIcon'
import { HelpButton } from '@/components/common/HelpButton'
import { PresentationControls } from '@/components/common/PresentationControls'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { PresentationStatuses } from '@/types/event-session.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function Footer() {
  const dyteMeeting = useDyteMeeting()
  const currentFrame = useCurrentFrame()
  const { isHost, presentationStatus, dyteStates } = useEventSession()
  const { isBreakoutActive, isCurrentDyteMeetingInABreakoutRoom } =
    useBreakoutRooms()

  return (
    <div className="h-full w-full flex justify-between items-center px-2">
      <div className="flex-1 flex justify-start items-center gap-2 p-2 h-12">
        {currentFrame && (
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
                frameType={currentFrame.type as FrameType}
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
                title={currentFrame.name as string}>
                {currentFrame.name}
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>
      <div className="flex-auto flex justify-center items-center gap-2">
        <div className="flex justify-center items-center gap-2 p-2 bg-white rounded-md shadow-lg border-1 border-gray-100">
          <MicToggle />
          <VideoToggle />
          {isHost && (
            <>
              <ScreenShareToggle />
              <PresentationControls />
            </>
          )}

          <RaiseHandToggle />
          <ReactWithEmojiToggle />
          <MoreActions />
          {isHost && (
            <>
              <MeetingRecordingButton />
              <TimerToggle />
              <BreakoutButton />
            </>
          )}
          {!isHost &&
          isBreakoutActive &&
          isCurrentDyteMeetingInABreakoutRoom ? (
            <AskForHelpButton />
          ) : null}
          <LeaveMeetingToggle />
          {/* Test Button */}
          <Button
            onClick={async () => {
              const plugin = dyteMeeting.meeting.plugins.all.get(
                'b4118591-4af6-4093-86ac-a8ce216f430f'
              )

              if (!plugin?.active) {
                await plugin?.activate()
                // const iframe = document.createElement('iframe')
                // plugin?.addPluginView(iframe)
              } else {
                await plugin?.deactivate()
              }
            }}>
            Start
          </Button>
        </div>
        <LiveFrameActions />
      </div>
      <div className="flex-1 flex justify-end items-center gap-2 p-2">
        <HelpButton
          buttonProps={{
            variant: 'light',
            className: cn('live-button', {
              active: dyteStates.activeSettings,
            }),
          }}
        />
      </div>
    </div>
  )
}
