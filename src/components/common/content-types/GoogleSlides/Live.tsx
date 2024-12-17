import { useEffect, useState } from 'react'

import { LoadError } from './LoadError'
import { Preview } from './Preview'

import { useEventContext } from '@/contexts/EventContext'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreDispatch } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { type GoogleSlidesFrame } from '@/types/frame-picker.type'
import { isValidGoogleSlidesUrl } from '@/utils/utils'

const positionChangeEvent = 'g-frame-position-changed'

type LiveProps = {
  frame: GoogleSlidesFrame
}

export function Live({ frame }: LiveProps) {
  const { permissions } = useEventPermissions()
  const dispatch = useStoreDispatch()
  const {
    content: { startPosition },
  } = frame
  const { preview } = useEventContext()
  const { isHost, eventRealtimeChannel, activeSession } = useEventSession()
  const [position, setPosition] = useState<number>(startPosition || 1)

  useEffect(() => {
    if (!activeSession?.GSlideLastPosition) return

    setPosition(activeSession?.GSlideLastPosition)
  }, [activeSession?.GSlideLastPosition])

  useEffect(() => {
    if (!isHost) return
    if (!eventRealtimeChannel) return
    eventRealtimeChannel.on(
      'broadcast',
      { event: positionChangeEvent },
      ({ payload }) => {
        setPosition(payload.position || 1)

        dispatch(
          updateMeetingSessionDataAction({
            GSlideLastPosition: payload.position || 1,
          })
        )
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventRealtimeChannel])

  const handleCurrentPageChange = (pageNumber: number) => {
    if (preview) return

    eventRealtimeChannel?.send({
      type: 'broadcast',
      event: positionChangeEvent,
      payload: { position: pageNumber },
    })
  }

  if (isValidGoogleSlidesUrl(frame.content?.googleSlideUrl)) {
    return (
      <Preview
        frame={frame}
        startPage={position}
        onPageChange={handleCurrentPageChange}
      />
    )
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <LoadError
        invalidUrl={!frame.content?.googleSlideUrl}
        canUpdateFrame={permissions.canUpdateFrame}
      />
    </div>
  )
}
