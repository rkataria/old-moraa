"use client"

import { Button, Input } from "@chakra-ui/react"
import React, { useContext, useState } from "react"

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
        <div className="flex justify-center items-center gap-4 h-full bg-gray-200">
          <Input
            w={96}
            color="black"
            bgColor="white"
            placeholder="Enter video URL"
            onChange={(e) => setVideoUrl(e.target.value)}
            value={videoUrl}
          />
          <Button onClick={saveVideoUrl}>Save</Button>
        </div>
      ) : (
        <ResponsiveVideoPlayer url={videoUrl} />
      )}
    </>
  )
}
