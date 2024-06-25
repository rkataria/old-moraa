'use client'

import React, { useContext, useEffect, useState } from 'react'

// FIXME: The component name should be `GoogleSlidesEmbed`
import { GoogleSlideEmbed } from '@/components/common/GoogleSlideEmbed'
import { EventContext } from '@/contexts/EventContext'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventContextType } from '@/types/event-context.type'
import { EventSessionContextType } from '@/types/event-session.type'
import { IFrame } from '@/types/frame.type'

interface GoogleSlidesProps {
  frame: IFrame & {
    content: {
      googleSlideURL: string // FIXME: The url should be `googleSlidesUrl`
      startPosition?: number
    }
  }
}

const positionChangeEvent = 'g-frame-position-changed'

export function GoogleSlides({ frame }: GoogleSlidesProps) {
  const {
    content: { googleSlideURL, startPosition },
  } = frame
  const { preview } = useContext(EventContext) as EventContextType
  const { isHost, realtimeChannel, activeSession, updateActiveSession } =
    useContext(EventSessionContext) as EventSessionContextType
  const [position, setPosition] = useState<number>(startPosition || 1)

  useEffect(() => {
    if (!activeSession?.data?.GSlideLastPosition) return

    setPosition(activeSession?.data?.GSlideLastPosition)
  }, [activeSession?.data?.GSlideLastPosition])

  useEffect(() => {
    if (!isHost) return
    if (!realtimeChannel) return
    realtimeChannel.on(
      'broadcast',
      { event: positionChangeEvent },
      ({ payload }) => {
        console.log('Received position change event', payload)
        setPosition(payload.position || 1)

        updateActiveSession({
          GSlideLastPosition: payload.position || 1,
        })
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeChannel])

  const handleCurrentPageChange = (pageNumber: number) => {
    if (preview) return

    realtimeChannel?.send({
      type: 'broadcast',
      event: positionChangeEvent,
      payload: { position: pageNumber },
    })
  }

  return (
    <GoogleSlideEmbed
      url={googleSlideURL}
      showControls={isHost}
      startPage={position}
      onPageChange={handleCurrentPageChange}
    />
  )
}
