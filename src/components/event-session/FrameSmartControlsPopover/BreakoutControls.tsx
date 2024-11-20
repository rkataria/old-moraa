import { useState } from 'react'

import { StartPlannedBreakoutModal } from '@/components/common/breakout/StartPlannedBreakoutModal'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreDispatch } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import {
  notificationDuration,
  notifyBreakoutEnd,
  notifyBreakoutStart,
} from '@/utils/breakout-notify.utils'
import { FrameType } from '@/utils/frame-picker.util'

export function BreakoutControls() {
  const [openStartBreakoutModal, setOpenStartBreakoutModal] = useState(false)

  const frame = useCurrentFrame()
  const { isBreakoutActive } = useBreakoutRooms()
  const { eventRealtimeChannel } = useRealtimeChannel()
  const { breakoutRoomsInstance } = useBreakoutManagerContext()
  const dispatch = useStoreDispatch()

  if (!frame) return null
  if (frame.type !== FrameType.BREAKOUT) return null

  const endBreakoutSession = () => {
    breakoutRoomsInstance?.endBreakoutRooms()
    dispatch(
      updateMeetingSessionDataAction({
        breakoutFrameId: null,
        connectedMeetingsToActivitiesMap: {},
        timerStartedStamp: null,
      })
    )
  }

  const handleBreakoutEnd = () => {
    if (!eventRealtimeChannel) {
      endBreakoutSession()

      return
    }
    notifyBreakoutStart(eventRealtimeChannel)
    setTimeout(() => {
      notifyBreakoutEnd(eventRealtimeChannel)
      endBreakoutSession()
    }, notificationDuration * 1000)
  }

  return (
    <>
      <RenderIf isTrue={!isBreakoutActive}>
        <Button
          title="Start breakout"
          onClick={() => {
            setOpenStartBreakoutModal(true)
          }}>
          Start Planned Breakout
        </Button>
      </RenderIf>
      <RenderIf isTrue={isBreakoutActive}>
        <Button title="End breakout" color="danger" onClick={handleBreakoutEnd}>
          End Breakout
        </Button>
      </RenderIf>
      <StartPlannedBreakoutModal
        open={openStartBreakoutModal}
        setOpen={setOpenStartBreakoutModal}
      />
    </>
  )
}
