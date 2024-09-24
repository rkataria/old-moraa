import { useEffect, useRef, useState } from 'react'

import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from '@tabler/icons-react'
import { useDebounce } from '@uidotdev/usehooks'
import ReactPlayer from 'react-player/lazy'

import { formatSecondsToDuration, cn } from '@/utils/utils'

export enum PlayerControl {
  CUSTOM = 'custom',
  DEFAULT = 'default',
}

export type ResponsiveVideoPlayerState = {
  playing: boolean
  loop: boolean
  volume: number
  muted: boolean
  playbackRate: number
  played: number
  playedSeconds?: number
  broadcastedPlayedValue?: number
}

type ResponsiveVideoPlayerProps = {
  url: string
  playerControl?: PlayerControl
  showControls?: boolean
  light?: boolean
  playerState?: ResponsiveVideoPlayerState
  onPlayerStateChange?: React.Dispatch<
    React.SetStateAction<ResponsiveVideoPlayerState>
  >
  onPlayerStateUpdate?: (newState: ResponsiveVideoPlayerState) => void
}

export function ResponsiveVideoPlayer({
  url,
  playerControl = PlayerControl.CUSTOM,
  showControls = true,
  light = false,
  playerState,
  onPlayerStateUpdate,
  onPlayerStateChange,
}: ResponsiveVideoPlayerProps) {
  const [hideControls, setHideControls] = useState(true)
  const [hoveringOnContainer, setHoveringOnContainer] = useState<null | string>(
    null
  )

  const playerRef = useRef<ReactPlayer>(null)
  const hovered = useDebounce(hoveringOnContainer, 3000)

  const localPlayerState = useState<ResponsiveVideoPlayerState>({
    playing: false,
    loop: false,
    volume: 0.8,
    muted: false,
    playbackRate: 1,
    played: 0,
    playedSeconds: 0,
  })
  const [isSeeking, setIsSeeking] = useState(false)

  const [currentPlayerState, setCurrentPlayerState] =
    playerState && onPlayerStateChange
      ? [playerState, onPlayerStateChange]
      : localPlayerState

  useEffect(() => {
    if (playerState?.broadcastedPlayedValue) {
      // If the played value is updated by the host, then update the player

      playerRef.current?.seekTo(playerState.broadcastedPlayedValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerState?.broadcastedPlayedValue])

  useEffect(() => {
    if (!hovered) return
    setTimeout(() => {
      setHideControls(true)
    }, 3000)
  }, [hovered])

  const handlePlay = () => {
    if (!showControls) return
    setCurrentPlayerState((prevState) => {
      const newState = { ...prevState, playing: true }
      onPlayerStateUpdate?.(newState)

      return newState
    })
  }

  const handlePause = () => {
    if (!showControls) return
    setCurrentPlayerState((prevState) => {
      const newState = { ...prevState, playing: false }
      onPlayerStateUpdate?.(newState)

      return newState
    })
  }

  const handleEnded = () => {
    if (!showControls) return
    setCurrentPlayerState((prevState) => {
      const newState = { ...prevState, playing: false }
      onPlayerStateUpdate?.(newState)

      return newState
    })
  }

  const handleOnPlaybackRateChange = (playbackRate: number) => {
    if (!showControls) return
    setCurrentPlayerState((prevState) => {
      const newState = { ...prevState, playbackRate }
      onPlayerStateUpdate?.(newState)

      return newState
    })
  }

  const handleMuteToggle = () => {
    if (!showControls) return
    setCurrentPlayerState((prevState) => {
      const newState = {
        ...prevState,
        muted: !prevState.muted,
        volume: prevState.muted ? 0.8 : 0,
      }
      onPlayerStateUpdate?.(newState)

      return newState
    })
  }

  const handleSeekMouseDown = () => {
    if (!showControls) return
    setIsSeeking(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSeekChange = (e: any) => {
    if (!showControls) return
    setCurrentPlayerState((prevState) => {
      const newState = { ...prevState, played: parseFloat(e.target.value) }
      onPlayerStateUpdate?.(newState)

      return newState
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSeekMouseUp = (e: any) => {
    if (!showControls) return
    setIsSeeking(false)
    playerRef.current?.seekTo(parseFloat(e.target.value))
  }

  const handleMouseMove = () => {
    setHoveringOnContainer(`${Math.random()}-hovering`)
    setHideControls(false)
  }

  const { playing, loop, volume, muted, playbackRate, played } =
    currentPlayerState

  return (
    <div
      className="relative w-full pt-[56.25%] rounded-md overflow-hidden"
      onMouseMove={handleMouseMove}>
      <ReactPlayer
        ref={playerRef}
        url={url}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        controls={showControls && playerControl === PlayerControl.DEFAULT}
        playing={playing}
        light={light}
        loop={loop}
        playbackRate={playbackRate}
        volume={volume}
        muted={muted}
        onPlay={handlePlay}
        onPause={handlePause}
        onPlaybackRateChange={handleOnPlaybackRateChange}
        onEnded={handleEnded}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onProgress={(progress: any) => {
          if (!isSeeking) {
            setCurrentPlayerState((prevState) => ({
              ...prevState,
              played: progress.played,
              playedSeconds: progress.playedSeconds,
            }))
          }
        }}
      />
      {/* Player Custom Control */}
      {showControls && playerControl === PlayerControl.CUSTOM && (
        <div
          className={cn(
            'absolute left-0 w-full h-12 p-2 -bottom-12 bg-gradient-to-b duration-300',
            {
              'bottom-0': !(hideControls && playing),
            }
          )}>
          <div className="flex justify-start items-center gap-4 h-full w-full bg-white p-3 rounded-sm">
            {playing ? (
              <IconPlayerPauseFilled onClick={handlePause} />
            ) : (
              <IconPlayerPlayFilled onClick={handlePlay} />
            )}
            <div className="flex items-center">
              {volume > 0.8 && <IconVolume onClick={handleMuteToggle} />}
              {volume <= 0.8 && volume > 0 && (
                <IconVolume2 onClick={handleMuteToggle} />
              )}
              {volume === 0 && <IconVolume3 onClick={handleMuteToggle} />}

              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={(event) =>
                  setCurrentPlayerState((prevState) => ({
                    ...prevState,
                    volume: parseFloat(event.target.value),
                    muted: parseFloat(event.target.value) === 0,
                  }))
                }
              />
            </div>
            <div className="flex justify-start items-center gap-2 w-full">
              <span>
                {formatSecondsToDuration(
                  parseInt(
                    currentPlayerState?.playedSeconds?.toString() || '0',
                    10
                  )
                )}
              </span>
              <input
                type="range"
                min={0}
                max={0.999999}
                step="any"
                value={played}
                className="flex-auto"
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
              />
              <span>
                {formatSecondsToDuration(
                  parseInt(
                    playerRef.current?.getDuration()?.toString() || '0',
                    10
                  )
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {!showControls && (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <span className="absolute right-2 bottom-2 py-2 px-4 bg-black/80 text-white text-xs rounded-full flex justify-center items-center">
            View Mode
          </span>
        </div>
      )}
      {hideControls && playing && (
        <div className="absolute top-0 left-0 w-full h-full z-[1] opacity-0" />
      )}
    </div>
  )
}
