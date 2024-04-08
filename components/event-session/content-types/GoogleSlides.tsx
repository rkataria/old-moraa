'use client'

import React, { useContext, useEffect, useState } from 'react'

import { GoogleSlideEmbed } from '@/components/common/GoogleSlideEmbed'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'

interface GoogleSlidesProps {
  slide: ISlide & {
    content: {
      googleSlideURL: string
      startPosition?: number
    }
  }
}

const positionChangeEvent = 'g-slide-position-changed'

export function GoogleSlides({ slide }: GoogleSlidesProps) {
  const {
    content: { googleSlideURL, startPosition },
  } = slide
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
    realtimeChannel.send({
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
