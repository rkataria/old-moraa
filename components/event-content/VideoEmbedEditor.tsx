'use client'

import React, { useContext, useState } from 'react'

import { Button, Input } from '@nextui-org/react'

import { ResponsiveVideoPlayer } from '@/components/common/ResponsiveVideoPlayer'
import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import { ISlide, SlideManagerContextType } from '@/types/slide.type'

interface VideoEmbedEditorProps {
  slide: ISlide & {
    content: {
      videoUrl: string
    }
  }
}

export function VideoEmbedEditor({ slide }: VideoEmbedEditorProps) {
  const [videoUrl, setVideoUrl] = useState(slide.content.videoUrl || '')
  const [isEditMode, setIsEditMode] = useState(!slide.content.videoUrl)
  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  const saveVideoUrl = () => {
    updateSlide({
      ...slide,
      content: {
        videoUrl,
      },
    })
    setIsEditMode(false)
  }

  return isEditMode ? (
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
  ) : (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-4/5 overflow-hidden rounded-md">
        <ResponsiveVideoPlayer url={videoUrl} />
      </div>
    </div>
  )
}
