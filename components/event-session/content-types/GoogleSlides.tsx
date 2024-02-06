"use client"

import { ISlide } from "@/types/slide.type"
import { SlideEventManagerType, SlideEvents } from "@/utils/events.util"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import React, { useEffect, useState } from "react"
import ReactGoogleSlides from "react-google-slides"

interface GoogleSlidesProps {
  slide: ISlide
}

const PositionChangeEvent = "g-slide-position-changed"

export default function GoogleSlides({ slide }: GoogleSlidesProps) {
  const {
    content: { googleSlideURL, startPosition },
  } = slide
  const [position, setPosition] = useState((startPosition as number) || 1)
  const { meeting } = useDyteMeeting()

  useEffect(() => {
    const nextPosition = () => setPosition((pos) => pos + 1)
    const prevPosition = () => setPosition((pos) => (pos > 1 ? pos - 1 : pos))
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
    SlideEvents[SlideEventManagerType.OnRight].subscribe(nextPosition)
    SlideEvents[SlideEventManagerType.OnLeft].subscribe(prevPosition)

    return () => {
      meeting.participants.removeListener(
        "broadcastedMessage",
        handleBroadcastedMessage
      )
      SlideEvents[SlideEventManagerType.OnRight].unsubscribe(nextPosition)
      SlideEvents[SlideEventManagerType.OnLeft].unsubscribe(prevPosition)
    }
  }, [])

  const changeSlidePosition = (newPosition: number) => {
    meeting.participants.broadcastMessage(PositionChangeEvent, {
      position: newPosition,
    })
  }

  return (
    <div className="flex flex-col items-center h-full">
      <ReactGoogleSlides
        width={"100%"}
        height={"85%"}
        slidesLink={googleSlideURL}
        position={position}
      />
    </div>
  )
}
