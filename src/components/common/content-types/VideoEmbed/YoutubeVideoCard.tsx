/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useHover } from '@uidotdev/usehooks'
import { PiCheckCircleFill, PiPlus } from 'react-icons/pi'

import { RenderIf } from '../../RenderIf/RenderIf'
import {
  PlayerControl,
  ResponsiveVideoPlayer,
} from '../../ResponsiveVideoPlayer'

import { cn } from '@/utils/utils'

type YoutubeVideoCardProps = {
  video: any
  isSelected: boolean
  onUpdateVideo: (videoId: string) => void
}

export function YoutubeVideoCard({
  video,
  isSelected,
  onUpdateVideo,
}: YoutubeVideoCardProps) {
  const [ref, hovering] = useHover()

  return (
    <div className="mb-2">
      <div
        className="relative group w-full h-auto aspect-video bg-gray-100 rounded-md overflow-hidden mb-2"
        style={{
          backgroundImage: `url(${video.snippet.thumbnails.medium.url})`,
        }}>
        <RenderIf isTrue={!hovering}>
          <div className="absolute bottom-0 left-0 w-full p-2 bg-black/80 flex justify-between items-center z-[1]">
            <span className="text-white text-xs">
              {video.snippet.channelTitle}
            </span>
            <RenderIf isTrue={!isSelected}>
              <PiPlus
                size={20}
                className="text-white cursor-pointer"
                onClick={() => {
                  if (!video?.id?.videoId) return

                  onUpdateVideo(video.id.videoId)
                }}
              />
            </RenderIf>
            <RenderIf isTrue={isSelected}>
              <PiCheckCircleFill size={20} className="text-green-500" />
            </RenderIf>
          </div>
        </RenderIf>
        <div
          ref={ref}
          className={cn(
            'absolute left-0 top-0 w-full h-full bg-black/50 flex justify-center items-center',
            'transition-all duration-300 opacity-0 group-hover:opacity-100'
          )}>
          <RenderIf isTrue={hovering}>
            <ResponsiveVideoPlayer
              url={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              playerControl={PlayerControl.DEFAULT}
              showControls
              showViewMode={false}
              playerState={{
                playing: true,
                loop: false,
                volume: 0.5,
                muted: false,
                playbackRate: 1,
                played: 0,
              }}
              onPlayerStateChange={() => {}}
            />
          </RenderIf>
        </div>
      </div>

      <span className="text-medium font-semibold line-clamp-2 text-ellipsis">
        {video?.snippet?.title ? video.snippet.title : 'Title not found'}
      </span>
    </div>
  )
}
