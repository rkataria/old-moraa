"use client"

import { NextPrevButtons } from "@/components/common/NextPrevButtons"
import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import { ISlide } from "@/types/slide.type"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import React, { useCallback, useContext, useEffect, useState } from "react"
import ReactGoogleSlides from "react-google-slides"

interface GoogleSlidesProps {
  slide: ISlide
}

const PositionChangeEvent = "g-slide-position-changed"

export default function GoogleSlides({ slide }: GoogleSlidesProps) {
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
    // Do not listen for page change event is the current user is a host.
    // Because the host position is directly changed by NextPrevious Buttons.
    if (isHost) return
    const handleBroadcastedMessage = ({
      type,
      payload,
    }: {
      type: string
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
      "broadcastedMessage",
      handleBroadcastedMessage
    )
  }, [])

  const broadcastSlidePosition = useCallback((newPosition: number) => {
    meeting.participants.broadcastMessage(PositionChangeEvent, {
      position: newPosition,
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="py-4">
        <ReactGoogleSlides
          width={640}
          height={480}
          slidesLink={googleSlideURL}
          position={position}
        />
      </div>
      {isHost && (
        <NextPrevButtons
          onPrevious={() =>
            setPosition((pos) => {
              const newPos = pos > 1 ? pos - 1 : pos
              broadcastSlidePosition(newPos)
              metaData.current.GSlideLastPosition = newPos
              return newPos
            })
          }
          onNext={() =>
            setPosition((pos) => {
              const newPos = pos + 1
              broadcastSlidePosition(newPos)
              metaData.current.GSlideLastPosition = newPos
              return newPos
            })
          }
          prevDisabled={position === 1}
        />
      )}
    </div>
  )
}
