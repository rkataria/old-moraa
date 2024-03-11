'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'
import ReactGoogleSlides from 'react-google-slides'

import { Skeleton } from '@nextui-org/react'

import { PageControls } from '@/components/common/PageControls'
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
  const [googleSlidesLoaded, setGoogleSlidesLoaded] = useState<boolean>(false)

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

  const handleCurrentPageChange = (pageNumber: number) => {
    if (pageNumber === 0) return

    setPosition(pageNumber)
  }

  return (
    <div className="relative w-full h-full">
      {!googleSlidesLoaded && (
        <Skeleton className="absolute left-0 top-0 w-full h-full rounded-md" />
      )}
      <ReactGoogleSlides
        width="100%"
        height="100%"
        slidesLink={googleSlideURL}
        position={position}
        onLoad={() => {
          setGoogleSlidesLoaded(true)
        }}
      />

      <PageControls
        currentPage={position}
        isHost={isHost}
        handleCurrentPageChange={handleCurrentPageChange}
      />
    </div>
  )
}
