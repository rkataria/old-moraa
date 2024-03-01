"use client"

import { useCallback, useContext, useEffect, useState } from "react"
import { useDyteMeeting } from "@dytesdk/react-web-core"

import {
  ResponsiveVideoPlayer,
  ResponsiveVideoPlayerState,
} from "@/components/common/ResponsiveVideoPlayer"
import EventSessionContext from "@/contexts/EventSessionContext"
import { EventSessionContextType } from "@/types/event-session.type"
import { ISlide } from "@/types/slide.type"

interface VideoEmbedProps {
  slide: ISlide
}

const playerStateChangeEvent = "video-embed-option-changed"

export default function VideoEmbed({ slide }: VideoEmbedProps) {
  const {
    content: { videoUrl },
  } = slide
  const { meeting } = useDyteMeeting()
  const [playerState, setPlayerState] = useState<ResponsiveVideoPlayerState>()
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType

  useEffect(() => {
    const handleBroadcastedMessage = ({
      type,
      payload,
    }: {
      type: string
      payload: any
    }) => {
      switch (type) {
        case playerStateChangeEvent: {
          if (isHost) return
          const { playerState } = payload
          if (playerState) {
            setPlayerState(playerState)
          }
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

    return () => {
      meeting.participants.removeListener(
        "broadcastedMessage",
        handleBroadcastedMessage
      )
    }
  }, [])

  const handlePlayerStateChange = useCallback(
    (state: ResponsiveVideoPlayerState) => {
      if (isHost) {
        meeting.participants.broadcastMessage(playerStateChangeEvent, {
          playerState: state as any,
        })
      }
    },
    [isHost, meeting.participants]
  )

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-black">
      <ResponsiveVideoPlayer
        url={videoUrl}
        showControls={isHost}
        playerState={playerState}
        onPlayerStateChange={handlePlayerStateChange}
      />
    </div>
  )
}
