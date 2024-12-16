/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'
import { IoMdRadioButtonOn } from 'react-icons/io'
import { IoMusicalNotesOutline } from 'react-icons/io5'
import { TbApps, TbAppsFilled, TbClock } from 'react-icons/tb'

import { AppsDropdownMenuItem } from './AppsDropdownMenuItem'
import { MusicControls } from './Music/MusicControls'
import { TimerModal } from './TimerModal'
import {
  UnplannedBreakoutButton,
  useOnUnplannedBreakoutSessionUpdate,
} from '../common/breakout/UnplannedBreakoutButton'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { Button } from '../ui/Button'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useFlags } from '@/flags/client'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { getRemainingTimestamp } from '@/utils/timer.utils'
import { cn } from '@/utils/utils'

export function AppsToggle() {
  useOnUnplannedBreakoutSessionUpdate()
  const [isTimerOpen, setIsTimerOpen] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false)
  const [showAudioControlsState, setShowAudioControlsState] = useState(false)
  const { meeting } = useDyteMeeting()
  const { flags } = useFlags()
  const { isHost } = useEventSession()
  const recordingState = useDyteSelector(
    (meet) => meet.recording.recordingState
  )
  const dispatch = useStoreDispatch()
  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data!
  )
  const { isBreakoutActive } = useBreakoutRooms()
  const breakoutType = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutType
  )
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

  const isTimerDisabled = isBreakoutActive && breakoutType === 'planned'
  const visibleMusicControls =
    showAudioControlsState || session?.data?.music?.play

  return (
    <>
      <Popover
        placement="bottom"
        offset={10}
        isOpen={isContentVisible}
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
              <div
                className={cn('w-full', {
                  'border-b pb-2': visibleMusicControls,
                })}>
                <AppsDropdownMenuItem
                  icon={<IoMusicalNotesOutline size={24} />}
                  title="Moraa FM"
                  description="Play music while working!"
                  onClick={() =>
                    setShowAudioControlsState(!showAudioControlsState)
                  }
                />
                <RenderIf isTrue={!!visibleMusicControls}>
                  <MusicControls />
                </RenderIf>
              </div>

              <AppsDropdownMenuItem
                icon={<TbClock size={24} />}
                title={
                  timerActive && !isTimerDisabled ? 'Stop Timer' : 'Start Timer'
                }
                description={
                  timerActive && !isTimerDisabled
                    ? 'Stop the timer'
                    : 'Start the timer'
                }
                disabled={isTimerDisabled}
                onClick={() => {
                  if (isTimerDisabled) return

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
              <UnplannedBreakoutButton
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
