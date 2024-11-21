import { useState } from 'react'

import { StartPlannedBreakoutModal } from '@/components/common/breakout/StartPlannedBreakoutModal'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
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
  const sessionBreakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId || null
  )

  if (!frame) return null
  if (frame.type !== FrameType.BREAKOUT) return null

  const endBreakoutSession = () => {
    breakoutRoomsInstance?.endBreakoutRooms()
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

  const showEndBreakoutButton =
    isBreakoutActive && frame.id === sessionBreakoutFrameId

  return (
    <>
      <RenderIf isTrue={!showEndBreakoutButton}>
        <Button
          title="Start breakout"
          disabled={isBreakoutActive}
          onClick={() => {
            setOpenStartBreakoutModal(true)
          }}>
          Start Planned Breakout
        </Button>
      </RenderIf>
      <RenderIf isTrue={showEndBreakoutButton}>
        <Button
          title="End breakout"
          className="bg-red-500 text-white"
          onClick={handleBreakoutEnd}>
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
