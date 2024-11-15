/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'
import { IoMdRadioButtonOn } from 'react-icons/io'
import { TbApps, TbAppsFilled, TbClock } from 'react-icons/tb'
import { VscMultipleWindows } from 'react-icons/vsc'

import { TimerModal } from './TimerModal'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { Button } from '../ui/Button'

import { useEventSession } from '@/contexts/EventSessionContext'
import { useFlags } from '@/flags/client'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { getRemainingTimestamp } from '@/utils/timer.utils'
import { cn } from '@/utils/utils'

type Tool = {
  key: string
  icon: JSX.Element
  title: string
  description: string
}

export function AppsToggle() {
  const [isTimerOpen, setIsTimerOpen] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false)
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

  const togglePopoverContent = () => {
    setIsContentVisible(true) // Ensure PopoverContent is always visible when the button is clicked
  }

  return (
    <>
      <Popover
        placement="bottom"
        offset={10}
        onOpenChange={togglePopoverContent}>
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
              <Tool
                icon={<TbClock size={24} />}
                title={timerActive ? 'Stop Timer' : 'Start Timer'}
                description={timerActive ? 'Stop the timer' : 'Start the timer'}
                onClick={() => {
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
                <Tool
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
              <Tool
                icon={<VscMultipleWindows size={24} />}
                title="Start Breakout"
                description="Start a breakout for participants"
                onClick={() => {
                  console.log('Start Breakout')
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <TimerModal open={isTimerOpen} setOpen={setIsTimerOpen} />
    </>
  )
}

function Tool({
  icon,
  title,
  description,
  onClick,
}: {
  icon: JSX.Element
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <div
      className={cn(
        'flex-none w-full p-1 flex justify-start items-center gap-2 rounded-[10px] border-1.5 border-transparent hover:border-primary-100 cursor-pointer'
      )}
      onClick={onClick}>
      <div className="w-8 h-8 aspect-square rounded-md bg-live flex justify-center items-center">
        {icon}
      </div>
      <div className="flex-auto">
        <h4 className="text-xs font-semibold">{title}</h4>
        <p className="text-xs font-light text-gray-400">{description}</p>
      </div>
    </div>
  )
}
