import { useEffect, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { Tooltip } from '@nextui-org/tooltip'

import { StartPlannedBreakoutModal } from '@/components/common/breakout/StartPlannedBreakoutModal'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'
import { useBreakoutRooms } from '@/hooks/useBreakoutRooms'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import {
  notificationDuration,
  notifyBreakoutEnd,
  notifyBreakoutStart,
} from '@/utils/breakout.utils'
import { FrameType } from '@/utils/frame-picker.util'

export function BreakoutControls() {
  const [openStartBreakoutModal, setOpenStartBreakoutModal] = useState(false)
  const { isHost } = useEventSession()

  const frame = useCurrentFrame()
  const { isBreakoutActive } = useBreakoutRooms()
  const { eventRealtimeChannel } = useRealtimeChannel()
  const { breakoutRoomsInstance } = useBreakoutManagerContext()
  const participants = useDyteSelector((state) => state.participants.joined)
  const sessionBreakoutFrameId = useStoreSelector(
    (store) =>
      store.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.breakoutFrameId || null
  )

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

  useEffect(() => {
    if (!eventRealtimeChannel) return

    eventRealtimeChannel.on(
      'broadcast',
      { event: 'breakout-time-ended' },
      () => {
        if (!isHost) return
        handleBreakoutEnd()
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, eventRealtimeChannel])

  if (!frame) return null
  if (frame.type !== FrameType.BREAKOUT) return null

  const endBreakoutSession = () => {
    breakoutRoomsInstance?.endBreakoutRooms()
  }

  const showEndBreakoutButton =
    isBreakoutActive && frame.id === sessionBreakoutFrameId

  return (
    <>
      <RenderIf isTrue={!showEndBreakoutButton}>
        <Tooltip
          content="Cannot start the breakout without participants."
          hidden={!!participants.toArray().length}>
          <Button
            title="Start breakout"
            color="primary"
            disabled={isBreakoutActive || !participants.toArray().length}
            disableRipple={!participants.toArray().length}
            disableAnimation={!participants.toArray().length}
            onClick={() => {
              setOpenStartBreakoutModal(true)
            }}>
            Start Breakout
          </Button>
        </Tooltip>
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
