/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'
import { IoMdRadioButtonOn } from 'react-icons/io'
import { TbApps, TbAppsFilled, TbClock } from 'react-icons/tb'

import { AppsDropdownMenuItem } from './AppsDropdownMenuItem'
import { TimerModal } from './TimerModal'
import { BreakoutButton } from '../common/breakout/BreakoutButton'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { Button } from '../ui/Button'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useFlags } from '@/flags/client'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { EventSessionMode } from '@/types/event-session.type'
import { FrameType } from '@/utils/frame-picker.util'
import { getRemainingTimestamp } from '@/utils/timer.utils'
import { cn } from '@/utils/utils'

export function AppsToggle() {
  const currentFrame = useCurrentFrame()
  const [isTimerOpen, setIsTimerOpen] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false)
  const { meeting } = useDyteMeeting()
  const { flags } = useFlags()
  const { isHost, eventSessionMode } = useEventSession()
  const recordingState = useDyteSelector(
    (meet) => meet.recording.recordingState
  )
  const dispatch = useStoreDispatch()
  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data!
  )
  const { isBreakoutActive } = useBreakoutRooms()

  const timerActive =
    session?.data?.timerStartedStamp &&
    session.data.timerDuration &&
    getRemainingTimestamp(
      session.data.timerStartedStamp,
      session.data.timerDuration
    ) > 0
  const isRecording = recordingState === 'RECORDING'

  const onRecordingToggle = () => {
    if (isRecording) {
      meeting.recording.stop()
    } else {
      meeting.recording.start()
    }
  }

  return (
    <>
      <Popover
        placement="bottom"
        offset={10}
        onOpenChange={setIsContentVisible}>
        <PopoverTrigger>
          <Button
            variant="light"
            className={cn('live-button', {
              active: isContentVisible,
            })}
            isIconOnly>
            {isContentVisible ? (
              <TbAppsFilled size={18} />
            ) : (
              <TbApps size={18} />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <div className="p-3">
            <h3 className="font-semibold">More Tools</h3>
            <div className="pt-2 flex flex-col justify-start items-center gap-2">
              <AppsDropdownMenuItem
                icon={<TbClock size={24} />}
                title={
                  timerActive && !isBreakoutActive
                    ? 'Stop Timer'
                    : 'Start Timer'
                }
                description={
                  timerActive && !isBreakoutActive
                    ? 'Stop the timer'
                    : 'Start the timer'
                }
                disabled={isBreakoutActive}
                onClick={() => {
                  if (isBreakoutActive) return

                  if (timerActive) {
                    dispatch(
                      updateMeetingSessionDataAction({
                        timerStartedStamp: null,
                      })
                    )
                  } else {
                    setIsTimerOpen(true)
                  }
                }}
              />
              <RenderIf isTrue={!!(isHost && flags?.show_recording_button)}>
                <AppsDropdownMenuItem
                  icon={<IoMdRadioButtonOn size={24} />}
                  title={isRecording ? 'Stop Recording' : 'Record Meeting'}
                  description={
                    isRecording
                      ? 'Stop recording the meeting'
                      : 'Start or stop recording the meeting'
                  }
                  onClick={onRecordingToggle}
                />
              </RenderIf>
              <BreakoutButton
                disabled={
                  eventSessionMode !== EventSessionMode.LOBBY &&
                  currentFrame?.type === FrameType.BREAKOUT
                }
                onClick={() => setIsContentVisible(false)}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <TimerModal open={isTimerOpen} setOpen={setIsTimerOpen} />
    </>
  )
}
