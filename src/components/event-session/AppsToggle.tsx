/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react'

import { Popover, PopoverTrigger, PopoverContent } from '@heroui/react'
import { AiOutlineAppstoreAdd } from 'react-icons/ai'
import { IoMusicalNotesOutline } from 'react-icons/io5'
import { TbClock } from 'react-icons/tb'

import { AppsDropdownMenuItem } from './AppsDropdownMenuItem'
import { AppsRecordingDropdownMenuItem } from './AppsRecordingMenuItem'
import { MusicControls } from './Music/MusicControls'
import { TimerModal } from './TimerModal'
import { RenderIf } from '../common/RenderIf/RenderIf'
import {
  UnplannedBreakoutButton,
  useOnUnplannedBreakoutSessionUpdate,
} from '../frames/frame-types/Breakout/UnplannedBreakoutButton'
import { Button } from '../ui/Button'

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
            <AiOutlineAppstoreAdd size={18} className="rotate-180" />
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
              <AppsRecordingDropdownMenuItem />
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
