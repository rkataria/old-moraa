import { Button } from '@nextui-org/button'

import { useBreakoutManagerContext } from '@/contexts/BreakoutManagerContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreDispatch } from '@/hooks/useRedux'
import { setIsBreakoutOverviewOpenAction } from '@/stores/slices/event/current-event/live-session.slice'

export function EndBreakoutButton() {
  const { realtimeChannel } = useEventSession()
  const { breakoutRoomsInstance } = useBreakoutManagerContext()
  const dispatch = useStoreDispatch()

  const endBreakoutRooms = () => {
    breakoutRoomsInstance?.endBreakout()
    dispatch(setIsBreakoutOverviewOpenAction(false))
    realtimeChannel?.send({
      type: 'broadcast',
      event: 'timer-stop-event',
      payload: { remainingDuration: 0 },
    })
  }

  return (
    <Button onClick={endBreakoutRooms} size="sm" color="danger">
      End Breakout
    </Button>
  )
}
