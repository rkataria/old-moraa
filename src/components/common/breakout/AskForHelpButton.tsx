import { useState } from 'react'

import { Button } from '@nextui-org/button'

import { useRealtimeChannel } from '@/contexts/RealtimeChannelContext'
import { useProfile } from '@/hooks/useProfile'
import { useStoreSelector } from '@/hooks/useRedux'

export function AskForHelpButton() {
  const currentDyteMeetingId = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.dyte.currentDyteMeetingId
  )
  const [isButtonDisabled, setButtonDisabled] = useState(false)
  const user = useProfile()
  const { eventRealtimeChannel } = useRealtimeChannel()

  const askForHelp = () => {
    setButtonDisabled(true)
    setTimeout(() => setButtonDisabled(false), 5000)
    eventRealtimeChannel?.send({
      type: 'broadcast',
      payload: {
        meetingId: currentDyteMeetingId,
        userName: `${user.data?.first_name} ${user.data?.last_name}`,
      },
      event: 'breakout-ask-for-help',
    })
  }

  return (
    <Button
      disabled={isButtonDisabled}
      size="sm"
      variant={isButtonDisabled ? 'flat' : 'light'}
      color={isButtonDisabled ? 'success' : 'default'}
      onClick={askForHelp}
      title="Ask for help">
      Ask for help
    </Button>
  )
}
