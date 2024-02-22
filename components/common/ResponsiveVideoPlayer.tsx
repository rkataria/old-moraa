import { useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player/lazy"

export type ResponsiveVideoPlayerState = {
  playing?: boolean
  loop?: boolean
  volume?: number
  muted?: boolean
  playbackRate?: number
}

export const ResponsiveVideoPlayer = ({
  url,
  showControls,
  light = false,
  playerState,
  onPlayerStateChange,
}: {
  url: string
  showControls?: boolean
  light?: boolean
  playerState?: ResponsiveVideoPlayerState
  onPlayerStateChange?: (state: ResponsiveVideoPlayerState) => void
}) => {
  const playerRef = useRef<ReactPlayer>(null)
  const [showControlsState, setShowControlsState] =
    useState<ResponsiveVideoPlayerState>({
      playing: false,
      loop: false,
      volume: 0.8,
      muted: false,
      playbackRate: 1,
    })

  useEffect(() => {
    onPlayerStateChange?.(showControlsState)
  }, [showControlsState])

  useEffect(() => {
    if (playerState) {
      setShowControlsState((prevState) => ({ ...prevState, ...playerState }))
    }
  }, [playerState])

  const handlePlay = () => {
    setShowControlsState((prevState) => ({ ...prevState, playing: true }))
  }

  const handlePause = () => {
    setShowControlsState((prevState) => ({ ...prevState, playing: false }))
  }

  const handleEnded = () => {
    setShowControlsState((prevState) => ({ ...prevState, playing: false }))
  }

  const handleOnPlaybackRateChange = (playbackRate: number) => {
    setShowControlsState((prevState) => ({ ...prevState, playbackRate }))
  }

  const handleProgress = () => {}

  const handleDuration = () => {}

  const { playing, loop, volume, muted, playbackRate } = showControlsState

  return (
    <div className="relative w-full pt-[56.25%]">
      <ReactPlayer
        ref={playerRef}
        url={url}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        controls={showControls}
        playing={playing}
        light={light}
        loop={loop}
        playbackRate={playbackRate}
        volume={volume}
        muted={muted}
        onReady={() => console.log("onReady")}
        onStart={() => console.log("onStart")}
        onPlay={handlePlay}
        onPause={handlePause}
        onBuffer={() => console.log("onBuffer")}
        onPlaybackRateChange={handleOnPlaybackRateChange}
        onSeek={(event: unknown) => console.log("onSeek", event)}
        onEnded={handleEnded}
        onError={(event: unknown) => console.log("onError", event)}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onPlaybackQualityChange={(event: unknown) =>
          console.log("onPlaybackQualityChange", event)
        }
      />
    </div>
  )
}
