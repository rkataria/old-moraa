'use client'

import React, { useContext, useState } from 'react'

import { Button, Input } from '@nextui-org/react'

import { ResponsiveVideoPlayer } from '@/components/common/ResponsiveVideoPlayer'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

export type VideoEmbedFrameType = IFrame & {
  content: {
    videoUrl: string
  }
}
interface VideoEmbedEditorProps {
  frame: VideoEmbedFrameType
  readOnly?: boolean
}

export function VideoEmbedEditor({
  frame,
  readOnly = false,
}: VideoEmbedEditorProps) {
  const [videoUrl, setVideoUrl] = useState(frame.content.videoUrl || '')
  const [isEditMode, setIsEditMode] = useState(!frame.content.videoUrl)
  const { preview, isOwner, updateFrame } = useContext(
    EventContext
  ) as EventContextType
  const disabled = preview || readOnly

  const saveVideoUrl = () => {
    if (disabled) return
    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          videoUrl,
        },
      },
      frameId: frame.id,
    })
    setIsEditMode(false)
  }

  if (disabled || !isEditMode) {
    return (
      <div className="w-full h-full flex justify-start items-start">
        <div className="max-w-[90%] w-auto h-full aspect-video overflow-hidden rounded-md">
          <ResponsiveVideoPlayer
            url={videoUrl}
            showControls={isOwner && !readOnly}
            viewOnly={!isOwner}
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
