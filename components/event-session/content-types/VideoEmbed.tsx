'use client'

import { useCallback, useContext, useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import {
  ResponsiveVideoPlayer,
  ResponsiveVideoPlayerState,
} from '@/components/common/ResponsiveVideoPlayer'
import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { ISlide } from '@/types/slide.type'

interface VideoEmbedProps {
  // TODO: Implement block pattern
  slide: ISlide & {
    content: {
      videoUrl: string
    }
  }
}

const playerStateChangeEvent = 'video-embed-option-changed'

export function VideoEmbed({ slide }: VideoEmbedProps) {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: any
    }) => {
      switch (type) {
        case playerStateChangeEvent: {
          if (isHost) return
          const { playerState: _playerState } = payload
          if (_playerState) {
            setPlayerState(_playerState)
          }
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

    return () => {
      meeting.participants.removeListener(
        'broadcastedMessage',
        handleBroadcastedMessage
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePlayerStateChange = useCallback(
    (state: ResponsiveVideoPlayerState) => {
      if (isHost) {
        meeting.participants.broadcastMessage(playerStateChangeEvent, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          playerState: state as any,
        })
      }
    },
    [isHost, meeting.participants]
  )

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-4/5 overflow-hidden rounded-md">
        <ResponsiveVideoPlayer
          url={videoUrl}
          showControls={isHost}
          playerState={playerState}
          viewOnly={!isHost}
          onPlayerStateChange={handlePlayerStateChange}
        />
      </div>
    </div>
  )
}
