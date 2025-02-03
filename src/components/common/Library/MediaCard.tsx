/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useState } from 'react'

import { IconFileTypePdf } from '@tabler/icons-react'
import { IoMusicalNotes, IoPause, IoPlay } from 'react-icons/io5'

import type { MediaTypeNames } from './MediaLibrary'

import { cn } from '@/utils/utils'

type MediaCardProps = {
  fileName: string
  fileUrl: string
  type: MediaTypeNames
  onClick?: (opts: { fileUrl: string; fileType: string }) => void
}

export function MediaCard({
  fileName,
  fileUrl,
  type,
  onClick,
}: MediaCardProps) {
  let MediaUI: React.ReactNode
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  const toggleVideoPlayPause: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.stopPropagation()
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const toggleAudioPlayPause: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsAudioPlaying(!isAudioPlaying)
    }
  }

  switch (type) {
    case 'Audio':
      MediaUI = (
        <div className="h-full w-full relative flex items-center justify-center bg-slate-300">
          <audio ref={audioRef} onEnded={() => setIsAudioPlaying(false)}>
            <source src={fileUrl} />
            Your browser does not support the audio element.
          </audio>
          <IoMusicalNotes
            size="70%"
            color="#aaa"
            className={cn('pb-4 pr-6', {
              'animate-pulse': isAudioPlaying,
            })}
          />
          <button
            type="button"
            onClick={toggleAudioPlayPause}
            className="absolute inset-0 flex items-center justify-center text-white text-4xl text-white m-[45%]">
            {isAudioPlaying ? <IoPause /> : <IoPlay />}
          </button>
        </div>
      )
      break

    case 'Image':
      MediaUI = (
        <div className="h-full w-full bg-gray-100">
          <img
            src={fileUrl}
            alt={fileName}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
      )
      break

    case 'PDF':
      MediaUI = (
        <div className="h-full w-full bg-red-100 flex items-center justify-center">
          <IconFileTypePdf size={80} className="text-gray-400" />
        </div>
      )
      break

    case 'Video':
      MediaUI = (
        <div className="h-full w-full bg-gray-100 relative">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            onEnded={() => setIsVideoPlaying(false)}
            muted>
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video element.
          </video>
          <button
            type="button"
            onClick={toggleVideoPlayPause}
            className="absolute inset-0 flex items-center justify-center text-white text-4xl m-[45%]">
            {isVideoPlaying ? <IoPause /> : <IoPlay />}
          </button>
        </div>
      )
      break

    default:
      MediaUI = (
        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
          <i className="text-4xl text-gray-500 fas fa-question" />
        </div>
      )
      break
  }

  return (
    <div
      className={cn(
        'relative h-full w-full aspect-square overflow-hidden rounded-sm',
        {
          'cursor-pointer': onClick,
        }
      )}
      onClick={() => onClick?.({ fileUrl, fileType: type })}>
      {MediaUI}
      <div className="absolute bottom-0 right-0 left-0 bg-[#fff6] px-2 py-1 backdrop-blur-md h-12 capitalize-first-letter truncate text-ellipsis">
        {fileName}
      </div>
    </div>
  )
}
