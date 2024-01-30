"use client"

import { Button } from "@/components/ui/button"
import EventSessionContext from "@/contexts/EventSessionContext"
import { useHotkeys } from "@/hooks/useHotkeys"
import { EventSessionContextType } from "@/types/event-session.type"
import { ISlide } from "@/types/slide.type"
import { useDyteMeeting } from "@dytesdk/react-web-core"
import React, { useContext, useEffect, useState } from "react"
import ReactGoogleSlides from "react-google-slides"

interface GoogleSlidesProps {
  slide: ISlide
}

const PositionChangeEvent = "g-slide-position-changed"

export default function GoogleSlides({ slide }: GoogleSlidesProps) {
  const {
    content: { googleSlideURL, startPosition },
  } = slide
  const [position, setPosition] = useState(startPosition as number || 1)
  const { meeting } = useDyteMeeting()
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType
  useHotkeys("ArrowRight", () => {
    setPosition((pos) => pos + 1)
  })
  useHotkeys("ArrowLeft", () => {
    setPosition((pos) => (pos > 1 ? pos - 1 : pos))
  })

  useEffect(() => {
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
  }, [])

  const changeSlidePosition = (newPosition: number) => {
    meeting.participants.broadcastMessage(PositionChangeEvent, {
      position: newPosition,
    })
  }

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
        <div className="flex mb-4 mt-2">
          <Button
            onClick={() =>
              changeSlidePosition(position > 1 ? position - 1 : position)
            }
            variant="secondary"
            disabled={position === 1}
            className="mx-2"
          >
            Prev
          </Button>
          <Button
            onClick={() => changeSlidePosition(position + 1)}
            variant="secondary"
            className="mx-2"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
