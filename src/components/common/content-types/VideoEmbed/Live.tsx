import { useCallback, useEffect, useState } from 'react'

import { useDyteMeeting } from '@dytesdk/react-web-core'

import { Embed } from './Embed'

import { ResponsiveVideoPlayerState } from '@/components/common/ResponsiveVideoPlayer'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { IFrame } from '@/types/frame.type'

type LiveProps = {
  frame: IFrame
  showControls?: boolean
}

const playerStateChangeEvent = 'video-embed-option-changed'

export function Live({ frame, showControls }: LiveProps) {
  const videoUrl = frame.content?.videoUrl
  const { meeting } = useDyteMeeting()
  const [playerState, setPlayerState] = useState<ResponsiveVideoPlayerState>({
    playing: false,
    loop: false,
    volume: 0.8,
    muted: false,
    playbackRate: 1,
    played: 0,
  })
  const { isHost } = useEventSession()
  const isInBreakoutMeeting = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.breakout.isInBreakoutMeeting
  )

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
          const { playerState: _playerState } = payload
          if (isHost) return
          if (_playerState) {
            setPlayerState({
              ..._playerState,
              broadcastedPlayedValue: _playerState.played,
            })
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
      if (isHost || isInBreakoutMeeting) {
        meeting.participants.broadcastMessage(playerStateChangeEvent, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          playerState: state as any,
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <Embed
      url={videoUrl as string}
      showControls={showControls}
      playerProps={{
        playerState,
        onPlayerStateChange: setPlayerState,
        onPlayerStateUpdate: handlePlayerStateChange,
      }}
    />
  )
}
