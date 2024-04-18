'use client'

import React, { useContext, useState } from 'react'

import { Button, Input } from '@nextui-org/react'

import { ResponsiveVideoPlayer } from '@/components/common/ResponsiveVideoPlayer'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'

export type VideoEmbedSlideType = ISlide & {
  content: {
    videoUrl: string
  }
}
interface VideoEmbedEditorProps {
  slide: VideoEmbedSlideType
}

export function VideoEmbedEditor({ slide }: VideoEmbedEditorProps) {
  const [videoUrl, setVideoUrl] = useState(slide.content.videoUrl || '')
  const [isEditMode, setIsEditMode] = useState(!slide.content.videoUrl)
  const { preview, isOwner, updateSlide } = useContext(
    EventContext
  ) as EventContextType

  const saveVideoUrl = () => {
    if (preview) return
    updateSlide({
      slidePayload: {
        content: {
          videoUrl,
        },
      },
      slideId: slide.id,
    })
    setIsEditMode(false)
  }

  if (preview || !isEditMode) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-4/5 overflow-hidden rounded-md">
          <ResponsiveVideoPlayer
            url={videoUrl}
            showControls={isOwner && !preview}
            viewOnly={!isOwner || preview}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 h-full ">
      <Input
        size="sm"
        className="w-1/2 rounded-md"
        placeholder="Enter video URL"
        onChange={(e) => setVideoUrl(e.target.value)}
        value={videoUrl}
      />
      <Button size="lg" color="primary" onClick={saveVideoUrl}>
        Save
      </Button>
    </div>
  )
}
