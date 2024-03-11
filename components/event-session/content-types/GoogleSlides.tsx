'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import ReactGoogleSlides from 'react-google-slides'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'
import { SlideEventManagerType, SlideEvents } from '@/utils/events.util'

interface GoogleSlidesProps {
  slide: ISlide & {
    content: {
      googleSlideURL: string
      startPosition?: number
    }
  }
}

const PositionChangeEvent = 'g-slide-position-changed'

export function GoogleSlides({ slide }: GoogleSlidesProps) {
  const {
    content: { googleSlideURL, startPosition },
  } = slide
  const { meeting } = useDyteMeeting()
  const { isHost, metaData } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const [position, setPosition] = useState<number>(
    metaData.current.GSlideLastPosition || startPosition || 1
  )

  useEffect(() => {
    const nextPosition = () =>
      setPosition((pos) => {
        const newPos = pos + 1
        if (isHost) broadcastSlidePosition(newPos)

        return newPos
      })
    const prevPosition = () =>
      setPosition((pos) => {
        const newPos = pos > 1 ? pos - 1 : pos
        if (isHost) broadcastSlidePosition(newPos)

        return newPos
      })

    const handleBroadcastedMessage = ({
      type,
      payload,
    }: {
      type: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: any
    }) => {
      switch (type) {
        case PositionChangeEvent: {
          setPosition(payload.position || 1)
          metaData.current.GSlideLastPosition = payload.position || 1
          break
        }
        default:
          break
      }
    }
    meeting.participants.addListener(
      'broadcastedMessage',
      handleBroadcastedMessage
    )
    SlideEvents[SlideEventManagerType.OnRight].subscribe(nextPosition)
    SlideEvents[SlideEventManagerType.OnLeft].subscribe(prevPosition)

    return () => {
      meeting.participants.removeListener(
        'broadcastedMessage',
        handleBroadcastedMessage
      )
      SlideEvents[SlideEventManagerType.OnRight].unsubscribe(nextPosition)
      SlideEvents[SlideEventManagerType.OnLeft].unsubscribe(prevPosition)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const broadcastSlidePosition = useCallback((newPosition: number) => {
    meeting.participants.broadcastMessage(PositionChangeEvent, {
      position: newPosition,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center h-full">
      <ReactGoogleSlides
        width="100%"
        height="85%"
        slidesLink={googleSlideURL}
        position={position}
      />
    </div>
  )
}
