"use client"

import React, { useContext, useState } from "react"
import { Button, Input } from "@nextui-org/react"

import SlideManagerContext from "@/contexts/SlideManagerContext"
import { ISlide, SlideManagerContextType } from "@/types/slide.type"
import { ResponsiveVideoPlayer } from "@/components/common/ResponsiveVideoPlayer"

interface VideoEmbedEditorProps {
  slide: ISlide
}

export default function VideoEmbedEditor({ slide }: VideoEmbedEditorProps) {
  const [videoUrl, setVideoUrl] = useState(slide.content.videoUrl || "")
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

  return (
    <>
      {isEditMode ? (
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
        <ResponsiveVideoPlayer url={videoUrl} />
      )}
    </>
  )
}
