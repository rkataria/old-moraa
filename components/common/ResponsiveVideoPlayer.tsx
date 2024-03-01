import { useEffect, useRef, useState } from 'react'

import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from '@tabler/icons-react'
import ReactPlayer from 'react-player/lazy'

import { formatSecondsToDuration } from '@/utils/utils'

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
  seeking: boolean
  playedSeconds?: number
}

type ResponsiveVideoPlayerProps = {
  url: string
  playerControl?: PlayerControl
  showControls?: boolean
  light?: boolean
  playerState?: ResponsiveVideoPlayerState
  onPlayerStateChange?: (state: ResponsiveVideoPlayerState) => void
}

export function ResponsiveVideoPlayer({
  url,
  playerControl = PlayerControl.CUSTOM,
  showControls = true,
  light = false,
  playerState,
  onPlayerStateChange,
}: ResponsiveVideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null)
  const [currentPlayerState, setCurrentPlayerState] =
    useState<ResponsiveVideoPlayerState>({
      playing: false,
      loop: false,
      volume: 0.8,
      muted: false,
      playbackRate: 1,
      played: 0,
      seeking: false,
    })

  useEffect(() => {
    onPlayerStateChange?.(currentPlayerState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayerState])

  useEffect(() => {
    if (playerState) {
      setCurrentPlayerState((prevState) => ({ ...prevState, ...playerState }))

      // If the played value is updated by the host, then update the player
      if (playerState.played !== currentPlayerState.played) {
        playerRef.current?.seekTo(playerState.played)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerState])

  const handlePlay = () => {
    setCurrentPlayerState((prevState) => ({ ...prevState, playing: true }))
  }

  const handlePause = () => {
    setCurrentPlayerState((prevState) => ({ ...prevState, playing: false }))
  }

  const handleEnded = () => {
    setCurrentPlayerState((prevState) => ({ ...prevState, playing: false }))
  }

  const handleOnPlaybackRateChange = (playbackRate: number) => {
    setCurrentPlayerState((prevState) => ({ ...prevState, playbackRate }))
  }

  const handleMuteToggle = () => {
    setCurrentPlayerState((prevState) => ({
      ...prevState,
      muted: !prevState.muted,
      volume: prevState.muted ? 0.8 : 0,
    }))
  }

  const handleSeekMouseDown = () => {
    setCurrentPlayerState((prevState) => ({ ...prevState, seeking: true }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSeekChange = (e: any) => {
    setCurrentPlayerState((prevState) => ({
      ...prevState,
      played: parseFloat(e.target.value),
    }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSeekMouseUp = (e: any) => {
    setCurrentPlayerState((prevState) => ({ ...prevState, seeking: false }))
    playerRef.current?.seekTo(parseFloat(e.target.value))
  }

  const { playing, loop, volume, muted, playbackRate, played } =
    currentPlayerState

  return (
    <div className="relative w-full pt-[56.25%]">
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
          if (!currentPlayerState.seeking) {
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
        <div className="absolute bottom-0 left-0 w-full h-12 p-2">
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
    </div>
  )
}
